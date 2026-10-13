export type BunnyMood = 'happy' | 'wave' | 'sleepy'

export default function Bunny({ mood = 'happy' }: { mood?: BunnyMood }) {
  return (
    <svg
      className={`bunny bunny-${mood}`}
      viewBox="0 0 120 130"
      width="140"
      height="150"
      role="img"
      aria-label="Bạn thỏ"
    >
      {/* tai */}
      <ellipse cx="42" cy="28" rx="10" ry="24" fill="#FFF6E9" stroke="#5B4234" strokeWidth="4" />
      <ellipse cx="78" cy="28" rx="10" ry="24" fill="#FFF6E9" stroke="#5B4234" strokeWidth="4" />
      <ellipse cx="42" cy="30" rx="4" ry="14" fill="#FFC9DA" />
      <ellipse cx="78" cy="30" rx="4" ry="14" fill="#FFC9DA" />
      {/* má */}
      <circle cx="30" cy="78" r="9" fill="#FFD9E4" opacity="0.9" />
      <circle cx="90" cy="78" r="9" fill="#FFD9E4" opacity="0.9" />
      {/* mắt */}
      {mood === 'sleepy' ? (
        <g stroke="#5B4234" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M42 62 Q47 67 52 62" />
          <path d="M68 62 Q73 67 78 62" />
        </g>
      ) : (
        <g>
          <circle cx="47" cy="62" r="5.5" fill="#5B4234" />
          <circle cx="73" cy="62" r="5.5" fill="#5B4234" />
          <circle cx="49" cy="60" r="1.8" fill="#FFFFFF" />
          <circle cx="75" cy="60" r="1.8" fill="#FFFFFF" />
        </g>
      )}
      {/* mũi miệng */}
      <path d="M57 68 L63 68 L60 72 Z" fill="#5B4234" />
      <path d="M52 74 Q60 82 68 74" fill="none" stroke="#5B4234" strokeWidth="4" strokeLinecap="round" />
      {/* ria */}
      <path d="M20 66 L34 66" stroke="#5B4234" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 76 L34 74" stroke="#5B4234" strokeWidth="2.5" strokeLinecap="round" />
      {/* chân dê tay vẫy khi mood wave */}
      <path d="M28 108 Q26 118 34 122" fill="none" stroke="#5B4234" strokeWidth="4" strokeLinecap="round" />
      {mood === 'wave' ? (
        <path d="M96 100 Q112 92 108 76" fill="none" stroke="#5B4234" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <path d="M92 108 Q94 118 86 122" fill="none" stroke="#5B4234" strokeWidth="4" strokeLinecap="round" />
      )}
      {/* thân */}
      <ellipse cx="60" cy="112" rx="26" ry="16" fill="#FFF6E9" stroke="#5B4234" strokeWidth="4" />
      <circle cx="60" cy="106" r="4" fill="#FFC9DA" />
    </svg>
  )
}
