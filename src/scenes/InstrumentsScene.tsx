import { useEffect, useRef, useState } from 'react'
import { praise } from '../audio/sfx'
import { speak } from '../audio/speak'
import { synth } from '../audio/synth'
import './instruments.css'

type Timbre = 'piano' | 'bell' | 'drum' | 'horn'

const PADS: { key: string; label: string; note: string; timbre: Timbre }[] = [
  { key: 'drum', label: 'Trống', note: 'C2', timbre: 'drum' },
  { key: 'bell', label: 'Chuông', note: 'G5', timbre: 'bell' },
  { key: 'horn', label: 'Kèn', note: 'E4', timbre: 'horn' },
  { key: 'piano', label: 'Đàn', note: 'A3', timbre: 'piano' },
]

const BEAT_MS = 500
const TOTAL_BEATS = 8

export default function InstrumentsScene() {
  const [mode, setMode] = useState<'idle' | 'playing' | 'done'>('idle')
  const modeRef = useRef<'idle' | 'playing' | 'done'>('idle')
  const [beat, setBeat] = useState(-1)
  const hits = useRef(0)
  const timer = useRef<number | null>(null)

  function stop() {
    if (timer.current !== null) {
      window.clearInterval(timer.current)
      timer.current = null
    }
  }

  useEffect(() => stop, [])

  function startPlayAlong() {
    stop()
    hits.current = 0
    modeRef.current = 'playing'
    setBeat(0)
    setMode('playing')
    speak('Gõ theo nhịp nhé bạn!')
    timer.current = window.setInterval(() => {
      setBeat((b) => {
        const next = b + 1
        if (next > TOTAL_BEATS) return b
        if (next === TOTAL_BEATS) {
          window.setTimeout(() => {
            modeRef.current = 'idle'
            setMode('idle')
            setBeat(-1)
            if (hits.current >= TOTAL_BEATS) praise()
          }, 200)
        }
        return next
      })
    }, BEAT_MS)
  }

  function onTap(pad: { note: string; timbre: Timbre }) {
    synth.playNote(pad.note, 1, pad.timbre)
    if (modeRef.current === 'playing') hits.current += 1
  }

  return (
    <section className="instruments-scene" aria-label="Nhạc cụ">
      <div className="pads">
        {PADS.map((pad) => (
          <button
            key={pad.key}
            type="button"
            className="instrument-pad"
            aria-label={pad.label}
            style={{ minHeight: 88 }}
            onClick={() => onTap(pad)}
          >
            <PadArt kind={pad.key} />
            <span>{pad.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="play-along-btn"
        style={{ minHeight: 64 }}
        aria-label="Gõ theo nhịp"
        onClick={startPlayAlong}
      >
        Gõ theo nhịp
      </button>
      <div className="metronome" aria-label="ô nhịp">
        {Array.from({ length: TOTAL_BEATS }).map((_, i) => (
          <span
            key={i}
            className={`beat${mode === 'playing' && i === beat ? ' on' : ''}${
              hits.current > i ? ' hit' : ''
            }`}
          />
        ))}
      </div>
    </section>
  )
}

function PadArt({ kind }: { kind: string }) {
  return (
    <svg className="pad-art" viewBox="0 0 60 60" aria-hidden="true">
      {kind === 'drum' ? (
        <g>
          <ellipse cx="30" cy="24" rx="22" ry="10" fill="#FF8FB1" stroke="#5B4234" strokeWidth="3" />
          <path d="M8 24 Q30 40 52 24 L52 40 Q30 54 8 40 Z" fill="#FFC9DA" stroke="#5B4234" strokeWidth="3" />
          <circle cx="20" cy="34" r="5" fill="#FFD166" opacity="0.8" />
          <circle cx="40" cy="34" r="5" fill="#FFD166" opacity="0.8" />
        </g>
      ) : kind === 'bell' ? (
        <g>
          <path d="M18 40 Q18 18 30 18 Q42 18 42 40 Z" fill="#FFD166" stroke="#5B4234" strokeWidth="3" />
          <circle cx="30" cy="46" r="5" fill="#5B4234" />
        </g>
      ) : kind === 'horn' ? (
        <g>
          <path d="M14 44 Q24 18 44 22 Q50 30 44 36 Q30 46 14 44 Z" fill="#FF9F45" stroke="#5B4234" strokeWidth="3" />
          <ellipse cx="44" cy="28" rx="7" ry="9" fill="#FFC9DA" stroke="#5B4234" strokeWidth="3" />
        </g>
      ) : (
        <g>
          <path d="M10 24 L24 16 L40 22 L52 14 L52 40 L38 46 L24 40 L10 46 Z" fill="#7EC8E3" stroke="#5B4234" strokeWidth="3" />
          <path d="M24 16 L24 40 M40 22 L40 46" stroke="#5B4234" strokeWidth="2" />
        </g>
      )}
    </svg>
  )
}
