import { useRoute } from './lib/router'
import HomeScene from './scenes/HomeScene'
import Bunny from './components/Bunny'
import PuzzleScene from './activities/puzzle/PuzzleScene'
import SongsScene from './activities/songs/SongsScene'
import CountingScene from './activities/counting/CountingScene'

export default function App() {
  const route = useRoute()
  const door = route.replace('#/door/', '')

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

  if (route.startsWith('#/door/')) {
    return (
      <main id="root-viewport">
        <div className="pending-scene">
          <Bunny mood="happy" />
        </div>
      </main>
    )
  }

  return (
    <main id="root-viewport">
      <HomeScene />
    </main>
  )
}
