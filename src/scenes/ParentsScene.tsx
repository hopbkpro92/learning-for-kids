import { useState } from 'react'
import { idbAllDelete } from '../state/idb'
import { saveProgress, defaultProgress } from '../state/progress'
import { navigate } from '../lib/router'
import { speak } from '../audio/speak'

export default function ParentsScene() {
  const [confirmCount, setConfirmCount] = useState(0)
  const [wiped, setWiped] = useState(false)

  async function tryDelete() {
    if (confirmCount === 0) {
      setConfirmCount(1)
      speak('Bấm xác nhận để xoá dữ liệu.')
      return
    }
    if (confirmCount === 1) {
      setConfirmCount(2)
      return
    }
    try {
      await idbAllDelete()
    } catch {
      /* không có dữ liệu tranh */
    }
    saveProgress(defaultProgress())
    setWiped(true)
    setConfirmCount(0)
    speak('Đã xoá dữ liệu.')
  }

  return (
    <section className="parents-scene" aria-label="Góc của bố mẹ">
      <h2>Góc của bố mẹ</h2>
      {wiped ? <p data-wiped>Đã xoá dữ liệu của bé.</p> : null}
      <button type="button" style={{ minHeight: 64 }} data-delete onClick={tryDelete}>
        {confirmCount === 1 ? 'Xác nhận lần 1' : confirmCount === 2 ? 'Xác nhận lần 2' : 'Xoá dữ liệu'}
      </button>
      <button
        type="button"
        style={{ minHeight: 64 }}
        className="parents-close"
        onClick={() => navigate('#/home')}
      >
        Đóng
      </button>
    </section>
  )
}
