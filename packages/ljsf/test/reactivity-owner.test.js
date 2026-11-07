import { describe, expect, test, vi } from 'vitest'
import { Owner, effect, signal } from '../src/reactivity/index.js'
import { flushMicrotasks } from './helpers.js'

describe('Owner', () => {
  test('stops the effects created in its scope when disposed', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())
    const owner = new Owner()

    owner.scope(() => effect(run))
    owner.dispose()
    page.set(2)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('keeps the effects created outside its scope', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())
    const owner = new Owner()

    effect(run)
    owner.dispose()
    page.set(2)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(2)
  })

  test('returns the scope callback result', () => {
    const owner = new Owner()

    expect(owner.scope(() => 42)).toBe(42)
  })

  test('leaves the scope even when the callback throws', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())
    const owner = new Owner()

    expect(() =>
      owner.scope(() => {
        throw new Error('boom')
      }),
    ).toThrow('boom')
    effect(run)
    owner.dispose()
    page.set(2)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(2)
  })

  test('disposes child owners with their parent', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())
    const parent = new Owner()

    parent.scope(() => {
      const child = new Owner()
      child.scope(() => effect(run))
    })
    parent.dispose()
    page.set(2)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('can be disposed twice', () => {
    const owner = new Owner()

    owner.dispose()

    expect(() => owner.dispose()).not.toThrow()
  })

  test('can be disposed after an effect it owns was disposed', () => {
    const owner = new Owner()
    const dispose = owner.scope(() => effect(() => {}))

    dispose()

    expect(() => owner.dispose()).not.toThrow()
  })
})

describe('effect ownership', () => {
  test('disposes an effect created inside another one with its parent', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    const dispose = effect(() => {
      effect(run)
    })
    dispose()
    page.set(2)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('disposes the effects of the previous run when an effect reruns', async () => {
    const outer = signal(1)
    const inner = signal(1)
    const run = vi.fn(() => inner.get())

    effect(() => {
      outer.get()
      effect(run)
    })
    outer.set(2)
    await flushMicrotasks()
    run.mockClear()
    inner.set(2)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('does not run an effect disposed while it was queued', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    const dispose = effect(run)
    page.set(2)
    dispose()
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })

  test('does not run a queued effect whose owner was disposed', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())
    const owner = new Owner()

    owner.scope(() => effect(run))
    page.set(2)
    owner.dispose()
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })
})
