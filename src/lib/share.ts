export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  return `${m}:${String(seconds % 60).padStart(2, '0')}`
}

export interface ShareInput {
  kind: 'daily' | 'practice'
  number: number
  title: string
  size: number
  words: { word: string }[]
  hinted: string[]
  elapsed: number
  url: string
}

/** Spoiler-free result: time, hints, one block per word (yellow = hint used). */
export function shareText(s: ShareInput): string {
  const hints = s.hinted.length
  if (s.kind === 'practice')
    return `하루워드 연습 ${s.size}×${s.size}\n⏱ ${formatTime(s.elapsed)} · 힌트 ${hints} · 단어 ${s.words.length}개\n${s.url}`
  const blocks = s.words.map((w) => (s.hinted.includes(w.word) ? '🟨' : '🟩')).join('')
  return `하루워드 #${s.number} · ${s.title}\n⏱ ${formatTime(s.elapsed)} · 힌트 ${hints}\n${blocks}\n${s.url}`
}

/**
 * Only phones and tablets get the OS share sheet. Desktop Windows exposes
 * navigator.share too, but its sheet is often empty, so desktops copy instead.
 */
export function prefersNativeShare(
  nav: Pick<Navigator, 'userAgent' | 'maxTouchPoints'> & { share?: unknown } = navigator,
): boolean {
  if (typeof nav.share !== 'function') return false
  const ua = nav.userAgent
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true
  // iPadOS reports a Mac user agent; touch points give it away.
  return /Macintosh/.test(ua) && nav.maxTouchPoints > 1
}

/** Clipboard API first, then the older execCommand path. Resolves false if both fail. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    /* blocked (in-app browsers, http): try the legacy path */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch {
    return false
  }
}
