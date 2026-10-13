import { useRoute } from './lib/router'
import HomeScene from './scenes/HomeScene'
import Bunny from './components/Bunny'

export default function App() {
  const route = useRoute()

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
