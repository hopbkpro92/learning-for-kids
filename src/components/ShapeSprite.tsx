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
    </svg>
  )
}

export type { SceneImageId }
