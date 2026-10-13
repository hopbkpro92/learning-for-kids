import { useState } from 'react'
import { praise } from '../../audio/sfx'
import { speak } from '../../audio/speak'
import {
  bumpCountingStreak,
  loadProgress,
  resetCountingStreak,
} from '../../state/progress'
import ShapeSprite, { type SceneImageId } from '../../components/ShapeSprite'
import { genQuestion } from './gen'
import './counting.css'

const ADVANCE_MS = 1500

const SPRITE_NAME: Partial<Record<SceneImageId, string>> = {
  bunny: 'thỏ',
  duck: 'vịt',
  chicken: 'gà',
  apple: 'quả táo',
  banana: 'quả chuối',
  milk: 'sữa',
  fish: 'con cá',
  leaf: 'cái lá',
  star: 'ngôi sao',
}

function spriteName(id: SceneImageId): string {
  return SPRITE_NAME[id] ?? 'vịt'
}

export default function CountingScene() {
  const maxCount = loadProgress().countMax
  const [question, setQuestion] = useState(() => genQuestion(maxCount))
  const [version, setVersion] = useState(1)
  const [solved, setSolved] = useState(false)

  function nextQuestion() {
    setSolved(false)
    setVersion((v) => v + 1)
    setQuestion(genQuestion(loadProgress().countMax))
  }

  function choose(v: number) {
    if (solved) return
    if (v === question.answer) {
      setSolved(true)
      praise()
      bumpCountingStreak()
      speak(`Đúng rồi, có ${question.answer} con ${spriteName(question.sprite)}`)
      window.setTimeout(() => nextQuestion(), ADVANCE_MS)
    } else {
      resetCountingStreak()
      speak('Chưa phải bạn ơi, thử lại nhé')
    }
  }

  return (
    <section className="counting-scene" aria-label="Đếm số">
      <div className="counting-prompt" aria-label="câu hỏi">
        Bunny hỏi: có mấy bạn này?
      </div>
      <div
        className="counting-board"
        data-testid="counting-board"
        data-items={String(question.items)}
        data-question-version={String(version)}
      >
        {Array.from({ length: question.items }).map((_, i) => (
          <ShapeSprite key={i} id={question.sprite} className="counting-item" />
        ))}
      </div>
      <div className="counting-options" role="group" aria-label="chọn số">
        {question.options.map((v) => (
          <button
            key={v}
            type="button"
            className="counting-option"
            style={{ minHeight: 72 }}
            data-option
            data-correct={String(v === question.answer)}
            data-solved={String(solved && v === question.answer)}
            data-answer={String(v)}
            onClick={() => choose(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </section>
  )
}
