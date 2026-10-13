import { useEffect } from 'react'
import { useRoute } from './lib/router'
import HomeScene from './scenes/HomeScene'
import RestScene from './scenes/RestScene'
import PuzzleScene from './activities/puzzle/PuzzleScene'
import SongsScene from './activities/songs/SongsScene'
import CountingScene from './activities/counting/CountingScene'
import { beginRest, registerPlay, restDue, restLeft } from './state/session'

export default function App() {
  const route = useRoute()
  const due = restDue()

  if (due && restLeft() === 0) beginRest()
  const resting = due || restLeft() > 0

  useEffect(() => {
    if (!route.startsWith('#/door/')) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') registerPlay(1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [route])

  const door = route.replace('#/door/', '')

  if (resting) {
    return (
      <main id="root-viewport">
        <RestScene />
      </main>
    )
  }

  if (route === '#/rest') {
    return (
      <main id="root-viewport">
        <RestScene />
      </main>
    )
  }

  if (door === 'puzzle') {
    return (
      <main id="root-viewport">
        <PuzzleScene />
      </main>
    )
  }

  if (door === 'songs') {
    return (
      <main id="root-viewport">
        <SongsScene />
      </main>
    )
  }

  if (door === 'counting') {
    return (
      <main id="root-viewport">
        <CountingScene />
      </main>
    )
  }

  return (
    <main id="root-viewport">
      <HomeScene />
    </main>
  )
}
