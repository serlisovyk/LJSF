import { describe, expect, test, vi } from 'vitest'
import { effect, signal } from '../src/reactivity/index.js'
import { flushMicrotasks } from './helpers.js'

describe('effect', () => {
  test('runs once immediately', () => {
    const run = vi.fn()

    effect(run)

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('reruns after a signal it read changes', async () => {
    const page = signal(1)
    const seen = []

    effect(() => seen.push(page.get()))
    page.set(2)
    await flushMicrotasks()

    expect(seen).toEqual([1, 2])
  })

  test('does not rerun for a signal it did not read', async () => {
    const page = signal(1)
    const query = signal('')
    const run = vi.fn(() => page.get())

    effect(run)
    query.set('dune')
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('does not rerun when the same value is written', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    effect(run)
    page.set(1)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('drops a dependency the last run no longer reads', async () => {
    const isLong = signal(true)
    const long = signal('long')
    const short = signal('short')
    const run = vi.fn(() => (isLong.get() ? long.get() : short.get()))

    effect(run)
    isLong.set(false)
    await flushMicrotasks()
    run.mockClear()
    long.set('longer')
    await flushMicrotasks()

    expect(run).not.toHaveBeenCalled()
  })

  test('subscribes to a dependency a later run starts reading', async () => {
    const isShort = signal(false)
    const short = signal('short')
    const run = vi.fn(() => isShort.get() && short.get())

    effect(run)
    isShort.set(true)
    await flushMicrotasks()
    run.mockClear()
    short.set('shorter')
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('stops running once the returned disposer is called', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    const dispose = effect(run)
    dispose()
    page.set(2)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })
})
