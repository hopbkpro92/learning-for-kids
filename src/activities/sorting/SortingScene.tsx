import { useRef, useState } from 'react'
import { praise } from '../../audio/sfx'
import { speak } from '../../audio/speak'
import { addStars } from '../../state/progress'
import ShapeSprite, { type SceneImageId } from '../../components/ShapeSprite'
import { genSet, type SetSpec, type SortBasket } from './gen'
import './sorting.css'

interface ItemState {
  x: number
  y: number
  placed: boolean
}

const FALLBACK_PX = 400

export default function SortingScene() {
  const [set] = useState(() => genSet(2))
  const [items, setItems] = useState<ItemState[]>(() =>
    set.items.map((_, i) => ({ x: 0.06 + ((i % 3) * 0.3), y: i / set.items.length, placed: false })),
  )
  const boardRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ i: number; startX: number; startY: number; origX: number; origY: number } | null>(null)
  const moveDelta = useRef<{ dx: number; dy: number } | null>(null)
  const lastPointer = useRef<{ x: number; y: number } | null>(null)
  const celebrated = useRef(false)
  const placedCount = items.filter((it) => it.placed).length

  function onDown(i: number, e: React.PointerEvent<Element>) {
    if (items[i].placed) return
    e.preventDefault()
    drag.current = { i, startX: e.clientX, startY: e.clientY, origX: items[i].x, origY: items[i].y }
    moveDelta.current = { dx: 0, dy: 0 }
  }

  function onMove(e: React.PointerEvent<Element>) {
    if (!drag.current) return
    moveDelta.current = { dx: e.clientX - drag.current.startX, dy: e.clientY - drag.current.startY }
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }

  function basketAt(x: number, y: number): SortBasket | null {
    for (const b of set.baskets) {
      const el = document.querySelector(`[data-basket-id="${b.id}"]`)
      const r = (el as HTMLElement | null)?.getBoundingClientRect()
      if (r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return b
    }
    return null
  }

  function onUp() {
    const d = drag.current
    if (!d) return
    drag.current = null
    const pointer = lastPointer.current
    const droppedBasket = pointer ? basketAt(pointer.x, pointer.y) : null
    const targetId = set.items[d.i].targetBasketId
    const hit = droppedBasket?.id === targetId
    if (!hit && droppedBasket) {
      speak('Thá»­ láº¡i báº¡n Æ¡i')
    }
    setItems((ps) =>
      ps.map((p, j) =>
        j === d.i
          ? hit
            ? { ...p, placed: true }
            : { x: d.origX, y: d.origY, placed: false }
          : p,
      ),
    )
    if (hit) {
      speak('ÄÃºng rá»“i!')
      const isLast = items.every((p, j) => j === d.i || p.placed)
      if (isLast && !celebrated.current) {
        celebrated.current = true
        praise()
        addStars(1)
      }
    }
  }

  const boardW = boardRef.current?.getBoundingClientRect().width || FALLBACK_PX

  return (
    <section className="sorting-scene" aria-label="Sáº¯p vÃ o giá»">
      <div className="sorting-board" ref={boardRef} data-testid="sorting-board" data-placed-count={String(placedCount)}>
        <div data-set={JSON.stringify(set)} className="sorting-setdata" />
        <BasketRow baskets={set.baskets} boardW={boardW} />
        {items.map((st, i) => {
          const spec = set.items[i]
          if (st.placed) return null
          return (
            <button
              key={spec.id}
              type="button"
              data-item-id={spec.id}
              className="sorting-item"
              style={{
                left: `${(st.x + (moveDelta.current?.dx ?? 0) / boardW) * 100}%`,
                top: `${st.y * 100}%`,
                touchAction: 'none',
              }}
              onPointerDown={(e) => onDown(i, e)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <ShapeSprite id={spec.sprite as SceneImageId} />
            </button>
          )
        })}
      </div>
    </section>
  )
}

function BasketRow({ baskets, boardW }: { baskets: SortBasket[]; boardW: number }) {
  return (
    <div className="basket-row">
      {baskets.map((b) => (
        <div
          key={b.id}
          data-basket-id={b.id}
          className="sort-basket"
          style={{ background: b.color, minHeight: 120, width: Math.max(92, boardW / baskets.length - 40) }}
        >
          <svg className="basket-icon" viewBox="0 0 40 32" aria-hidden="true">
            <path d="M4 12 L36 12 L31 30 L9 30 Z" fill="#FFF6E9" stroke="#5B4234" strokeWidth="2" />
            <path d="M4 12 L36 12" stroke="#5B4234" strokeWidth="3" />
          </svg>
          <span className="basket-label">{b.label}</span>
        </div>
      ))}
    </div>
  )
}
