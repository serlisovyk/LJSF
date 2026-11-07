let currentOwner = null

export class Owner {
  #parent = currentOwner
  #children = new Set()
  #isDisposed = false

  constructor() {
    this.#parent?.adopt(this)
  }

  get isDisposed() {
    return this.#isDisposed
  }

  adopt(child) {
    this.#children.add(child)
  }

  release(child) {
    this.#children.delete(child)
  }

  scope(fn) {
    const previousOwner = currentOwner
    currentOwner = this

    try {
      return fn()
    } finally {
      currentOwner = previousOwner
    }
  }

  clear() {
    for (const child of this.#children) child.dispose()
  }

  dispose() {
    if (this.#isDisposed) return

    this.#isDisposed = true
    this.clear()
    this.#parent?.release(this)
  }
}
