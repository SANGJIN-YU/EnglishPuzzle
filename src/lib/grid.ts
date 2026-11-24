import type { Word } from '../puzzles.ts'

export type Cell = readonly [row: number, col: number]
/** A found word's line: start row, start col, end row, end col. */
export type Line = [number, number, number, number]

export interface Board {
  size: number
  /** grid[row][col], one uppercase letter per cell. */
  grid: string[][]
  /** Words actually placed, shortest first (the order shown in the list). */
  words: Word[]
}

/** Right, down, down-right, up-right first: the "easy" forward directions. */
export const DIRS: readonly Cell[] = [
  [0, 1], [1, 0], [1, 1], [-1, 1],
  [0, -1], [-1, 0], [-1, -1], [1, -1],
]

/** Filler letters roughly follow English letter frequency. */
const FILLER =
  'EEEEEEEEEEEETTTTTTTTTAAAAAAAAOOOOOOOOIIIIIIINNNNNNNSSSSSSHHHHHHRRRRRRDDDDLLLLCCCUUUMMMWWFFGGYYPPBBVKJXQZ'

export function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function shuffle<T>(items: T[], rand: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

/**
 * Places words (longest first) and fills the rest with random letters.
 * `easy` leans toward forward directions. A word that cannot fit is dropped.
 */
export function buildBoard(size: number, list: Word[], rand: () => number, easy: boolean): Board {
  const grid = Array.from({ length: size }, () => Array<string>(size).fill(''))
  const placed: Word[] = []
  const sorted = [...list].sort((a, b) => b.word.length - a.word.length)
  for (const item of sorted) {
    const { word } = item
    if (word.length > size) continue
    for (let t = 0; t < 500; t++) {
      const di = easy && rand() < 0.55 ? Math.floor(rand() * 4) : Math.floor(rand() * 8)
      const [dr, dc] = DIRS[di]
      const r0 = Math.floor(rand() * size)
      const c0 = Math.floor(rand() * size)
      const r1 = r0 + dr * (word.length - 1)
      const c1 = c0 + dc * (word.length - 1)
      if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) continue
      let fits = true
      for (let i = 0; i < word.length; i++) {
        const ch = grid[r0 + dr * i][c0 + dc * i]
        if (ch && ch !== word[i]) {
          fits = false
          break
        }
      }
      if (!fits) continue
      for (let i = 0; i < word.length; i++) grid[r0 + dr * i][c0 + dc * i] = word[i]
      placed.push(item)
      break
    }
  }
  for (const row of grid)
    for (let c = 0; c < size; c++) if (!row[c]) row[c] = FILLER[Math.floor(rand() * FILLER.length)]
  placed.sort((a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word))
  return { size, grid, words: placed }
}

/** Snaps a drag end to the nearest of the 8 directions from `start`, kept inside the board. */
export function snapEnd(size: number, start: Cell, to: Cell): Cell {
  const dr = to[0] - start[0]
  const dc = to[1] - start[1]
  if (!dr && !dc) return start
  const k = Math.round(Math.atan2(dr, dc) / (Math.PI / 4))
  const ur = Math.round(Math.sin((k * Math.PI) / 4))
  const uc = Math.round(Math.cos((k * Math.PI) / 4))
  for (let len = Math.max(Math.abs(dr), Math.abs(dc)); len > 0; len--) {
    const r = start[0] + ur * len
    const c = start[1] + uc * len
    if (r >= 0 && r < size && c >= 0 && c < size) return [r, c]
  }
  return start
}

/** Letters on the straight line from a to b (inclusive). a and b must be in line. */
export function lettersBetween(grid: string[][], a: Cell, b: Cell): string {
  const n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]))
  const ur = Math.sign(b[0] - a[0])
  const uc = Math.sign(b[1] - a[1])
  let s = ''
  for (let i = 0; i <= n; i++) s += grid[a[0] + ur * i][a[1] + uc * i]
  return s
}

/** The not-yet-found word spelled by a selection, read either way. */
export function matchWord(words: Word[], found: Record<string, unknown>, letters: string): Word | null {
  const reversed = [...letters].reverse().join('')
  return words.find((w) => !found[w.word] && (w.word === letters || w.word === reversed)) ?? null
}

/** Every start cell + direction where the word appears. */
export function occurrences(grid: string[][], word: string): Line[] {
  const size = grid.length
  const out: Line[] = []
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== word[0]) continue
      for (const [dr, dc] of DIRS) {
        const r1 = r + dr * (word.length - 1)
        const c1 = c + dc * (word.length - 1)
        if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) continue
        let ok = true
        for (let i = 1; i < word.length; i++)
          if (grid[r + dr * i][c + dc * i] !== word[i]) {
            ok = false
            break
          }
        if (ok) out.push([r, c, r1, c1])
      }
    }
  return out
}
