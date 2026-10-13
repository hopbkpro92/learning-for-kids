import { useRef, useState } from 'react'
import { praise } from '../../audio/sfx'
import { speak } from '../../audio/speak'
import { idbList, idbPut, type Artwork } from '../../state/idb'
import './drawing.css'

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#845EC2', '#2D2D2D']

interface StrokeState {
  color: string
  points: { x: number; y: number }[]
}

export default function DrawingScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef<StrokeState | null>(null)
  const [activeColor, setActiveColor] = useState(COLORS[0])
  const colorRef = useRef(activeColor)
  colorRef.current = activeColor
  const [strokeCount, setStrokeCount] = useState(0)
  const [artworks, setArtworks] = useState<Artwork[]>([])

  function pos(e: React.PointerEvent<Element>) {
    const r = canvasRef.current?.getBoundingClientRect()
    const w = r && r.width > 0 ? r.width : 320
    const h = r && r.height > 0 ? r.height : 320
    return {
      x: (e.clientX - (r?.left ?? 0)) / w,
      y: (e.clientY - (r?.top ?? 0)) / h,
    }
  }

  function onDown(e: React.PointerEvent) {
    try {
      ;(e.currentTarget as Element & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(
        e.pointerId,
      )
    } catch {
      /* không hỗ trợ */
    }
    e.preventDefault()
    drawing.current = { color: colorRef.current, points: [pos(e)] }
  }

  function onMove(e: React.PointerEvent) {
    const s = drawing.current
    if (!s) return
    s.points.push(pos(e))
  }

  function onUp() {
    if (drawing.current && drawing.current.points.length > 1) {
      setStrokeCount((c) => c + 1)
      const finalStroke: StrokeState = { ...drawing.current, points: [...drawing.current.points] }
      strokesRef.current.push(finalStroke)
      drawStroke(finalStroke)
    }
    drawing.current = null
  }

  const strokesRef = useRef<StrokeState[]>([])

  function drawStroke(_s: StrokeState) {
    try {
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return
      renderStroke(ctx, _s)
    } catch {
      /* canvas 2D không khả dụng */
    }
  }

  function clearCanvas() {
    try {
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    } catch {
      /* canvas 2D không khả dụng */
    }
  }

  async function finish() {
    if (!strokesRef.current.length) {
      speak('Vẽ thêm nét nào bạn!')
      return
    }
    const art: Artwork = {
      id: `art-${Date.now()}`,
      createdAt: Date.now(),
      strokes: strokesRef.current.map((s) => ({ color: s.color, points: [...s.points] })),
    }
    try {
      await idbPut(art)
      setArtworks(await idbList())
    } catch {
      speak('Không lưu được, thử lại nhé')
    }
    praise()
    strokesRef.current = []
    clearCanvas()
    setStrokeCount(0)
    speak('Bé vẽ đẹp quá!')
  }

  return (
    <section className="drawing-scene" aria-label="Vẽ tay">
      <div className="drawing-stage" data-stroke-count={String(strokeCount)}>
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="drawing-canvas"
          data-testid="drawing-canvas"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </div>
      <div className="drawing-colors" role="group" aria-label="chọn màu">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            data-color={c}
            data-active={String(c === activeColor)}
            style={{ background: c }}
            className="drawing-dot"
            aria-label={`màu ${c}`}
            onClick={() => setActiveColor(c)}
          />
        ))}
      </div>
      <button type="button" className="drawing-finish" data-finish style={{ minHeight: 64 }} onClick={finish}>
        Xong rồi, lưu tranh!
      </button>
      <div className="drawing-gallery" aria-label="tranh đã lưu">
        {artworks.map((a) => (
          <svg key={a.id} data-artwork className="drawing-thumb" viewBox="0 0 320 320">
            {a.strokes.map((s, i) => (
              <polyline
                key={i}
                points={s.points.map((p) => `${Math.round(p.x * 320)},${Math.round(p.y * 320)}`).join(' ')}
                stroke={s.color}
                strokeWidth={12}
                fill="none"
                strokeLinecap="round"
              />
            ))}
          </svg>
        ))}
      </div>
    </section>
  )
}

function renderStroke(ctx: CanvasRenderingContext2D, s: StrokeState) {
  ctx.strokeStyle = s.color
  ctx.lineWidth = 12
  ctx.lineCap = 'round'
  ctx.beginPath()
  s.points.forEach((p, i) => {
    const x = p.x * 320
    const y = p.y * 320
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
}
