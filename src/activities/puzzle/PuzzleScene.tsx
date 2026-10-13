import { useRef, useState } from 'react'
import { praise } from '../../audio/sfx'
import { speak } from '../../audio/speak'
import { navigate } from '../../lib/router'
import { addStars, bumpPuzzleLevel, loadProgress } from '../../state/progress'
import ShapeSprite from '../../components/ShapeSprite'
import { solveBoard } from './shape'
import './puzzle.css'

const SNAP = 0.06
const FALLBACK_PX = 400

interface PieceState {
  x: number
  y: number
  solved: boolean
}

interface DragState {
  i: number
  startX: number
  startY: number
  origX: number
  origY: number
}

export default function PuzzleScene() {
  const level = Math.min(3, Math.max(1, loadProgress().puzzleLevel)) as 1 | 2 | 3
  const board = solveBoard(level)
  const boardRef = useRef<HTMLDivElement>(null)
  const [pieces, setPieces] = useState<PieceState[]>(() =>
    board.targets.map((_, i) => {
      const start = board.targets[(i + 1) % board.targets.length]
      return { x: start.x, y: start.y, solved: false }
    }),
  )
  const drag = useRef<DragState | null>(null)
  const moveDelta = useRef<{ dx: number; dy: number } | null>(null)
  const celebrated = useRef(false)
  const solvedCount = pieces.filter((p) => p.solved).length

  function dims() {
    const r = boardRef.current?.getBoundingClientRect()
    const w = r && r.width > 0 ? r.width : FALLBACK_PX
    const h = r && r.height > 0 ? r.height : FALLBACK_PX
    return { w, h }
  }

  function onPointerDown(i: number, e: React.PointerEvent<Element>) {
    if (pieces[i].solved) return
    try {
      ;(e.currentTarget as Element & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(e.pointerId)
    } catch {
      /* môi trường không hỗ trợ capture */
    }
    e.preventDefault()
    drag.current = { i, startX: e.clientX, startY: e.clientY, origX: pieces[i].x, origY: pieces[i].y }
    moveDelta.current = { dx: 0, dy: 0 }
  }

  function onPointerMove(e: React.PointerEvent<Element>) {
    const d = drag.current
    if (!d) return
    moveDelta.current = { dx: e.clientX - d.startX, dy: e.clientY - d.startY }
  }

  function commit(i: number, hit: boolean, d: DragState): PieceState[] {
    const t = board.targets[i]
    return pieces.map((p, j) =>
      j === i
        ? hit
          ? { x: t.x, y: t.y, solved: true }
          : { x: d.origX, y: d.origY, solved: false }
        : p,
    )
  }

  function onPointerUp() {
    const d = drag.current
    if (!d) return
    drag.current = null
    const { w, h } = dims()
    const delta = moveDelta.current ?? { dx: 0, dy: 0 }
    const t = board.targets[d.i]
    const cx = d.origX + delta.dx / w + t.w / 2
    const cy = d.origY + delta.dy / h + t.h / 2
    const hit =
      Math.abs(cx - (t.x + t.w / 2)) < SNAP && Math.abs(cy - (t.y + t.h / 2)) < SNAP
    setPieces(commit(d.i, hit, d))
    if (hit) {
      speak('Đúng rồi!')
      const isLast = pieces.every((p, j) => j === d.i || p.solved)
      if (isLast && !celebrated.current) {
        celebrated.current = true
        praise()
        addStars(1)
        bumpPuzzleLevel()
        window.setTimeout(() => navigate('#/home'), 1200)
      }
    }
  }

  return (
    <section className="puzzle-scene" aria-label="Xếp hình">
      <div
        ref={boardRef}
        className="puzzle-board"
        data-testid="puzzle-board"
        data-solved-count={String(solvedCount)}
      >
        {board.targets.map((t) => (
          <div
            key={`target-${t.id}`}
            data-target-id={t.id}
            className="puzzle-target"
            style={{
              left: `${t.x * 100}%`,
              top: `${t.y * 100}%`,
              width: `${t.w * 100}%`,
              height: `${t.h * 100}%`,
            }}
          />
        ))}
        {pieces.map((p, i) => {
          const t = board.targets[i]
          return (
            <button
              key={t.id}
              type="button"
              data-piece-id={t.id}
              data-solved={String(p.solved)}
              className={`puzzle-piece${p.solved ? ' puzzle-piece-solved' : ''}`}
              style={{
                left: `${p.x * 100}%`,
                top: `${p.y * 100}%`,
                width: `${t.w * 100}%`,
                height: `${t.h * 100}%`,
              }}
              disabled={p.solved}
              onPointerDown={(e) => onPointerDown(i, e)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <ShapeSprite id={t.imageId} />
            </button>
          )
        })}
      </div>
    </section>
  )
}
