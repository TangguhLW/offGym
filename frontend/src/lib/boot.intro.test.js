// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { hideBoot } from './boot.js'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] })
  document.body.innerHTML = '<div id="boot"><svg aria-label="Dumbbell animation"></svg></div>'
})
afterEach(() => { vi.useRealTimers(); document.body.innerHTML = '' })

it('lets the dumbbell intro play on a fast launch before fading into the app', () => {
  const intro = document.getElementById('boot')
  hideBoot()
  hideBoot()
  expect(intro.classList.contains('out')).toBe(false)
  vi.advanceTimersByTime(1499)
  expect(intro.classList.contains('out')).toBe(false)
  vi.advanceTimersByTime(1)
  expect(intro.classList.contains('out')).toBe(true)
  vi.advanceTimersByTime(260)
  expect(document.getElementById('boot')).toBeNull()
})

it('adds no extra intro delay when loading already took longer than the animation', () => {
  vi.advanceTimersByTime(2000)
  hideBoot()
  expect(document.getElementById('boot').classList.contains('out')).toBe(true)
  vi.advanceTimersByTime(260)
  expect(document.getElementById('boot')).toBeNull()
})
