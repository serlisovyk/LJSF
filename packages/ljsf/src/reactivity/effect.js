import { Observer } from './observer.js'
import { schedule } from './scheduler.js'

export class Effect extends Observer {
  #fn

  constructor(fn) {
    super()
    this.#fn = fn
    this.execute()
  }

  notify() {
    schedule(this)
  }

  execute() {
    this.observe(this.#fn)
  }
}

export function effect(fn) {
  const instance = new Effect(fn)

  return () => instance.dispose()
}
