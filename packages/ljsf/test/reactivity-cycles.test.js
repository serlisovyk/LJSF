import { describe, expect, test, vi } from 'vitest'
import { batch, effect, signal } from '../src/reactivity/index.js'
import { flushMicrotasks } from './helpers.js'

const RUNAWAY_RUNS = 1000
const CYCLE_ERROR = /Reactive cycle/

describe('cycle protection', () => {
  test('throws when an effect keeps rewriting its own dependency', () => {
    const count = signal(0)
    let runs = 0

    expect(() =>
      batch(() =>
        effect(() => {
          runs++
          if (runs < RUNAWAY_RUNS) count.set(count.get() + 1)
        }),
      ),
    ).toThrow(CYCLE_ERROR)
  })

  test('stops the runaway effect instead of running it forever', () => {
    const count = signal(0)
    const run = vi.fn(() => {
      if (run.mock.calls.length < RUNAWAY_RUNS) count.set(count.get() + 1)
    })

    expect(() => batch(() => effect(run))).toThrow(CYCLE_ERROR)
    expect(run.mock.calls.length).toBeLessThan(RUNAWAY_RUNS)
  })

  test('throws for two effects that keep triggering each other', () => {
    const ping = signal(0)
    const pong = signal(0)
    let runs = 0

    expect(() =>
      batch(() => {
        effect(() => {
          if (runs++ < RUNAWAY_RUNS) pong.set(ping.get() + 1)
        })
        effect(() => {
          if (runs++ < RUNAWAY_RUNS) ping.set(pong.get() + 1)
        })
      }),
    ).toThrow(CYCLE_ERROR)
  })

  test('lets an effect that settles rewrite its own dependency', () => {
    const count = signal(0)
    const seen = []

    batch(() =>
      effect(() => {
        seen.push(count.get())
        if (count.get() < 5) count.set(count.get() + 1)
      }),
    )

    expect(seen).toEqual([0, 1, 2, 3, 4, 5])
  })

  test('keeps scheduling effects after a cycle was reported', async () => {
    const count = signal(0)
    const page = signal(1)
    const run = vi.fn(() => page.get())
    let runs = 0

    expect(() =>
      batch(() =>
        effect(() => {
          runs++
          if (runs < RUNAWAY_RUNS) count.set(count.get() + 1)
        }),
      ),
    ).toThrow(CYCLE_ERROR)
    effect(run)
    page.set(2)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(2)
  })
})

describe('effect errors', () => {
  test('runs the other queued effects when one throws and rethrows the error', () => {
    const page = signal(1)
    const other = vi.fn(() => page.get())

    effect(() => {
      if (page.get() > 1) throw new Error('boom')
    })
    effect(other)

    expect(() => batch(() => page.set(2))).toThrow('boom')
    expect(other).toHaveBeenCalledTimes(2)
  })

  test('keeps scheduling effects after one threw', async () => {
    const page = signal(1)
    const run = vi.fn(() => page.get())

    effect(() => {
      if (page.get() === 2) throw new Error('boom')
    })
    effect(run)
    expect(() => batch(() => page.set(2))).toThrow('boom')
    page.set(3)
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(3)
  })
})
