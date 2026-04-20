import styles from './StatusCard.module.css'

const sparklines = {
  '#6366f1': [40, 55, 45, 60, 55, 70, 65],
  '#10b981': [60, 65, 70, 68, 75, 72, 80],
  '#f59e0b': [80, 70, 75, 65, 60, 58, 55],
  '#8b5cf6': [30, 35, 32, 40, 38, 42, 45],
}

export default function StatusCard({ label, value, change, icon, color }) {
  const points = sparklines[color] || [40, 50, 45, 60, 55, 65, 70]
  const max    = Math.max(...points)
  const min    = Math.min(...points)
  const w      = 80
  const h      = 32

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - ((p - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `0,${h} ${coords} ${w},${h}`
  const isPositive = !change.startsWith('-')

  return (
    <div className={styles.card} style={{ '--card-color': color }}>
      <div className={styles.glow} />

      <div className={styles.top}>
        <div className={styles.iconWrap} style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <span className={styles.icon} style={{ color }}>{icon}</span>
        </div>
        <span className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? '▲' : '▼'} {change}
        </span>
      </div>

      <div className={styles.value} style={{ color }}>{value}</div>
      <div className={styles.label}>{label}</div>

      {/* Sparkline */}
      <div className={styles.sparkline}>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height="100%">
          <defs>
            <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={areaPoints}
            fill={`url(#grad-${color.replace('#','')})`}
          />
          <polyline
            points={coords}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* End dot */}
          <circle
            cx={(points.length - 1) / (points.length - 1) * w}
            cy={h - ((points[points.length - 1] - min) / (max - min || 1)) * h}
            r="2.5"
            fill={color}
          />
        </svg>
      </div>
    </div>
  )
}