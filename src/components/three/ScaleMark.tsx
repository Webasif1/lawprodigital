/**
 * Static scales of justice in navy and gold: used on mobile, with reduced
 * motion, without WebGL, and as the poster while the 3D scene loads. It sits
 * at the same rest angle as the 3D version, tipped toward the "signed
 * clients" pan.
 */
export function ScaleMark({ className = "" }: { className?: string }) {
  const tilt = -5; // degrees, right side down
  return (
    <svg viewBox="0 0 480 480" className={className} role="img" aria-label="Gold scales of justice tipped toward a stack of coins">
      <defs>
        <linearGradient id="sm-gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ecd07a" />
          <stop offset="0.55" stopColor="#d6ad3b" />
          <stop offset="1" stopColor="#a8821f" />
        </linearGradient>
      </defs>
      {/* base */}
      <ellipse cx="240" cy="420" rx="120" ry="16" fill="#0f1f3d" opacity="0.08" />
      <rect x="140" y="392" width="200" height="22" rx="11" fill="#0f1f3d" />
      <rect x="175" y="374" width="130" height="20" rx="10" fill="url(#sm-gold)" />
      {/* column */}
      <rect x="233" y="118" width="14" height="258" rx="7" fill="url(#sm-gold)" />
      <circle cx="240" cy="104" r="16" fill="url(#sm-gold)" />
      <g transform={`rotate(${tilt} 240 140)`}>
        <rect x="80" y="135" width="320" height="9" rx="4.5" fill="url(#sm-gold)" />
        <circle cx="240" cy="140" r="9" fill="#e7c45f" />
        {[84, 396].map((x, i) => (
          <g key={x} transform={`rotate(${-tilt} ${x} 140)`}>
            <circle cx={x} cy="140" r="8" fill="#e7c45f" />
            <path d={`M${x} 140 L${x - 52} 262 M${x} 140 L${x + 52} 262 M${x} 140 L${x} 258`} stroke="#b8922c" strokeWidth="2" />
            <path d={`M${x - 62} 262 Q${x} 300 ${x + 62} 262 Z`} fill="url(#sm-gold)" />
            {i === 1 &&
              [0, 1, 2].map((k) => <ellipse key={k} cx={x + (k - 1) * 4} cy={256 - k * 8} rx="18" ry="5" fill="#e7c45f" stroke="#a8821f" strokeWidth="1" />)}
          </g>
        ))}
      </g>
    </svg>
  );
}
