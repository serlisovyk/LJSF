const MAX_RUNS_PER_FLUSH = 100
const CYCLE_MESSAGE = 'Reactive cycle: an effect keeps rewriting what it reads'
const queue = new Set()
let batchDepth = 0
let isScheduled = false
let isFlushing = false

export function schedule(effect) {
  queue.add(effect)

  if (batchDepth > 0 || isScheduled || isFlushing) return

  isScheduled = true
  queueMicrotask(flushScheduled)
}

export function batch(fn) {
  batchDepth++

  try {
    return fn()
  } finally {
    batchDepth--
    if (batchDepth === 0) flush()
  }
}

function flushScheduled() {
  isScheduled = false
  flush()
}

function flush() {
  if (isFlushing) return

  isFlushing = true

  const runCounts = new Map()
  const errors = []

  try {
    for (const effect of queue) {
      queue.delete(effect)
      countRun(runCounts, effect)

      try {
        effect.execute()
      } catch (error) {
        errors.push(error)
      }
    }
  } finally {
    isFlushing = false
  }

  if (errors.length > 0) throw errors[0]
}

function countRun(runCounts, effect) {
  const runCount = (runCounts.get(effect) ?? 0) + 1

  if (runCount > MAX_RUNS_PER_FLUSH) {
    queue.clear()
    throw new Error(CYCLE_MESSAGE)
  }

  runCounts.set(effect, runCount)
}
