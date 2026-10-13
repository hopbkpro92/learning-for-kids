import { useState } from 'react'
import { praise } from '../../audio/sfx'
import { speak } from '../../audio/speak'
import { addStars } from '../../state/progress'
import ShapeSprite, { type SceneImageId } from '../../components/ShapeSprite'
import { genRound, type WhoRound } from './animals'
import './whois.css'

const ADVANCE_MS = 1500

export default function WhoIsScene() {
  const [round, setRound] = useState<WhoRound>(() => genRound())
  const [version, setVersion] = useState(1)
  const [solved, setSolved] = useState(false)

  function nextRound() {
    setSolved(false)
    setVersion((v) => v + 1)
    setRound(genRound())
  }

  function choose(key: SceneImageId) {
    if (solved) return
    if (key === round.answer) {
      setSolved(true)
      praise()
      addStars(1)
      speak(`${round.name} kêu ${round.cry}`)
      window.setTimeout(() => nextRound(), ADVANCE_MS)
    } else {
      speak('Chưa đúng, thử lại nhé.')
    }
  }

  return (
    <section className="whois-scene" aria-label="Ai là ai">
      <div className="whois-prompt" aria-label="câu hỏi">
        Bunny hỏi: con gì kêu «{round.cry}»?
      </div>
      <div className="whois-options" role="group" aria-label="chọn con vật" data-testid="who-version" data-v={String(version)}>
        {round.options.map((key) => (
          <button
            key={key}
            type="button"
            className="whois-option"
            style={{ minHeight: 96 }}
            data-option
            data-correct={String(key === round.answer)}
            onClick={() => choose(key)}
          >
            <AnimalSprite kind={key} />
          </button>
        ))}
      </div>
    </section>
  )
}

function AnimalSprite({ kind }: { kind: SceneImageId }) {
  if (kind === 'cat')
    return (
      <svg className="animal-art" viewBox="0 0 100 100" aria-hidden="true">
        <g>
          <path d="M30 30 L24 12 L44 22 Z" fill="#FF9F45" stroke="#5B4234" strokeWidth="3" />
          <path d="M70 30 L76 12 L56 22 Z" fill="#FF9F45" stroke="#5B4234" strokeWidth="3" />
          <circle cx="50" cy="52" r="26" fill="#FF9F45" stroke="#5B4234" strokeWidth="4" />
          <circle cx="42" cy="48" r="4" fill="#5B4234" />
          <circle cx="58" cy="48" r="4" fill="#5B4234" />
          <path d="M46 56 L54 56 L50 60 Z" fill="#FF8FB1" />
          <path d="M44 62 Q50 67 56 62" fill="none" stroke="#5B4234" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 56 L36 56 M24 62 L36 58" stroke="#5B4234" strokeWidth="2" />
          <path d="M76 56 L64 56 M76 62 L64 58" stroke="#5B4234" strokeWidth="2" />
        </g>
      </svg>
    )
  if (kind === 'dog')
    return (
      <svg className="animal-art" viewBox="0 0 100 100" aria-hidden="true">
        <g>
          <circle cx="50" cy="50" r="26" fill="#D4A24E" stroke="#5B4234" strokeWidth="4" />
          <path d="M24 38 Q14 30 18 44 M76 38 Q86 30 82 44" fill="#D4A24E" stroke="#5B4234" strokeWidth="3" />
          <circle cx="42" cy="46" r="4" fill="#5B4234" />
          <circle cx="58" cy="46" r="4" fill="#5B4234" />
          <path d="M50 54 Q50 60 46 60 Q50 64 50 60 Q50 64 54 60 Q50 60 50 54" fill="#5B4234" />
          <path d="M44 64 Q50 69 56 64" fill="none" stroke="#5B4234" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    )
  if (kind === 'cow')
    return (
      <svg className="animal-art" viewBox="0 0 100 100" aria-hidden="true">
        <g>
          <circle cx="50" cy="52" r="28" fill="#FFFFFF" stroke="#5B4234" strokeWidth="4" />
          <path d="M22 28 Q14 16 30 20 Z" fill="#5B4234" />
          <path d="M78 28 Q86 16 70 20 Z" fill="#5B4234" />
          <path d="M36 40 Q46 34 50 42 Q40 46 32 44 Z" fill="#5B4234" />
          <circle cx="42" cy="50" r="4" fill="#5B4234" />
          <circle cx="58" cy="50" r="4" fill="#5B4234" />
          <ellipse cx="50" cy="62" rx="10" ry="7" fill="#FFC9DA" stroke="#5B4234" strokeWidth="3" />
          <circle cx="46" cy="62" r="2" fill="#5B4234" />
          <circle cx="54" cy="62" r="2" fill="#5B4234" />
        </g>
      </svg>
    )
  if (kind === 'frog')
    return (
      <svg className="animal-art" viewBox="0 0 100 100" aria-hidden="true">
        <g>
          <circle cx="36" cy="34" r="12" fill="#7CD36F" stroke="#5B4234" strokeWidth="4" />
          <circle cx="64" cy="34" r="12" fill="#7CD36F" stroke="#5B4234" strokeWidth="4" />
          <ellipse cx="50" cy="58" rx="28" ry="22" fill="#7CD36F" stroke="#5B4234" strokeWidth="4" />
          <circle cx="36" cy="34" r="5" fill="#5B4234" />
          <circle cx="64" cy="34" r="5" fill="#5B4234" />
          <path d="M38 60 Q50 68 62 60" fill="none" stroke="#5B4234" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    )
  return (
    <svg className="animal-art" viewBox="0 0 100 100" aria-hidden="true">
      {kind === 'duck' && (
        <g>
          <ellipse cx="55" cy="62" rx="26" ry="20" fill="#FFD93D" stroke="#5B4234" strokeWidth="4" />
          <circle cx="34" cy="40" r="14" fill="#FFD93D" stroke="#5B4234" strokeWidth="4" />
          <path d="M20 40 Q10 40 14 34 L24 34 Z" fill="#FF9F45" stroke="#5B4234" strokeWidth="3" />
          <circle cx="32" cy="36" r="3.5" fill="#5B4234" />
        </g>
      )}
      {kind === 'chicken' && (
        <g>
          <path d="M62 30 Q64 20 72 22 Q76 12 82 18 Q88 16 86 26" fill="#C62828" stroke="#5B4234" strokeWidth="3" />
          <circle cx="52" cy="42" r="18" fill="#FFFFFF" stroke="#5B4234" strokeWidth="4" />
        </g>
      )}
    </svg>
  )
}
