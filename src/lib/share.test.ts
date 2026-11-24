import { describe, expect, it } from 'vitest'
import { prefersNativeShare } from './share.ts'

const share = () => {}
const win = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36'
const android = 'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36'
const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
const mac = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15'

describe('prefersNativeShare', () => {
  it('copies on desktop even when navigator.share exists (Windows share sheet is often empty)', () => {
    expect(prefersNativeShare({ userAgent: win, maxTouchPoints: 0, share })).toBe(false)
    expect(prefersNativeShare({ userAgent: mac, maxTouchPoints: 0, share })).toBe(false)
  })
  it('uses the share sheet on phones and iPads', () => {
    expect(prefersNativeShare({ userAgent: android, maxTouchPoints: 5, share })).toBe(true)
    expect(prefersNativeShare({ userAgent: iphone, maxTouchPoints: 5, share })).toBe(true)
    expect(prefersNativeShare({ userAgent: mac, maxTouchPoints: 5, share })).toBe(true)
  })
  it('copies when the browser has no share API', () => {
    expect(prefersNativeShare({ userAgent: android, maxTouchPoints: 5 })).toBe(false)
  })
})

import { shareText } from './share.ts'

describe('shareText', () => {
  it('shows time, hints and one block per word without the answers', () => {
    const t = shareText({
      kind: 'daily', number: 3, title: '공항에서', size: 12,
      words: [{ word: 'GATE' }, { word: 'SEAT' }], hinted: ['SEAT'], elapsed: 125, url: 'https://example.com',
    })
    expect(t).toBe('하루워드 #3 · 공항에서\n⏱ 2:05 · 힌트 1\n🟩🟨\nhttps://example.com')
    expect(t).not.toContain('GATE')
  })
})
