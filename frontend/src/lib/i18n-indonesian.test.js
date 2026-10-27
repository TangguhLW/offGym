// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest'
import { setLang, t, tn, dateLocale, getLang } from './i18n.js'

afterEach(async () => { await setLang('en') })

describe('Indonesian language selection', () => {
  it('loads Indonesian labels, dates and formatted counts, then switches back to English', async () => {
    await setLang('id')
    expect(getLang()).toBe('id')
    expect(dateLocale()).toBe('id-ID')
    expect(t('Settings')).toBe('Pengaturan')
    expect(t('Home')).toBe('Beranda')
    expect(t('Workout')).toBe('Latihan')
    expect(t('Legal information')).toBe('Informasi legal')
    expect(t('Hi {0}', 'Thangguh')).toBe('Hai Thangguh')
    expect(tn('{0} set', '{0} sets', 3)).toBe('3 set')
    await setLang('en')
    expect(t('Settings')).toBe('Settings')
    expect(t('Home')).toBe('Home')
  })
})
