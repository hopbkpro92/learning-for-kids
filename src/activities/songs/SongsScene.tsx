import { useRef, useState } from 'react'
import { playSong, type Song } from '../../audio/songPlayer'
import { SONGS } from '../../data/songs'
import { speak } from '../../audio/speak'
import './songs.css'

export default function SongsScene() {
  const stopRef = useRef<(() => void) | null>(null)
  const currentRef = useRef('')
  const [currentLyric, setCurrentLyric] = useState('')

  function choose(song: Song) {
    stopRef.current?.()
    setCurrentLyric(song.lines[0]?.lyric ?? '')
    stopRef.current = playSong(song, (line) => {
      currentRef.current = line
      setCurrentLyric(line)
    })
    speak('Cùng hát nhé!')
  }

  return (
    <section className="songs-scene" aria-label="Ca hát">
      <div className="songs-lyric" aria-label="lời bài hát">
        {currentLyric}
      </div>
      <nav className="songs-list">
        {SONGS.map((s) => (
          <button
            key={s.id}
            type="button"
            style={{ minHeight: 64 }}
            className="songs-item"
            aria-label={s.title}
            onClick={() => choose(s)}
          >
            <svg className="songs-note" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="13" cy="30" r="6" fill="#FF8FB1" stroke="#5B4234" strokeWidth="2" />
              <circle cx="30" cy="27" r="6" fill="#FFD166" stroke="#5B4234" strokeWidth="2" />
              <path
                d="M19 30 L19 10 L36 7 L36 27"
                fill="none"
                stroke="#5B4234"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span>{s.title}</span>
          </button>
        ))}
      </nav>
    </section>
  )
}
