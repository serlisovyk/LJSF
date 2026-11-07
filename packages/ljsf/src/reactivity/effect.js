import { Observer } from './observer.js'

export class Effect extends Observer {
  #fn

  constructor(fn) {
    super()
    this.#fn = fn
    this.execute()
  }

  notify() {
    this.execute()
  }

  execute() {
    this.observe(this.#fn)
  }
}

export function effect(fn) {
  const instance = new Effect(fn)

  return () => instance.dispose()
}
