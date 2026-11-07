import { describe, expect, it, vi } from 'vitest'
import * as ljsf from '../src/index.js'
import { effect, reactive } from '../src/index.js'
import { flushMicrotasks } from './helpers.js'

describe('ljsf public API', () => {
  it('exports reactive, effect and batch', () => {
    expect(ljsf.reactive).toBeTypeOf('function')
    expect(ljsf.effect).toBeTypeOf('function')
    expect(ljsf.batch).toBeTypeOf('function')
  })

  it('keeps signal, computed and owners internal', () => {
    expect(Object.keys(ljsf).sort()).toEqual([
      'batch',
      'effect',
      'reactive',
      'version',
    ])
  })

  it('updates an effect through a reactive object', async () => {
    const state = reactive({ page: 1 })
    const run = vi.fn(() => state.page)

    effect(run)
    state.page = 2
    await flushMicrotasks()

    expect(run).toHaveBeenCalledTimes(2)
  })
})
