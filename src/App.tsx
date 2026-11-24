import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import {
  dailyBoard,
  DAILY_SIZE,
  newSeed,
  PRACTICE_SIZES,
  practiceBoard,
  type GameBoard,
  type PracticeSize,
} from './lib/boards'
import { formatCountdown, msUntilNextPuzzle, puzzleDateLabel, puzzleNumberAt } from './lib/day'
import { lettersBetween, matchWord, occurrences, snapEnd, type Cell, type Line } from './lib/grid'
import { copyText, formatTime, prefersNativeShare, shareText } from './lib/share'
import { currentStreak, recordCompletion, type Stats } from './lib/stats'
import {
  EMPTY_PLAY,
  loadPlay,
  loadSeenHelp,
  loadStats,
  savePlay,
  saveSeenHelp,
  saveStats,
  type Play,
} from './lib/storage'
import { track } from './lib/track'

type Mode = 'daily' | 'practice'
const HIGHLIGHTS = ['var(--h1)', 'var(--h2)', 'var(--h3)', 'var(--h4)', 'var(--h5)', 'var(--h6)']
const BOARD_MAX = 560
const ZOOM_STEPS = [1, 1.5, 2, 2.5, 3]

/** Today's puzzle number. In dev, ?n=3 previews another day. */
function todayNumber(): number {
  if (import.meta.env.DEV) {
    const n = Number(new URLSearchParams(location.search).get('n'))
    if (n > 0) return n
  }
  return puzzleNumberAt(Date.now())
}

export default function App() {
  const [today] = useState(todayNumber)
  const [mode, setMode] = useState<Mode>('daily')
  const [size, setSize] = useState<PracticeSize>(DAILY_SIZE)
  const [seed, setSeed] = useState(newSeed)
  const [stats, setStats] = useState<Stats>(loadStats)
  const [helpOpen, setHelpOpen] = useState(() => !loadSeenHelp())

  const board = useMemo(
    () => (mode === 'daily' ? dailyBoard(today) : practiceBoard(size, seed, today)),
    [mode, today, size, seed],
  )

  const onComplete = useCallback(
    (b: GameBoard, play: Play) => {
      track('complete', { kind: b.kind, size: b.size, seconds: play.elapsed, hints: play.hinted.length })
      if (b.kind !== 'daily' || b.number !== today) return
      setStats((s) => {
        const next = recordCompletion(s, b.number, play.elapsed, play.hinted.length)
        saveStats(next)
        return next
      })
    },
    [today],
  )

  const closeHelp = () => {
    setHelpOpen(false)
    saveSeenHelp()
  }

  const startPractice = (n: PracticeSize = size) => {
    setMode('practice')
    setSize(n)
    setSeed(newSeed())
  }

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="logo">
            하루<em>워드</em>
          </span>
          <button className="help-btn" type="button" onClick={() => setHelpOpen(true)} aria-label="게임 방법">
            ?
          </button>
        </div>
        <nav className="tabs" aria-label="모드">
          <button type="button" className={mode === 'daily' ? 'on' : ''} onClick={() => setMode('daily')}>
            오늘의 퍼즐
          </button>
          <button type="button" className={mode === 'practice' ? 'on' : ''} onClick={() => startPractice()}>
            연습
          </button>
        </nav>
      </header>

      {mode === 'practice' && (
        <div className="practice-ctl">
          <span className="lbl">판 크기</span>
          {PRACTICE_SIZES.map((n) => (
            <button key={n} type="button" className={'chip' + (n === size ? ' on' : '')} onClick={() => startPractice(n)}>
              {n}×{n}
              {n === 12 && <small>주제</small>}
              {n === 30 && <small>마라톤</small>}
            </button>
          ))}
          <button className="btn ghost" type="button" onClick={() => setSeed(newSeed())}>
            새 퍼즐
          </button>
        </div>
      )}

      <Game
        key={board.id}
        board={board}
        streak={currentStreak(stats, today)}
        bestStreak={stats.maxStreak}
        onComplete={onComplete}
        onPractice={() => startPractice()}
        onNewPractice={() => setSeed(newSeed())}
      />

      <footer className="foot">
        <a href="/privacy.html">개인정보처리방침</a>
        <span>기록은 이 기기에만 저장돼요</span>
      </footer>

      {helpOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && closeHelp()}>
          <div className="card" role="dialog" aria-modal="true" aria-labelledby="help-title">
            <h3 id="help-title">하루워드 하는 법</h3>
            <ul className="help">
              <li>매일 자정(한국 시간)에 주제 하나와 영어 단어 10개가 숨은 판이 열려요. 모두 같은 판이에요.</li>
              <li>글자를 누른 채 끌어서 단어를 이으세요. 첫 글자와 끝 글자를 차례로 눌러도 돼요.</li>
              <li>가로·세로·대각선, 거꾸로도 숨어 있어요. 찾으면 한국어 뜻이 열려요.</li>
              <li>막히면 힌트로 첫 글자 위치를 볼 수 있어요. 결과에 노란 칸으로 표시돼요.</li>
              <li>매일 풀면 연속 기록이 쌓여요. 연습 탭에서는 30×30 마라톤까지 마음껏 풀 수 있어요.</li>
            </ul>
            <p className="muted">
              로그인 없이 이 기기에만 기록이 저장돼요. <a href="/privacy.html">개인정보처리방침</a>
            </p>
            <div className="row">
              <button className="btn" type="button" onClick={closeHelp} autoFocus>
                시작하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface Drag {
  start: Cell
  end: Cell
  moved: boolean
}

interface GameProps {
  board: GameBoard
  streak: number
  bestStreak: number
  onComplete: (board: GameBoard, play: Play) => void
  onPractice: () => void
  onNewPractice: () => void
}

const sameCell = (a: Cell | null, b: Cell | null) => !!a && !!b && a[0] === b[0] && a[1] === b[1]

function Game({ board, streak, bestStreak, onComplete, onPractice, onNewPractice }: GameProps) {
  const daily = board.kind === 'daily'
  const { size, grid, words } = board
  const [play, setPlay] = useState<Play>(() => (daily ? loadPlay(board.number) : null) ?? EMPTY_PLAY)
  const [started, setStarted] = useState(play.elapsed > 0)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [pending, setPending] = useState<Cell | null>(null)
  const [miss, setMiss] = useState<Line | null>(null)
  const [popped, setPopped] = useState<string | null>(null)
  const [resultOpen, setResultOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [now, setNow] = useState(Date.now)
  const wrapRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<Drag | null>(null)
  const [base, setBase] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)

  // Board width follows its container, capped for desktop.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setBase(Math.min(el.clientWidth, BOARD_MAX))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Big boards start zoomed so cells are about 24px; the player can change it.
  const effectiveZoom =
    zoom ?? (size <= DAILY_SIZE || !base ? 1 : ZOOM_STEPS.find((z) => (base * z) / size >= 24) ?? 3)
  const px = base * effectiveZoom
  const cellPx = px / size

  // Timer: counts only while the page is visible and the board is unfinished.
  useEffect(() => {
    if (!started || play.done) return
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') setPlay((p) => (p.done ? p : { ...p, elapsed: p.elapsed + 1 }))
    }, 1000)
    return () => clearInterval(id)
  }, [started, play.done])

  useEffect(() => {
    if (daily) savePlay(board.number, play)
  }, [daily, board.number, play])

  // Countdown to the next daily once today's is done.
  useEffect(() => {
    if (!daily || !play.done) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [daily, play.done])

  const hintCells = useMemo(() => {
    const out: Record<string, Cell> = {}
    for (const w of play.hinted) {
      const hit = occurrences(grid, w)[0]
      if (hit) out[w] = [hit[0], hit[1]]
    }
    return out
  }, [grid, play.hinted])

  const foundCount = words.filter((w) => play.found[w.word]).length

  const tryWord = (a: Cell, b: Cell) => {
    const hit = matchWord(words, play.found, lettersBetween(grid, a, b))
    if (!hit) {
      setMiss([a[0], a[1], b[0], b[1]])
      setTimeout(() => setMiss(null), 450)
      return
    }
    const found = { ...play.found, [hit.word]: [a[0], a[1], b[0], b[1]] as Line }
    const done = words.every((w) => found[w.word])
    const next = { ...play, found, done }
    setPlay(next)
    setPopped(hit.word)
    if (done) {
      onComplete(board, next)
      setResultOpen(true)
    }
  }

  const cellAt = (e: ReactPointerEvent): Cell | null => {
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return null
    const s = rect.width / size
    const c = Math.floor((e.clientX - rect.left) / s)
    const r = Math.floor((e.clientY - rect.top) / s)
    return r < 0 || c < 0 || r >= size || c >= size ? null : [r, c]
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (play.done) return
    const c = cellAt(e)
    if (!c) return
    setStarted(true)
    const d = { start: c, end: c, moved: false }
    dragRef.current = d
    setDrag(d)
    // On a zoomed board touch must scroll, so only capture for mouse/pen or unzoomed.
    if (effectiveZoom === 1 || e.pointerType === 'mouse') e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d) return
    const c = cellAt(e)
    if (!c) return
    const end = snapEnd(size, d.start, c)
    if (sameCell(end, d.end)) return
    const next = { start: d.start, end, moved: d.moved || !sameCell(end, d.start) }
    dragRef.current = next
    setDrag(next)
  }

  const onPointerUp = () => {
    const d = dragRef.current
    dragRef.current = null
    setDrag(null)
    if (!d) return
    if (d.moved) {
      setPending(null)
      tryWord(d.start, d.end)
    } else if (pending && !sameCell(pending, d.start)) {
      setPending(null)
      tryWord(pending, snapEnd(size, pending, d.start))
    } else {
      setPending(sameCell(pending, d.start) ? null : d.start)
    }
  }

  const onPointerCancel = () => {
    dragRef.current = null
    setDrag(null)
  }

  const takeHint = () => {
    if (play.done) return
    const left = words.filter((w) => !play.found[w.word] && !play.hinted.includes(w.word))
    if (!left.length) return
    setStarted(true)
    const pick = left[Math.floor(Math.random() * left.length)]
    setPlay({ ...play, hinted: [...play.hinted, pick.word] })
    track('hint', { kind: board.kind })
  }

  const text = shareText({
    kind: board.kind,
    number: board.number,
    title: board.title,
    size,
    words,
    hinted: play.hinted,
    elapsed: play.elapsed,
    url: location.origin,
  })

  const share = async () => {
    track('share', { kind: board.kind })
    if (prefersNativeShare()) {
      try {
        await navigator.share({ text })
        return
      } catch {
        /* cancelled: fall through to copy */
      }
    }
    setToast((await copyText(text)) ? '복사했어요. 카톡에 붙여 넣어 보세요.' : '복사가 막혀 있어요. 아래 글을 길게 눌러 복사해 주세요.')
  }

  const line = (l: Line, cls: string, color?: string) => (
    <line className={cls} x1={l[1] + 0.5} y1={l[0] + 0.5} x2={l[3] + 0.5} y2={l[2] + 0.5} style={color ? { stroke: color } : undefined} />
  )

  return (
    <>
      <section className="bar">
        <div>
          <div className="eyebrow">
            {daily ? `#${board.number} · ${puzzleDateLabel(board.number)} · 오늘의 주제` : `연습 · ${size}×${size} · 연속 기록에는 안 들어가요`}
          </div>
          <h1>
            {board.title}
            <small>{board.sub}</small>
          </h1>
        </div>
        <div className="stats">
          <div>
            <b>{formatTime(play.elapsed)}</b>
            <span>시간</span>
          </div>
          <div>
            <b>
              {foundCount}/{words.length}
            </b>
            <span>찾음</span>
          </div>
          <div>
            <b>{streak}</b>
            <span>연속일</span>
          </div>
        </div>
      </section>

      <main className="play">
        <div className="board-col">
          <div className="board-wrap" ref={wrapRef}>
            <div
              className="board"
              ref={boardRef}
              role="application"
              aria-label={`${size}×${size} 글자 판`}
              style={{ width: px, height: px, touchAction: effectiveZoom > 1 ? 'pan-x pan-y' : 'none' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
                {words.map((w, i) => {
                  const f = play.found[w.word]
                  if (f) return <g key={w.word}>{line(f, 'mk', HIGHLIGHTS[i % HIGHLIGHTS.length])}</g>
                  const h = hintCells[w.word]
                  return h ? <circle key={w.word} className="hintc" cx={h[1] + 0.5} cy={h[0] + 0.5} r={0.44} /> : null
                })}
                {miss && line(miss, 'miss')}
                {drag && line([drag.start[0], drag.start[1], drag.end[0], drag.end[1]], 'sel')}
                {pending && !drag && <circle className="pend" cx={pending[1] + 0.5} cy={pending[0] + 0.5} r={0.42} />}
              </svg>
              <div
                className="cells"
                style={{ gridTemplateColumns: `repeat(${size},1fr)`, gridTemplateRows: `repeat(${size},1fr)`, fontSize: cellPx * 0.56 }}
              >
                {grid.flatMap((row, r) => row.map((ch, c) => <span key={r * size + c}>{ch}</span>))}
              </div>
            </div>
          </div>
          <div className="tools">
            <button className="btn ghost" type="button" onClick={takeHint} disabled={play.done}>
              힌트 (첫 글자)
            </button>
            {size > DAILY_SIZE && (
              <span className="zoom">
                <button type="button" aria-label="축소" onClick={() => setZoom(Math.max(1, effectiveZoom - 0.5))}>
                  −
                </button>
                <span>{Math.round(effectiveZoom * 100)}%</span>
                <button type="button" aria-label="확대" onClick={() => setZoom(Math.min(3, effectiveZoom + 0.5))}>
                  +
                </button>
              </span>
            )}
          </div>
          <p className="howto">
            {size > DAILY_SIZE
              ? '확대한 판은 한 손가락으로 밀어서 움직이고, 첫 글자와 끝 글자를 차례로 눌러 단어를 고르세요. 컴퓨터에서는 끌어서 골라도 돼요.'
              : '글자를 누른 채 끌어서 단어를 이으세요. 첫 글자와 끝 글자를 차례로 눌러도 돼요.'}{' '}
            가로·세로·대각선, 거꾸로도 숨어 있어요.
          </p>
        </div>

        <aside className="words-col">
          <h2>
            찾을 단어 <span>찾으면 한국어 뜻이 나와요</span>
          </h2>
          <ul className="words">
            {words.map((w, i) => {
              const found = !!play.found[w.word]
              const hinted = play.hinted.includes(w.word)
              return (
                <li
                  key={w.word}
                  className={(found ? 'found' : '') + (popped === w.word ? ' pop' : '')}
                  style={{ ['--hl' as string]: HIGHLIGHTS[i % HIGHLIGHTS.length] }}
                >
                  <span className="en">
                    {hinted && !found ? (
                      <>
                        <b>{w.word[0]}</b>
                        {w.word.slice(1)}
                      </>
                    ) : (
                      w.word
                    )}
                  </span>
                  <span className="ko">{found ? w.meaning : '뜻은 찾으면 공개'}</span>
                </li>
              )
            })}
          </ul>

          {play.done && (
            <div className="done-card">
              <h3>{daily ? '오늘 퍼즐 완료' : '완료'}</h3>
              <p>
                기록 {formatTime(play.elapsed)} · 힌트 {play.hinted.length}개{daily && ` · 연속 ${streak}일`}
                {daily && (
                  <>
                    <br />
                    다음 퍼즐까지 <b className="mono">{formatCountdown(msUntilNextPuzzle(now))}</b>
                  </>
                )}
              </p>
              <div className="row">
                <button className="btn" type="button" onClick={() => setResultOpen(true)}>
                  결과 보기
                </button>
                <button className="btn ghost" type="button" onClick={daily ? onPractice : onNewPractice}>
                  {daily ? '연습하기' : '새 퍼즐'}
                </button>
              </div>
            </div>
          )}
        </aside>
      </main>

      {resultOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setResultOpen(false)}>
          <div className="card" role="dialog" aria-modal="true" aria-labelledby="result-title">
            <h3 id="result-title">{daily ? '오늘 단어 다 찾았어요' : '다 찾았어요'}</h3>
            <div className="big">{formatTime(play.elapsed)}</div>
            <div className="mstats">
              <div>
                <b>{play.hinted.length}</b>
                <span>힌트</span>
              </div>
              <div>
                <b>{streak}</b>
                <span>연속일</span>
              </div>
              <div>
                <b>{bestStreak}</b>
                <span>최고 연속</span>
              </div>
            </div>
            <pre className="share">{text}</pre>
            <div className="toast" role="status">
              {toast}
            </div>
            <div className="row">
              <button className="btn" type="button" onClick={share} autoFocus>
                결과 공유
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  setResultOpen(false)
                  if (daily) onPractice()
                  else onNewPractice()
                }}
              >
                {daily ? '연습 더 하기' : '새 퍼즐'}
              </button>
              <button className="btn ghost" type="button" onClick={() => setResultOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
