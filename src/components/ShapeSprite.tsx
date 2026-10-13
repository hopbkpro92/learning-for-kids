import type { SceneImageId } from '../activities/puzzle/shape'

/**
 * Hình minh họa SVG tự vẽ — một nguồn duy nhất cho mọi scene.
 * Các door sau thêm id riêng của mình vào SceneImageId (shape.ts).
 */
export default function ShapeSprite({
  id,
  className,
}: {
  id: SceneImageId
  className?: string
}) {
  return (
    <svg className={className} viewBox="0 0 100 100" role="img" aria-label={id}>
      {id === 'bunny' && (
        <g>
          <ellipse cx="38" cy="20" rx="9" ry="22" fill="#FFF6E9" stroke="#5B4234" strokeWidth="4" />
          <ellipse cx="62" cy="20" rx="9" ry="22" fill="#FFF6E9" stroke="#5B4234" strokeWidth="4" />
          <ellipse cx="38" cy="22" rx="3.5" ry="12" fill="#FFC9DA" />
          <ellipse cx="62" cy="22" rx="3.5" ry="12" fill="#FFC9DA" />
          <circle cx="50" cy="58" r="30" fill="#FFF6E9" stroke="#5B4234" strokeWidth="4" />
          <circle cx="42" cy="54" r="4" fill="#5B4234" />
          <circle cx="58" cy="54" r="4" fill="#5B4234" />
          <path d="M45 64 Q50 69 55 64" fill="none" stroke="#5B4234" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {id === 'duck' && (
        <g>
          <ellipse cx="55" cy="62" rx="26" ry="20" fill="#FFD93D" stroke="#5B4234" strokeWidth="4" />
          <circle cx="34" cy="40" r="14" fill="#FFD93D" stroke="#5B4234" strokeWidth="4" />
          <path d="M20 40 Q10 40 14 34 L24 34 Z" fill="#FF9F45" stroke="#5B4234" strokeWidth="3" />
          <circle cx="32" cy="36" r="3.5" fill="#5B4234" />
          <path d="M40 70 Q50 78 62 72" fill="none" stroke="#5B4234" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {id === 'chicken' && (
        <g>
          <path d="M62 30 Q64 20 72 22 Q76 12 82 18 Q88 16 86 26" fill="#C62828" stroke="#5B4234" strokeWidth="3" />
          <circle cx="52" cy="42" r="18" fill="#FFFFFF" stroke="#5B4234" strokeWidth="4" />
          <path d="M36 34 L20 34 L34 26 Z" fill="#FF9F45" stroke="#5B4234" strokeWidth="3" />
          <circle cx="50" cy="38" r="3" fill="#5B4234" />
          <path d="M30 58 Q30 78 55 78 Q80 78 78 58" fill="#FFFFFF" stroke="#5B4234" strokeWidth="4" />
          <path d="M52 62 Q56 66 60 62" fill="none" stroke="#5B4234" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {id === 'apple' && (
        <g>
          <path d="M50 26 Q30 24 28 48 Q26 72 50 76 Q74 72 72 48 Q70 24 50 26 Z" fill="#C62828" stroke="#5B4234" strokeWidth="4" />
          <path d="M50 26 Q52 16 60 12" fill="none" stroke="#5B4234" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 12 Q74 12 72 24 Q60 26 60 12 Z" fill="#7CD36F" stroke="#5B4234" strokeWidth="3" />
        </g>
      )}
      {id === 'banana' && (
        <g>
          <path d="M24 40 Q26 70 60 72 Q78 72 82 56 Q60 66 40 46 Q32 38 24 40 Z" fill="#FFD93D" stroke="#5B4234" strokeWidth="4" />
          <path d="M24 40 Q16 40 16 34 L26 34 Z" fill="#7CD36F" stroke="#5B4234" strokeWidth="3" />
        </g>
      )}
      {id === 'milk' && (
        <g>
          <path d="M36 22 L64 22 L70 44 L70 74 Q64 78 50 78 Q36 78 30 74 L30 44 Z" fill="#FFFFFF" stroke="#5B4234" strokeWidth="4" />
          <path d="M34 46 L66 46 L66 58 L34 58 Z" fill="#3BA6D9" />
          <path d="M36 22 L34 12 L62 12 L64 22" fill="#E0F4FF" stroke="#5B4234" strokeWidth="3" />
        </g>
      )}
      {id === 'fish' && (
        <g>
          <path d="M22 50 Q38 28 60 42 Q78 50 60 62 Q38 72 22 50 Z" fill="#7EC8E3" stroke="#5B4234" strokeWidth="4" />
          <path d="M78 50 Q92 36 88 50 Q92 64 78 50 Z" fill="#3BA6D9" stroke="#5B4234" strokeWidth="3" />
          <circle cx="34" cy="46" r="4" fill="#5B4234" />
        </g>
      )}
      {id === 'leaf' && (
        <g>
          <path d="M50 18 Q76 34 70 56 Q66 72 50 78 Q34 72 30 56 Q24 34 50 18 Z" fill="#7CD36F" stroke="#5B4234" strokeWidth="4" />
          <path d="M50 26 L50 70" stroke="#5B4234" strokeWidth="3" />
          <path d="M50 40 L36 34 M50 52 L64 44" stroke="#5B4234" strokeWidth="2" />
        </g>
      )}
      {id === 'star' && (
        <g>
          <path d="M50 14 L59 40 L88 40 L64 56 L72 84 L50 66 L28 84 L36 56 L12 40 L41 40 Z" fill="#FFD93D" stroke="#5B4234" strokeWidth="4" />
        </g>
      )}
    </svg>
  )
}

export type { SceneImageId }
