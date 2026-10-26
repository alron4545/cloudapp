export default function UvuMark({ small = false }) {
  return (
    <div className={small ? 'uvu-mark uvu-mark--small' : 'uvu-mark'} role="img" aria-label="UVU">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path
          className="uvu-mark__shield"
          d="M60 6 108 22v40c0 28-20 44-48 52C32 106 12 90 12 62V22z"
        />
        <path className="uvu-mark__peaks" d="m24 70 20-26 10 13 10-16 32 29z" />
        <text x="60" y="94" textAnchor="middle">
          UVU
        </text>
      </svg>
    </div>
  )
}
