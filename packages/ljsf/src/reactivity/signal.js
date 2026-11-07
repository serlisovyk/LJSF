import { Dependency } from './observer.js'

export class Signal {
  #value
  #dependency = new Dependency()

  constructor(value) {
    this.#value = value
  }

  get() {
    this.#dependency.track()

    return this.#value
  }

  set(value) {
    if (Object.is(value, this.#value)) return

    this.#value = value
    this.#dependency.trigger()
  }
}

export function signal(value) {
  return new Signal(value)
}
