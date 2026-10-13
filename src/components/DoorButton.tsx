import { useRef } from 'react'
import { navigate } from '../lib/router'

export type DoorId =
  | 'puzzle'
  | 'songs'
  | 'counting'
  | 'drawing'
  | 'instruments'
  | 'sorting'
  | 'whois'

export const ALL_DOORS: DoorId[] = [
  'puzzle',
  'songs',
  'counting',
  'drawing',
  'instruments',
  'sorting',
  'whois',
]

const DEBOUNCE_MS = 600

export default function DoorButton({
  doorId,
  label,
  suggested = false,
}: {
  doorId: DoorId
  label: string
  suggested?: boolean
}) {
  const lastNavAt = useRef(0)

  function onPress() {
    const now = Date.now()
    if (now - lastNavAt.current < DEBOUNCE_MS) return
    lastNavAt.current = now
    navigate(`#/door/${doorId}`)
  }

  return (
    <button
      type="button"
      className={`door-button${suggested ? ' door-suggested' : ''}`}
      style={{ minHeight: 64 }}
      aria-label={label}
      data-door={doorId}
      onClick={onPress}
    >
      <DoorChip doorId={doorId} />
      <span className="door-label">{label}</span>
    </button>
  )
}

function DoorChip({ doorId }: { doorId: DoorId }) {
  if (doorId === 'puzzle')
    return (
      <svg className="door-chip" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="#FF9F45" />
        <rect x="22" y="4" width="14" height="16" rx="4" fill="#3BA6D9" fillOpacity="0.4" />
        <rect x="4" y="22" width="16" height="14" rx="4" fill="#3BA6D9" />
        <rect x="22" y="22" width="14" height="14" rx="4" fill="#FFD166" />
      </svg>
    )
  if (doorId === 'songs')
    return (
      <svg className="door-chip" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="13" cy="30" r="6" fill="#FF8FB1" stroke="#5B4234" strokeWidth="2" />
        <circle cx="30" cy="27" r="6" fill="#FFD166" stroke="#5B4234" strokeWidth="2" />
        <path d="M19 30 L19 10 L36 7 L36 27" fill="none" stroke="#5B4234" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  if (doorId === 'counting')
    return (
      <svg className="door-chip" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="16" fill="#FFFFFF" stroke="#3BA6D9" strokeWidth="3" />
        <text x="20" y="27" textAnchor="middle" fontSize="18" fill="#2E6E8E">
          1
        </text>
      </svg>
    )
  if (doorId === 'drawing')
    return (
      <svg className="door-chip" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="6" y="6" width="28" height="22" rx="4" fill="#FFFFFF" stroke="#FF8FB1" strokeWidth="3" />
        <path d="M10 22 Q20 12 30 22" fill="none" stroke="#FF9F45" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 28 L34 34" stroke="#5B4234" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  if (doorId === 'instruments')
    return (
      <svg className="door-chip" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="8" y="20" width="24" height="6" rx="3" fill="#FFD166" stroke="#5B4234" strokeWidth="2" />
        <circle cx="14" cy="14" r="4" fill="#3BA6D9" />
        <circle cx="24" cy="12" r="4" fill="#FF8FB1" />
        <circle cx="32" cy="16" r="3" fill="#FF9F45" />
      </svg>
    )
  if (doorId === 'sorting')
    return (
      <svg className="door-chip" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M6 18 L34 18 L30 34 L10 34 Z" fill="#93D9A3" stroke="#5B4234" strokeWidth="2" />
        <circle cx="14" cy="12" r="4" fill="#FF9F45" />
        <circle cx="24" cy="10" r="4" fill="#3BA6D9" />
      </svg>
    )
  return (
    <svg className="door-chip" viewBox="0 0 40 40" aria-hidden="true">
      <ellipse cx="15" cy="24" rx="7" ry="9" fill="#FF8FB1" stroke="#5B4234" strokeWidth="2" />
      <ellipse cx="28" cy="26" rx="5" ry="7" fill="#FFFFFF" stroke="#5B4234" strokeWidth="2" />
      <circle cx="28" cy="12" r="5" fill="#FFD166" stroke="#5B4234" strokeWidth="2" />
    </svg>
  )
}
