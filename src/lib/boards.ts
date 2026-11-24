import { PUZZLES, type Puzzle } from '../puzzles.ts'
import { LAUNCH_DATE } from './day.ts'
import { buildBoard, hashString, mulberry32, shuffle, type Board } from './grid.ts'

export interface GameBoard extends Board {
  /** Changes whenever a different board is shown; used as a React key. */
  id: string
  kind: 'daily' | 'practice'
  /** Daily puzzle number (0 for practice). */
  number: number
  title: string
  sub: string
}

export const DAILY_SIZE = 12
export const PRACTICE_SIZES = [12, 18, 24, 30] as const
export type PracticeSize = (typeof PRACTICE_SIZES)[number]
const MIXED_COUNT: Record<PracticeSize, number> = { 12: 10, 18: 16, 24: 24, 30: 34 }

/** "2026-11-24" for puzzle #1. Seeds the daily board, so everyone gets the same grid. */
export function isoForPuzzle(n: number): string {
  return new Date(Date.parse(`${LAUNCH_DATE}T00:00:00Z`) + (n - 1) * 86_400_000).toISOString().slice(0, 10)
}

/** The puzzle for day n. After the last one the list starts again from #1. */
export function puzzleFor(n: number): Puzzle {
  const len = PUZZLES.length
  return PUZZLES[(((n - 1) % len) + len) % len]
}

export function dailyBoard(n: number): GameBoard {
  const p = puzzleFor(n)
  const rand = mulberry32(hashString(`haruword-${isoForPuzzle(n)}`))
  const board = buildBoard(DAILY_SIZE, p.words, rand, true)
  return { ...board, id: `d${n}`, kind: 'daily', number: n, title: p.theme, sub: p.themeEn }
}

/**
 * Themes practice may draw from: days already opened, so practice never spoils
 * an upcoming daily. In the first days, every theme except today's.
 */
export function practicePool(today: number): Puzzle[] {
  const past = PUZZLES.slice(0, Math.max(0, Math.min(today - 1, PUZZLES.length)))
  if (past.length >= 5) return past
  const current = puzzleFor(today)
  return PUZZLES.filter((p) => p !== current)
}

export function practiceBoard(size: PracticeSize, seed: number, today: number): GameBoard {
  const rand = mulberry32(seed)
  const pool = practicePool(today)
  const id = `p${size}-${seed}`
  if (size === DAILY_SIZE) {
    const p = pool[Math.floor(rand() * pool.length)]
    const board = buildBoard(size, p.words, rand, true)
    return { ...board, id, kind: 'practice', number: 0, title: p.theme, sub: p.themeEn }
  }
  const words = shuffle(pool.flatMap((p) => p.words), rand).slice(0, MIXED_COUNT[size])
  const board = buildBoard(size, words, rand, false)
  return { ...board, id, kind: 'practice', number: 0, title: '여러 주제 섞어서', sub: `${size}×${size}` }
}

export const newSeed = (): number => Math.floor(Math.random() * 4294967296) >>> 0
