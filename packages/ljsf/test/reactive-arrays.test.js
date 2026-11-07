import { describe, expect, test, vi } from 'vitest'
import { effect, reactive } from '../src/reactivity/index.js'
import { flushMicrotasks } from './helpers.js'

describe('reactive arrays', () => {
  test('reads like the plain array', () => {
    const items = reactive(['a', 'b'])

    expect([items.length, items[1], items.includes('a')]).toEqual([2, 'b', true])
  })

  test('wraps an array nested in an object', async () => {
    const state = reactive({ items: ['a'] })
    const seen = []

    effect(() => seen.push(state.items.length))
    state.items.push('b')
    await flushMicrotasks()

    expect(seen).toEqual([1, 2])
  })

  test('returns the same wrapper for the same nested array', () => {
    const state = reactive({ items: [] })

    expect(state.items).toBe(state.items)
  })

  test('wraps objects inside an array lazily', async () => {
    const items = reactive([{ title: 'Dune', isRead: false }])
    const seen = []

    effect(() => seen.push(items[0].isRead))
    items[0].isRead = true
    await flushMicrotasks()

    expect(seen).toEqual([false, true])
  })
})

describe('reactive array writes', () => {
  test('reruns a length reader after push', async () => {
    const items = reactive(['a'])
    const seen = []

    effect(() => seen.push(items.length))
    items.push('b')
    await flushMicrotasks()

    expect(seen).toEqual([1, 2])
  })

  test('reruns an iterating effect after push', async () => {
    const items = reactive(['a'])
    const seen = []

    effect(() => seen.push(items.map((item) => item.toUpperCase())))
    items.push('b')
    await flushMicrotasks()

    expect(seen).toEqual([['A'], ['A', 'B']])
  })

  test('reruns a for...of loop after push', async () => {
    const items = reactive(['a'])
    const seen = []

    effect(() => {
      const copy = []
      for (const item of items) copy.push(item)
      seen.push(copy)
    })
    items.push('b')
    await flushMicrotasks()

    expect(seen).toEqual([['a'], ['a', 'b']])
  })

  test('runs an effect once for a push of several items', async () => {
    const items = reactive([])
    const run = vi.fn(() => items.length)

    effect(run)
    items.push('a', 'b', 'c')
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(2)
    expect(run).toHaveLastReturnedWith(3)
  })

  test('does not rerun an effect that read another index after push', async () => {
    const items = reactive(['a'])
    const run = vi.fn(() => items[0])

    effect(run)
    items.push('b')
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('reruns an index reader after an index write', async () => {
    const items = reactive(['a', 'b'])
    const seen = []

    effect(() => seen.push(items[1]))
    items[1] = 'c'
    await flushMicrotasks()

    expect(seen).toEqual(['b', 'c'])
  })

  test('does not rerun a reader of another index after an index write', async () => {
    const items = reactive(['a', 'b'])
    const run = vi.fn(() => items[0])

    effect(run)
    items[1] = 'c'
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('reruns a length reader when an index past the end is written', async () => {
    const items = reactive(['a'])
    const seen = []

    effect(() => seen.push(items.length))
    items[3] = 'd'
    await flushMicrotasks()

    expect(seen).toEqual([1, 4])
  })

  test('reruns a reader of a missing index when it is written', async () => {
    const items = reactive([])
    const seen = []

    effect(() => seen.push(items[0]))
    items[0] = 'a'
    await flushMicrotasks()

    expect(seen).toEqual([undefined, 'a'])
  })

  test('reruns a length reader after pop and returns the item', async () => {
    const items = reactive(['a', 'b'])
    const seen = []

    effect(() => seen.push(items.length))

    expect(items.pop()).toBe('b')
    await flushMicrotasks()

    expect(seen).toEqual([2, 1])
  })

  test('reruns an iterating effect after shift', async () => {
    const items = reactive(['a', 'b', 'c'])
    const seen = []

    effect(() => seen.push([...items]))

    expect(items.shift()).toBe('a')
    await flushMicrotasks()

    expect(seen).toEqual([
      ['a', 'b', 'c'],
      ['b', 'c'],
    ])
  })

  test('reruns an iterating effect after unshift', async () => {
    const items = reactive(['b'])
    const seen = []

    effect(() => seen.push([...items]))
    items.unshift('a')
    await flushMicrotasks()

    expect(seen).toEqual([['b'], ['a', 'b']])
  })

  test('reruns an iterating effect after splice removes items', async () => {
    const items = reactive(['a', 'b', 'c', 'd'])
    const seen = []

    effect(() => seen.push([...items]))

    expect(items.splice(1, 2)).toEqual(['b', 'c'])
    await flushMicrotasks()

    expect(seen).toEqual([
      ['a', 'b', 'c', 'd'],
      ['a', 'd'],
    ])
  })

  test('reruns an iterating effect after splice inserts items', async () => {
    const items = reactive(['a', 'd'])
    const seen = []

    effect(() => seen.push([...items]))
    items.splice(1, 0, 'b', 'c')
    await flushMicrotasks()

    expect(seen).toEqual([
      ['a', 'd'],
      ['a', 'b', 'c', 'd'],
    ])
  })

  test('reruns an index reader after splice moves its item', async () => {
    const items = reactive(['a', 'b', 'c'])
    const seen = []

    effect(() => seen.push(items[1]))
    items.splice(0, 1)
    await flushMicrotasks()

    expect(seen).toEqual(['b', 'c'])
  })

  test('reruns readers of removed indexes when length is cut', async () => {
    const items = reactive(['a', 'b', 'c'])
    const seen = []

    effect(() => seen.push(items[2]))
    items.length = 1
    await flushMicrotasks()

    expect(seen).toEqual(['c', undefined])
  })

  test('reruns an iterating effect when length is cut', async () => {
    const items = reactive(['a', 'b', 'c'])
    const seen = []

    effect(() => seen.push([...items]))
    items.length = 0
    await flushMicrotasks()

    expect(seen).toEqual([['a', 'b', 'c'], []])
  })

  test('keeps the raw array in step with the proxy', () => {
    const target = ['a']
    const items = reactive(target)

    items.push('b')
    items.splice(0, 1)

    expect(target).toEqual(['b'])
  })

  test('does not subscribe an effect to an array it only mutates', async () => {
    const log = reactive([])
    const source = reactive({ value: 1 })
    const run = vi.fn(() => log.push(source.value))

    effect(run)
    source.value = 2
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(2)
    expect([...log]).toEqual([1, 2])
  })
})
