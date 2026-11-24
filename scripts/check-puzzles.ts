// Validates puzzle data and that every daily board places all its words. Run: npm run check:puzzles
import { PUZZLES } from '../src/puzzles.ts'
import { DAILY_SIZE, dailyBoard } from '../src/lib/boards.ts'
import { occurrences } from '../src/lib/grid.ts'

const errors: string[] = []
const seenWord = new Map<string, number>()
const seenTheme = new Map<string, number>()

PUZZLES.forEach((p, i) => {
  const n = i + 1
  const tag = `#${n} ${p.theme}`
  if (!p.theme.trim() || !p.themeEn.trim()) errors.push(`${tag}: 주제가 비어 있음`)
  if (seenTheme.has(p.themeEn)) errors.push(`${tag}: 주제 '${p.themeEn}' 가 #${seenTheme.get(p.themeEn)} 와 중복`)
  seenTheme.set(p.themeEn, n)
  if (p.words.length !== 10) errors.push(`${tag}: 단어 ${p.words.length}개 (10개여야 함)`)
  for (const { word, meaning } of p.words) {
    if (!/^[A-Z]{3,10}$/.test(word)) errors.push(`${tag}: '${word}' 는 영문 대문자 3~10글자여야 함`)
    if (!meaning.trim()) errors.push(`${tag}: '${word}' 뜻 없음`)
    const prev = seenWord.get(word)
    if (prev !== undefined) errors.push(`${tag}: '${word}' 가 #${prev} 에도 있음`)
    seenWord.set(word, n)
    // A word inside another (RAIN in RAINBOW) makes the longer one ambiguous to select.
    for (const other of p.words) if (other.word !== word && other.word.includes(word)) errors.push(`${tag}: '${word}' 가 '${other.word}' 안에 들어 있음`)
  }
  const board = dailyBoard(n)
  if (board.size !== DAILY_SIZE || board.words.length !== p.words.length)
    errors.push(`${tag}: 판에 ${board.words.length}/${p.words.length}개만 배치됨`)
  for (const { word } of board.words)
    if (occurrences(board.grid, word).length === 0) errors.push(`${tag}: '${word}' 가 판에서 안 보임`)
})

for (const e of errors) console.error('오류:', e)
console.log(`${PUZZLES.length}일치, 단어 ${seenWord.size}개 검사: 오류 ${errors.length}개`)
if (errors.length) process.exit(1)
