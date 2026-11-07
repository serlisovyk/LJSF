import { Dependency, isTracking, untracked } from './observer.js'

const UNSUPPORTED_MESSAGE = 'reactive() supports plain objects and arrays only'
const ITERATE = Symbol('iterate')
const LENGTH = 'length'
const MUTATOR_NAMES = ['push', 'pop', 'shift', 'unshift', 'splice']
const proxies = new WeakMap()
const reactives = new WeakSet()
const dependencies = new WeakMap()

const MUTATORS = Object.fromEntries(
  MUTATOR_NAMES.map((name) => [
    name,
    function (...args) {
      return untracked(() => Array.prototype[name].apply(this, args))
    },
  ]),
)

const HANDLER = {
  get(target, key, receiver) {
    if (Array.isArray(target) && Object.hasOwn(MUTATORS, key)) return MUTATORS[key]

    track(target, key)

    const value = Reflect.get(target, key, receiver)

    return isWrappable(value) ? reactive(value) : value
  },

  has(target, key) {
    track(target, key)

    return Reflect.has(target, key)
  },

  ownKeys(target) {
    track(target, ITERATE)

    return Reflect.ownKeys(target)
  },

  set(target, key, value, receiver) {
    const hadKey = Object.hasOwn(target, key)
    const oldValue = target[key]
    const oldLength = target.length
    const isSet = Reflect.set(target, key, value, receiver)

    if (!hadKey) triggerStructure(target, key)
    else if (!Object.is(oldValue, value)) trigger(target, key)

    if (Array.isArray(target)) triggerLength(target, key, value, oldLength)

    return isSet
  },

  deleteProperty(target, key) {
    const hadKey = Object.hasOwn(target, key)
    const isDeleted = Reflect.deleteProperty(target, key)

    if (hadKey && isDeleted) triggerStructure(target, key)

    return isDeleted
  },
}

export function reactive(target) {
  if (reactives.has(target)) return target
  if (!isWrappable(target)) throw new TypeError(UNSUPPORTED_MESSAGE)

  const existing = proxies.get(target)
  if (existing) return existing

  const proxy = new Proxy(target, HANDLER)
  proxies.set(target, proxy)
  reactives.add(proxy)

  return proxy
}

function isWrappable(value) {
  if (Array.isArray(value)) return true
  if (typeof value !== 'object' || value === null) return false

  const prototype = Object.getPrototypeOf(value)

  return prototype === Object.prototype || prototype === null
}

function track(target, key) {
  if (!isTracking()) return

  let keys = dependencies.get(target)
  if (!keys) {
    keys = new Map()
    dependencies.set(target, keys)
  }

  let dependency = keys.get(key)
  if (!dependency) {
    dependency = new Dependency()
    keys.set(key, dependency)
  }

  dependency.track()
}

function trigger(target, key) {
  dependencies.get(target)?.get(key)?.trigger()
}

function triggerLength(target, key, value, oldLength) {
  if (key !== LENGTH) {
    if (target.length !== oldLength) trigger(target, LENGTH)
    return
  }

  if (value < oldLength) triggerTruncated(target, value)
}

function triggerTruncated(target, length) {
  const keys = dependencies.get(target)
  if (!keys) return

  for (const [key, dependency] of keys) {
    const isRemovedIndex = typeof key === 'string' && Number(key) >= length
    if (isRemovedIndex) dependency.trigger()
  }

  trigger(target, ITERATE)
}

function triggerStructure(target, key) {
  trigger(target, key)
  trigger(target, ITERATE)
}
