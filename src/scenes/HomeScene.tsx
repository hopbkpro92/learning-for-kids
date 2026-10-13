import { useEffect, useRef } from 'react'
import Bunny from '../components/Bunny'
import DoorButton, { ALL_DOORS, type DoorId } from '../components/DoorButton'
import { speak } from '../audio/speak'
import { navigate } from '../lib/router'

export function suggestDoor(playedDoor: DoorId): DoorId {
  const others = ALL_DOORS.filter((d) => d !== playedDoor)
  const pick = others[Math.floor(Math.random() * others.length)] ?? 'puzzle'
  return pick
}

let greetedThisSession = false

export default function HomeScene() {
  const greeted = useRef(false)
  const holdTimer = useRef<number | null>(null)

  useEffect(() => {
    if (greeted.current || greetedThisSession) return
    greeted.current = true
    greetedThisSession = true
    speak('ChÃ o bÃ©, giá» thÃ´i mÃ¬nh cÃ¹ng chÆ¡i nhÃ©!')
  }, [])

  useEffect(() => () => {
    if (holdTimer.current !== null) window.clearTimeout(holdTimer.current)
  }, [])

  function gateStart() {
    if (holdTimer.current !== null) return
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null
      navigate('#/parents')
    }, 3000)
  }

  function gateCancel() {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
  }

  return (
    <section className="home-scene" aria-label="MÃ n nhÃ ">
      <Cloud x={54} y={-6} delay={0} />
      <Bunny mood="wave" />
      <nav className="door-list">
        <DoorButton doorId="puzzle" label="Xáº¿p hÃ¬nh" />
        <DoorButton doorId="songs" label="Ca hÃ¡t" />
        <DoorButton doorId="counting" label="Äáº¿m sá»‘" />
      </nav>
      <svg className="grass" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 12 Q12 4 25 10 T50 9 T75 11 T100 8 L100 20 L0 20 Z" fill="#A8E6A3" />
        <path d="M0 16 Q20 10 40 14 T100 13 L100 20 L0 20 Z" fill="#7CD36F" />
      </svg>
      <button
        type="button"
        id="parent-gate"
        className="parent-gate"
        aria-label="GÃ³c cá»§a bá»‘ máº¹"
        onPointerDown={gateStart}
        onPointerUp={gateCancel}
        onPointerCancel={gateCancel}
        onPointerLeave={gateCancel}
      />
    </section>
  )
}

function Cloud({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <svg
      className="cloud"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
      viewBox="0 0 60 30"
      aria-hidden="true"
    >
      <path
        d="M12 22 Q4 22 6 16 Q2 12 10 10 Q12 4 22 7 Q28 2 34 7 Q44 4 46 11 Q56 10 54 17 Q58 22 48 22 Z"
        fill="#FFFFFF"
        opacity="0.92"
      />
    </svg>
  )
}
