import { useState, useEffect } from 'react'
import styles from './Chart.module.css'

export default function Chart({ data = [], labels = [], title = 'Chart', subtitle = '', color = '#6366f1' }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(t)
  }, [])

  const w      = 500
  const h      = 160
  const pad    = { top: 16, right: 16, bottom: 32, left: 40 }
  const innerW = w - pad.left - pad.right
  const innerH = h - pad.top - pad.bottom

  const max    = Math.max(...data, 1)
  const min    = 0
  const ySteps = [0, 25, 50, 75, 100]

  const pts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top  + innerH - ((d - min) / (max - min)) * innerH,
  }))

  // Smooth bezier curve
  const pathD = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`
    const prev = pts[i - 1]
    const cx   = (prev.x + pt.x) / 2
    return `${acc} C ${cx} ${prev.y} ${cx} ${pt.y} ${pt.x} ${pt.y}`
  }, '')

  const areaD = `${pathD} L ${pts[pts.length-1].x} ${pad.top + innerH} L ${pts[0].x} ${pad.top + innerH} Z`

  const activeIdx = data.indexOf(Math.max(...data))

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.legend}>
          <span className={styles.legendDot} style={{ background: color }} />
          <span className={styles.legendText}>Deployments</span>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg} preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0"    />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {ySteps.map((step, i) => {
            const y = pad.top + innerH - (step / 100) * innerH
            return (
              <g key={i}>
                <line
                  x1={pad.left} y1={y}
                  x2={w - pad.right} y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
                <text
                  x={pad.left - 8} y={y + 4}
                  textAnchor="end"
                  className={styles.axisLabel}
                >
                  {Math.round((step / 100) * max)}
                </text>
              </g>
            )
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#lineGrad)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#glow)"
            className={styles.line}
          />

          {/* Dots */}
          {pts.map((pt, i) => (
            <g key={i} className={styles.dotGroup}>
              <circle
                cx={pt.x} cy={pt.y}
                r={i === activeIdx ? 5 : 3.5}
                fill={i === activeIdx ? color : 'var(--surface)'}
                stroke={color}
                strokeWidth="2"
                filter={i === activeIdx ? 'url(#glow)' : ''}
              />
              {/* Tooltip */}
              <g className={styles.tooltip}>
                <rect
                  x={pt.x - 18} y={pt.y - 28}
                  width="36" height="20"
                  rx="5"
                  fill="var(--surface2)"
                  stroke="var(--border2)"
                  strokeWidth="1"
                />
                <text
                  x={pt.x} y={pt.y - 14}
                  textAnchor="middle"
                  className={styles.tooltipText}
                >
                  {data[i]}
                </text>
              </g>
            </g>
          ))}

          {/* X axis labels */}
          {pts.map((pt, i) => (
            <text
              key={i}
              x={pt.x} y={h - 4}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {labels[i]}
            </text>
          ))}

          {/* Vertical line on active */}
          <line
            x1={pts[activeIdx]?.x} y1={pad.top}
            x2={pts[activeIdx]?.x} y2={pad.top + innerH}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  )
}