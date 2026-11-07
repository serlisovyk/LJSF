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

  try {
    for (const effect of queue) {
      queue.delete(effect)
      effect.execute()
    }
  } finally {
    isFlushing = false
  }
}
