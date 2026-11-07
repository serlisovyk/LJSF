import { describe, expect, it, vi } from 'vitest'
import { computed, effect, signal } from '../src/reactivity/index.js'
import { flushMicrotasks } from './helpers.js'

describe('computed', () => {
  it('is not calculated until it is read', () => {
    const page = signal(1)
    const calculate = vi.fn(() => page.get() * 2)

    computed(calculate)

    expect(calculate).not.toHaveBeenCalled()
  })

  it('returns the calculated value', () => {
    const page = signal(2)
    const double = computed(() => page.get() * 2)

    expect(double.get()).toBe(4)
  })

  it('caches the value while its sources are unchanged', () => {
    const page = signal(1)
    const calculate = vi.fn(() => page.get() * 2)
    const double = computed(calculate)

    double.get()
    double.get()

    expect(calculate).toHaveBeenCalledTimes(1)
  })

  it('is recalculated on the next read after a source changed', () => {
    const page = signal(1)
    const calculate = vi.fn(() => page.get() * 2)
    const double = computed(calculate)

    double.get()
    page.set(5)

    expect(calculate).toHaveBeenCalledTimes(1)
    expect(double.get()).toBe(10)
    expect(calculate).toHaveBeenCalledTimes(2)
  })

  it('is recalculated once however many sources changed', () => {
    const first = signal(1)
    const second = signal(2)
    const calculate = vi.fn(() => first.get() + second.get())
    const sum = computed(calculate)

    sum.get()
    first.set(10)
    second.set(20)

    expect(sum.get()).toBe(30)
    expect(calculate).toHaveBeenCalledTimes(2)
  })

  it('drops a source the last calculation no longer read', () => {
    const isLong = signal(true)
    const long = signal('long')
    const short = signal('short')
    const calculate = vi.fn(() => (isLong.get() ? long.get() : short.get()))
    const label = computed(calculate)

    label.get()
    isLong.set(false)
    label.get()
    long.set('longer')
    label.get()

    expect(calculate).toHaveBeenCalledTimes(2)
  })

  it('chains through other computed values', () => {
    const page = signal(1)
    const double = computed(() => page.get() * 2)
    const quadruple = computed(() => double.get() * 2)

    expect(quadruple.get()).toBe(4)
    page.set(3)
    expect(quadruple.get()).toBe(12)
  })

  it('reruns an effect that read it when a source changes', async () => {
    const page = signal(1)
    const double = computed(() => page.get() * 2)
    const seen = []

    effect(() => seen.push(double.get()))
    page.set(2)
    await flushMicrotasks()

    expect(seen).toEqual([2, 4])
  })

  it('reruns an effect through a chain of computed values', async () => {
    const page = signal(1)
    const double = computed(() => page.get() * 2)
    const quadruple = computed(() => double.get() * 2)
    const seen = []

    effect(() => seen.push(quadruple.get()))
    page.set(2)
    await flushMicrotasks()

    expect(seen).toEqual([4, 8])
  })

  it('does not rerun an effect for a change in a source it never read', async () => {
    const page = signal(1)
    const query = signal('')
    const double = computed(() => page.get() * 2)
    const run = vi.fn(() => double.get())

    effect(run)
    query.set('dune')
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(1)
  })
})
