import { describe, expect, test } from 'vitest'
import * as ljsf from '../src/index.js'

describe('ljsf', () => {
  test('exposes the public API entry', () => {
    expect(ljsf.version).toBe('0.0.0')
  })

  test('runs in a DOM environment', () => {
    document.body.innerHTML = '<p id="hello">hi</p>'
    expect(document.getElementById('hello').textContent).toBe('hi')
  })
})
