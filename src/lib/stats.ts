export interface Stats {
  played: number
  /** Days finished without a hint. */
  clean: number
  streak: number
  maxStreak: number
  lastCompleted: number | null
  /** puzzleNumber -> seconds taken */
  history: Record<number, number>
}

export const EMPTY_STATS: Stats = {
  played: 0,
  clean: 0,
  streak: 0,
  maxStreak: 0,
  lastCompleted: null,
  history: {},
}

export function recordCompletion(stats: Stats, puzzleNumber: number, seconds: number, hints: number): Stats {
  if (stats.history[puzzleNumber] !== undefined) return stats
  const streak = stats.lastCompleted === puzzleNumber - 1 ? stats.streak + 1 : 1
  return {
    played: stats.played + 1,
    clean: stats.clean + (hints === 0 ? 1 : 0),
    streak,
    maxStreak: Math.max(stats.maxStreak, streak),
    lastCompleted: puzzleNumber,
    history: { ...stats.history, [puzzleNumber]: seconds },
  }
}

/** The streak as it stands today: it is broken once a whole day is skipped. */
export function currentStreak(stats: Stats, todayNumber: number): number {
  if (stats.lastCompleted === null) return 0
  return todayNumber - stats.lastCompleted <= 1 ? stats.streak : 0
}
