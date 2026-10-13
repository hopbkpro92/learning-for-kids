import { useEffect, useRef, useState } from 'react'
import Bunny from '../components/Bunny'
import { navigate } from '../lib/router'
import { restLeft, tickRest } from '../state/session'
import { makeTeaser } from '../state/teaser'
import { loadProgress } from '../state/progress'
import { speak } from '../audio/speak'
import { synth } from '../audio/synth'
import './rest.css'

const LULLABY: { note: string; beats: number }[] = [
  { note: 'C4', beats: 2 },
  { note: 'E4', beats: 2 },
  { note: 'G4', beats: 2 },
  { note: 'E4', beats: 2 },
]

export default function RestScene() {
  const [teaser] = useState(() => makeTeaser(loadProgress()))
  const spoken = useRef(false)
  const left = useRef(0)

  useEffect(() => {
    if (!spoken.current) {
      spoken.current = true
      speak('Nghỉ mắt nhé bạn, nghe nhạc ru êm.')
      left.current = restLeft()
      let at = 600
      for (const n of LULLABY) {
        const note = n
        window.setTimeout(() => synth.playNote(note.note, note.beats, 'bell'), at)
        at += note.beats * 500
      }
    }
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      tickRest(1)
      left.current = restLeft()
      if (restLeft() === 0) navigate('#/home')
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="rest-scene" aria-label="Giờ nghỉ">
      <svg className="rest-moon" viewBox="0 0 60 60" aria-hidden="true">
        <path d="M40 8 A24 24 0 1 0 52 44 A20 20 0 1 1 40 8 Z" fill="#FFF3B0" />
      </svg>
      <Bunny mood="sleepy" />
      <p className="rest-text">Nghỉ mắt nhé bạn, nghe nhạc ru êm…</p>
      <div className="rest-hourglass" data-testid="rest-left" data-seconds={String(restLeft())}>
        <svg viewBox="0 0 40 56" aria-hidden="true">
          <path d="M8 2 L32 2 L24 26 L22 28 L22 28 L24 30 L32 54 L8 54 L16 30 L18 28 L18 28 L16 26 Z" fill="#FFF3B0" stroke="#8CA0D9" strokeWidth="3" />
        </svg>
      </div>
      <p className="rest-teaser">{teaser.text}</p>
    </section>
  )
}
