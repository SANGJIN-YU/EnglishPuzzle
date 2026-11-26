import type { Line } from './grid.ts'
import { EMPTY_STATS, type Stats } from './stats.ts'
import { backupRecords } from './toss.ts'

/** Progress on one daily board. */
export interface Play {
  found: Record<string, Line>
  hinted: string[]
  elapsed: number
  done: boolean
}

export const EMPTY_PLAY: Play = { found: {}, hinted: [], elapsed: 0, done: false }

const PLAY_PREFIX = 'haruword:play:'
const STATS_KEY = 'haruword:stats'
const SEEN_HELP_KEY = 'haruword:seen-help'

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    backupRecords()
  } catch {
    // Private mode or storage full: the game still works for this visit.
  }
}

export const loadPlay = (n: number): Play | null => read<Play>(PLAY_PREFIX + n)
export const savePlay = (n: number, play: Play) => write(PLAY_PREFIX + n, play)
export const loadStats = (): Stats => ({ ...EMPTY_STATS, ...read<Stats>(STATS_KEY) })
export const saveStats = (stats: Stats) => write(STATS_KEY, stats)
export const loadSeenHelp = (): boolean => read<boolean>(SEEN_HELP_KEY) === true
export const saveSeenHelp = () => write(SEEN_HELP_KEY, true)
