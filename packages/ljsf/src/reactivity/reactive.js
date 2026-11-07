import { Dependency, isTracking } from './observer.js'

const UNSUPPORTED_MESSAGE = 'reactive() supports plain objects and arrays only'
const ITERATE = Symbol('iterate')
const proxies = new WeakMap()
const reactives = new WeakSet()
const dependencies = new WeakMap()

const HANDLER = {
  get(target, key, receiver) {
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
    const isSet = Reflect.set(target, key, value, receiver)

    if (!hadKey) triggerStructure(target, key)
    else if (!Object.is(oldValue, value)) trigger(target, key)

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

function triggerStructure(target, key) {
  trigger(target, key)
  trigger(target, ITERATE)
}
