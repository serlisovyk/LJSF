import { Owner } from './owner.js'

let activeObserver = null

export function isTracking() {
  return activeObserver !== null
}

export class Dependency {
  #subscribers = new Set()

  track() {
    if (!activeObserver) return

    this.#subscribers.add(activeObserver)
    activeObserver.dependencies.add(this)
  }

  trigger() {
    for (const subscriber of this.#subscribers) subscriber.notify()
  }

  unsubscribe(observer) {
    this.#subscribers.delete(observer)
  }
}

export class Observer extends Owner {
  dependencies = new Set()

  observe(fn) {
    this.#unsubscribe()

    const previousObserver = activeObserver
    activeObserver = this

    try {
      return fn()
    } finally {
      activeObserver = previousObserver
    }
  }

  dispose() {
    this.#unsubscribe()
    super.dispose()
  }

  #unsubscribe() {
    for (const dependency of this.dependencies) dependency.unsubscribe(this)

    this.dependencies.clear()
  }
}
