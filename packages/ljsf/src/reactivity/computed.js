import { Dependency, Observer } from './observer.js'

export class Computed extends Observer {
  #fn
  #value
  #isDirty = true
  #dependency = new Dependency()

  constructor(fn) {
    super()
    this.#fn = fn
  }

  get() {
    this.#dependency.track()

    if (this.#isDirty) {
      this.#value = this.observe(this.#fn)
      this.#isDirty = false
    }

    return this.#value
  }

  notify() {
    if (this.#isDirty) return

    this.#isDirty = true
    this.#dependency.trigger()
  }
}

export function computed(fn) {
  return new Computed(fn)
}
