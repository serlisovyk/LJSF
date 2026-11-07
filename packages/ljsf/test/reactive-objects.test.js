import { describe, expect, it, vi } from 'vitest'
import { effect, reactive } from '../src/reactivity/index.js'
import { flushMicrotasks } from './helpers.js'

describe('reactive objects', () => {
  it('reads and writes like the plain object', () => {
    const state = reactive({ page: 1 })

    state.page = 2

    expect(state.page).toBe(2)
  })

  it('reruns only the effects that read the changed key', async () => {
    const state = reactive({ page: 1, query: '' })
    const readPage = vi.fn(() => state.page)
    const readQuery = vi.fn(() => state.query)

    effect(readPage)
    effect(readQuery)
    state.page = 2
    await flushMicrotasks()

    expect(readPage).toHaveBeenCalledTimes(2)
    expect(readQuery).toHaveBeenCalledTimes(1)
  })

  it('does not rerun when the same value is written', async () => {
    const state = reactive({ page: 1 })
    const run = vi.fn(() => state.page)

    effect(run)
    state.page = 1
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  it('runs an effect once for several writes in a row', async () => {
    const state = reactive({ page: 1, query: '' })
    const run = vi.fn(() => [state.page, state.query])

    effect(run)
    state.page = 2
    state.page = 3
    state.query = 'dune'
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(2)
  })

  it('drops a key the last run no longer reads', async () => {
    const state = reactive({ isLong: true, long: 'long', short: 'short' })
    const run = vi.fn(() => (state.isLong ? state.long : state.short))

    effect(run)
    state.isLong = false
    await flushMicrotasks()
    run.mockClear()
    state.long = 'longer'
    await flushMicrotasks()

    expect(run).not.toHaveBeenCalled()
  })

  it('tracks a key that did not exist when the effect read it', async () => {
    const state = reactive({})
    const seen = []

    effect(() => seen.push(state.page))
    state.page = 2
    await flushMicrotasks()

    expect(seen).toEqual([undefined, 2])
  })

  it('tracks the presence of a key with in', async () => {
    const state = reactive({})
    const seen = []

    effect(() => seen.push('page' in state))
    state.page = 1
    await flushMicrotasks()

    expect(seen).toEqual([false, true])
  })

  it('reruns key listings when a key is added', async () => {
    const state = reactive({ page: 1 })
    const seen = []

    effect(() => seen.push(Object.keys(state)))
    state.query = ''
    await flushMicrotasks()

    expect(seen).toEqual([['page'], ['page', 'query']])
  })

  it('reruns key listings when a key is deleted', async () => {
    const state = reactive({ page: 1, query: '' })
    const seen = []

    effect(() => seen.push(Object.keys(state)))
    delete state.query
    await flushMicrotasks()

    expect(seen).toEqual([['page', 'query'], ['page']])
  })

  it('reruns the effects that read a deleted key', async () => {
    const state = reactive({ page: 1 })
    const seen = []

    effect(() => seen.push(state.page))
    delete state.page
    await flushMicrotasks()

    expect(seen).toEqual([1, undefined])
  })

  it('does not rerun key listings when a value changes', async () => {
    const state = reactive({ page: 1 })
    const run = vi.fn(() => Object.keys(state))

    effect(run)
    state.page = 2
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  it('runs getters of the object against the proxy', async () => {
    const state = reactive({
      page: 1,
      get next() {
        return this.page + 1
      },
    })
    const seen = []

    effect(() => seen.push(state.next))
    state.page = 2
    await flushMicrotasks()

    expect(seen).toEqual([2, 3])
  })
})

describe('reactive nesting', () => {
  it('reruns an effect when a nested key changes', async () => {
    const state = reactive({ user: { name: 'Ada' } })
    const seen = []

    effect(() => seen.push(state.user.name))
    state.user.name = 'Grace'
    await flushMicrotasks()

    expect(seen).toEqual(['Ada', 'Grace'])
  })

  it('does not rerun an effect that read only the parent key', async () => {
    const state = reactive({ user: { name: 'Ada' } })
    const run = vi.fn(() => state.user)

    effect(run)
    state.user.name = 'Grace'
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  it('reruns an effect when a nested object is replaced', async () => {
    const state = reactive({ user: { name: 'Ada' } })
    const seen = []

    effect(() => seen.push(state.user.name))
    state.user = { name: 'Grace' }
    await flushMicrotasks()

    expect(seen).toEqual(['Ada', 'Grace'])
  })

  it('returns the same wrapper for the same nested object', () => {
    const state = reactive({ user: { name: 'Ada' } })

    expect(state.user).toBe(state.user)
  })

  it('returns the same proxy when the same object is wrapped twice', () => {
    const target = { page: 1 }

    expect(reactive(target)).toBe(reactive(target))
  })

  it('returns a proxy itself when it is wrapped again', () => {
    const state = reactive({ page: 1 })

    expect(reactive(state)).toBe(state)
  })

  it('wraps a nested object added to the raw object after reactive()', async () => {
    const target = { page: 1 }
    const state = reactive(target)
    target.user = { name: 'Ada' }
    const seen = []

    effect(() => seen.push(state.user.name))
    state.user.name = 'Grace'
    await flushMicrotasks()

    expect(seen).toEqual(['Ada', 'Grace'])
  })

  it('keeps the raw object unchanged', () => {
    const target = { user: { name: 'Ada' } }
    const state = reactive(target)

    state.user.name = 'Grace'

    expect(target.user.name).toBe('Grace')
  })
})

describe('unsupported values', () => {
  it.each([
    ['a Map', new Map()],
    ['a Set', new Set()],
    ['a class instance', new Date()],
    ['a primitive', 1],
    ['null', null],
  ])('throws a TypeError for %s', (_name, value) => {
    expect(() => reactive(value)).toThrow(
      new TypeError('reactive() supports plain objects and arrays only'),
    )
  })

  it('returns a nested Map as is', () => {
    const items = new Map()
    const state = reactive({ items })

    expect(state.items).toBe(items)
  })

  it('returns a nested Set as is', () => {
    const tags = new Set()
    const state = reactive({ tags })

    expect(state.tags).toBe(tags)
  })
})
