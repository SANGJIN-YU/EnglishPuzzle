import { describe, expect, it } from 'vitest'
import { buildBoard, lettersBetween, matchWord, mulberry32, occurrences, snapEnd } from './grid.ts'
import { dailyBoard, practiceBoard, practicePool, puzzleFor } from './boards.ts'
import { PUZZLES } from '../puzzles.ts'

const words = [
  { word: 'APPLE', meaning: '사과' },
  { word: 'PEAR', meaning: '배' },
]

describe('buildBoard', () => {
  it('places every word exactly where it can be read', () => {
    const b = buildBoard(12, words, mulberry32(1), true)
    expect(b.words.map((w) => w.word)).toEqual(['PEAR', 'APPLE'])
    for (const w of b.words) expect(occurrences(b.grid, w.word).length).toBeGreaterThan(0)
    expect(b.grid.flat().every((ch) => /^[A-Z]$/.test(ch))).toBe(true)
  })
  it('is deterministic for a seed, so everyone gets the same daily board', () => {
    expect(dailyBoard(5).grid).toEqual(dailyBoard(5).grid)
    expect(dailyBoard(5).grid).not.toEqual(dailyBoard(6).grid)
  })
})

describe('selection', () => {
  const grid = ['CAT', 'XOX', 'XXW'].map((r) => r.split(''))
  it('snaps a drag to the nearest straight line', () => {
    expect(snapEnd(3, [0, 0], [2, 1])).toEqual([2, 2]) // closer to diagonal
    expect(snapEnd(3, [0, 0], [0, 2])).toEqual([0, 2])
    expect(snapEnd(3, [0, 0], [0, 0])).toEqual([0, 0])
  })
  it('reads letters along the line and matches forwards or backwards', () => {
    expect(lettersBetween(grid, [0, 0], [0, 2])).toBe('CAT')
    expect(lettersBetween(grid, [2, 2], [0, 0])).toBe('WOC')
    const list = [{ word: 'COW', meaning: '소' }, { word: 'CAT', meaning: '고양이' }]
    expect(matchWord(list, {}, 'WOC')?.word).toBe('COW')
    expect(matchWord(list, { COW: true }, 'WOC')).toBeNull()
    expect(matchWord(list, {}, 'TAC')?.word).toBe('CAT')
  })
})

describe('days', () => {
  it('starts over after the last puzzle', () => {
    expect(puzzleFor(PUZZLES.length + 1)).toBe(PUZZLES[0])
  })
  it('practice never uses today or upcoming themes once enough days have passed', () => {
    expect(practicePool(10)).toEqual(PUZZLES.slice(0, 9))
    expect(practicePool(1)).not.toContain(PUZZLES[0])
    const b = practiceBoard(30, 42, 10)
    expect(b.words.length).toBeGreaterThan(20)
    const allowed = new Set(PUZZLES.slice(0, 9).flatMap((p) => p.words.map((w) => w.word)))
    for (const w of b.words) expect(allowed.has(w.word)).toBe(true)
  })
})
