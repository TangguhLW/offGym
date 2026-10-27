// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const h = vi.hoisted(() => {
  vi.stubEnv('VITE_MOBILE', '1')
  vi.stubEnv('VITE_OFFLINE', '1')
  return { files: new Map() }
})
vi.mock('@capacitor/filesystem', () => ({
  Directory: { Data: 'DATA', Documents: 'DOCUMENTS', Cache: 'CACHE' }, Encoding: { UTF8: 'utf8' },
  Filesystem: {
    readFile: async ({ path, directory }) => {
      const value = h.files.get(directory + '/' + path)
      if (value == null) throw new Error('Missing file')
      return { data: value }
    },
    writeFile: async ({ path, directory, data }) => { h.files.set(directory + '/' + path, data); return { uri: 'file://' + path } },
    rename: async ({ from, to, directory }) => { h.files.set(directory + '/' + to, h.files.get(directory + '/' + from)); h.files.delete(directory + '/' + from) },
  },
}))
vi.mock('@capacitor/local-notifications', () => ({ LocalNotifications: {
  cancel: async () => {}, checkPermissions: async () => ({ display: 'granted' }), schedule: async () => {},
} }))
vi.mock('@capacitor/app', () => ({ App: { addListener: () => ({ remove() {} }) } }))
vi.mock('@capacitor/core', () => ({ Capacitor: { getPlatform: () => 'android', isNativePlatform: () => true }, registerPlugin: () => ({}) }))
vi.mock('./useUI.js', () => ({ useUI: { getState: () => ({ toast() {} }) } }))

beforeEach(() => { vi.resetModules(); localStorage.clear(); h.files.clear(); vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network must not be used') })) })
afterEach(() => { window.dispatchEvent(new Event('pagehide')); vi.unstubAllGlobals() })

describe('offGym offline edition', { timeout: 30000 }, () => {
  it('opens a fresh phone directly in Indonesian with a red accent and no connection flow', async () => {
    const { useStore } = await import('./useStore.js')
    await useStore.getState().boot()
    const state = useStore.getState()
    expect(state.ready).toBe(true)
    expect(state.needsMobileOnboarding).toBe(false)
    expect(state.permSteps).toBe(false)
    expect(state.S.lang).toBe('id')
    expect(state.S.accent).toBe('red')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('keeps saved workouts during the edition upgrade and remembers an English selection', async () => {
    const workout = { id: 'kept', d: '2026-10-26', entries: [] }
    h.files.set('DATA/opengym-state.json', JSON.stringify({ workouts: [workout], accent: 'lime', lang: 'en', _ts: 100 }))
    const { useStore } = await import('./useStore.js')
    await useStore.getState().boot()
    expect(useStore.getState().S.workouts).toEqual([workout])
    useStore.getState().update(s => { s.lang = 'en'; s.langAuto = false })
    await useStore.getState().saveNow()
    vi.resetModules()
    const { useStore: reopened } = await import('./useStore.js')
    await reopened.getState().boot()
    expect(reopened.getState().S.lang).toBe('en')
    expect(reopened.getState().S.workouts).toEqual([workout])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('ignores an old server pairing without deleting local training data', async () => {
    h.files.set('DATA/opengym-remote.json', JSON.stringify({ mode: 'remote', base: 'https://example.invalid', token: 'old-token', user: { id: 'old' } }))
    h.files.set('DATA/opengym-state.json', JSON.stringify({ workouts: [{ id: 'offline-history', d: '2026-10-26', entries: [] }], _ts: 100 }))
    const { useStore } = await import('./useStore.js')
    await useStore.getState().boot()
    expect(useStore.getState().user).toBeNull()
    expect(useStore.getState().S.workouts[0].id).toBe('offline-history')
    expect(useStore.getState().needsMobileOnboarding).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('applies the corrected red to an existing edition without changing its language or workouts', async () => {
    const workout = { id: 'keep-red-update', d: '2026-10-26', entries: [] }
    h.files.set('DATA/opengym-state.json', JSON.stringify({ offGymEdition: 1, lang: 'en', langAuto: false, accent: 'orange', workouts: [workout], _ts: 100 }))
    const { useStore } = await import('./useStore.js')
    await useStore.getState().boot()
    expect(useStore.getState().S.accent).toBe('red')
    expect(useStore.getState().S.lang).toBe('en')
    expect(useStore.getState().S.workouts).toEqual([workout])
  })
})
