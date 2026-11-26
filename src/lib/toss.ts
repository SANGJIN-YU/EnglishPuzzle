/**
 * Toss mini app (앱인토스) glue. Only the `--mode toss` build talks to the Toss
 * SDK; the web build never loads it (IS_TOSS is a build-time constant, so the
 * dynamic imports below are dropped from the Cloudflare bundle).
 *
 * Records stay on the device, no login. The WebView's localStorage is the
 * working copy; a snapshot is mirrored to Toss's native Storage, which survives
 * app restarts and mini app updates even if the WebView storage is reset.
 */
export const IS_TOSS = import.meta.env.MODE === 'toss'

const PREFIX = 'haruword:'
const BACKUP_KEY = 'haruword:backup'

// Written inline so the web build can fold it to a rejection and drop the SDK chunk.
const sdk = () =>
  import.meta.env.MODE === 'toss' ? import('@apps-in-toss/web-framework') : Promise.reject(new Error('not in Toss'))

function snapshot(): Record<string, string> {
  const out: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(PREFIX)) out[k] = localStorage.getItem(k) ?? ''
  }
  return out
}

/** Before first render: refill localStorage from the native backup if it was wiped. */
export async function restoreRecords(): Promise<void> {
  if (!IS_TOSS) return
  // Never hold the first screen hostage to the bridge.
  await Promise.race([restore(), new Promise((r) => setTimeout(r, 1500))])
}

async function restore(): Promise<void> {
  try {
    const { Storage } = await sdk()
    const raw = await Storage.getItem(BACKUP_KEY)
    if (!raw) return
    const saved = JSON.parse(raw) as Record<string, string>
    for (const [k, v] of Object.entries(saved)) {
      if (k.startsWith(PREFIX) && localStorage.getItem(k) === null) localStorage.setItem(k, v)
    }
  } catch {
    // Outside the Toss app or storage blocked: play on with what we have.
  }
}

let timer: ReturnType<typeof setTimeout> | undefined

/** After each save: mirror all records to native storage (batched, saves are frequent mid-game). */
export function backupRecords(): void {
  if (!IS_TOSS) return
  clearTimeout(timer)
  timer = setTimeout(async () => {
    try {
      const { Storage } = await sdk()
      await Storage.setItem(BACKUP_KEY, JSON.stringify(snapshot()))
    } catch {
      /* best effort */
    }
  }, 500)
}

/** Link that opens this mini app inside Toss; '' if it can't be made. */
export async function tossLink(): Promise<string> {
  try {
    const { Share } = await sdk()
    return await Share.createLink({ path: 'intoss://haru-word' })
  } catch {
    return ''
  }
}

/** Toss's native share sheet. Resolves false if it isn't available. */
export async function tossShare(message: string): Promise<boolean> {
  try {
    const { Share } = await sdk()
    await Share.sendMessage({ message })
    return true
  } catch {
    return false
  }
}

/** Clipboard through the SDK (the WebView may block navigator.clipboard). */
export async function tossCopy(text: string): Promise<boolean> {
  try {
    const { Clipboard } = await sdk()
    await Clipboard.setText(text)
    return true
  } catch {
    return false
  }
}
