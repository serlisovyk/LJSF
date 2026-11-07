import { describe, expect, it, vi } from 'vitest'
import { batch, effect, signal } from '../src/reactivity/index.js'
import { flushMicrotasks } from './helpers.js'

describe('batching', () => {
  it('runs an effect once for several writes in a row', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    effect(run)
    page.set(2)
    page.set(3)
    page.set(4)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(2)
    expect(run).toHaveLastReturnedWith(4)
  })

  it('does not rerun an effect synchronously after a write', () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    effect(run)
    page.set(2)

    expect(run).toHaveBeenCalledTimes(1)
  })

  it('runs an effect once for writes to different signals it read', async () => {
    const page = signal(1)
    const query = signal('')
    const run = vi.fn(() => [page.get(), query.get()])

    effect(run)
    page.set(2)
    query.set('dune')
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(2)
  })
})

describe('batch', () => {
  it('runs the triggered effects right after the callback', () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    effect(run)
    batch(() => {
      page.set(2)
      page.set(3)
      expect(run).toHaveBeenCalledTimes(1)
    })

    expect(run).toHaveBeenCalledTimes(2)
    expect(run).toHaveLastReturnedWith(3)
  })

  it('returns the callback result', () => {
    expect(batch(() => 42)).toBe(42)
  })

  it('flushes only when the outermost batch ends', () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    effect(run)
    batch(() => {
      batch(() => page.set(2))
      expect(run).toHaveBeenCalledTimes(1)
    })

    expect(run).toHaveBeenCalledTimes(2)
  })

  it('flushes even when the callback throws', () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    effect(run)

    expect(() =>
      batch(() => {
        page.set(2)
        throw new Error('boom')
      }),
    ).toThrow('boom')
    expect(run).toHaveBeenCalledTimes(2)
  })

  it('runs the first pass of an effect created inside immediately', () => {
    const run = vi.fn()

    batch(() => {
      effect(run)
      expect(run).toHaveBeenCalledTimes(1)
    })
  })
})
