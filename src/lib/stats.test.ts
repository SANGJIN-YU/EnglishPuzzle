import { describe, expect, it } from 'vitest'
import { currentStreak, EMPTY_STATS, recordCompletion } from './stats.ts'

describe('streak', () => {
  it('grows on consecutive days and resets after a gap', () => {
    let s = recordCompletion(EMPTY_STATS, 1, 90, 0)
    s = recordCompletion(s, 2, 80, 1)
    expect(s.streak).toBe(2)
    expect(s.clean).toBe(1)
    expect(currentStreak(s, 3)).toBe(2)
    expect(currentStreak(s, 4)).toBe(0)
    s = recordCompletion(s, 4, 70, 0)
    expect(s.streak).toBe(1)
    expect(s.maxStreak).toBe(2)
  })
  it('counts a day once', () => {
    const s = recordCompletion(EMPTY_STATS, 1, 90, 0)
    expect(recordCompletion(s, 1, 10, 0)).toBe(s)
  })
})
