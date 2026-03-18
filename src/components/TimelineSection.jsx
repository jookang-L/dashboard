import { useMemo, useState } from 'react'

const HOLIDAYS_2025 = ['2025-01-01','2025-01-28','2025-01-29','2025-01-30','2025-03-01','2025-05-05','2025-05-06','2025-06-06','2025-08-15','2025-10-03','2025-10-05','2025-10-06','2025-10-07','2025-10-09','2025-12-25']
const HOLIDAYS_2026 = ['2026-01-01','2026-02-16','2026-02-17','2026-02-18','2026-03-01','2026-03-02','2026-05-05','2026-05-24','2026-05-25','2026-06-06','2026-08-15','2026-08-17','2026-09-24','2026-09-25','2026-09-26','2026-10-03','2026-10-05','2026-10-09','2026-12-25']
const HOLIDAYS = new Set([...HOLIDAYS_2025, ...HOLIDAYS_2026])

function TimelineSection({ timelineRef, timelineDays, todayKey, timelineNotes, onOpenNote }) {
  const [hoveredKey, setHoveredKey] = useState(null)

  const monthBreaks = useMemo(() => {
    const set = new Set()
    let prev = null
    for (const d of timelineDays) {
      if (d.month !== prev) set.add(d.key)
      prev = d.month
    }
    return set
  }, [timelineDays])

  const getDayColor = (item) => {
    if (item.key === todayKey) return '#ffffff'
    if (item.dowIdx === 0 || HOLIDAYS.has(item.key)) return '#ef4444'
    if (item.dowIdx === 6) return '#3b82f6'
    return 'var(--heading)'
  }

  return (
    <section ref={timelineRef} className="flex-1 overflow-x-auto rounded-2xl border border-dashboard-border bg-dashboard-card/60 backdrop-blur-sm px-5 py-3">
      <div className="flex items-end gap-0.5 min-w-max">
        {timelineDays.map((item) => {
          const isToday = item.key === todayKey
          const isPast = new Date(item.key) < new Date(todayKey)
          const hasNote = Boolean(timelineNotes[item.key])
          const showMonth = monthBreaks.has(item.key)
          const dayColor = getDayColor(item)

          return (
            <div
              key={item.key}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {showMonth && (
                <span className="mb-1 text-[11px] font-bold text-dashboard-heading">
                  {item.month}월
                </span>
              )}
              {!showMonth && <span className="mb-1 text-[11px] opacity-0">.</span>}

              <button
                type="button"
                data-today={isToday ? 'true' : 'false'}
                onClick={() => onOpenNote(item.key)}
                className={`tl-cell ${isToday ? 'tl-today' : ''} ${isPast ? 'opacity-50' : ''}`}
                style={{ color: dayColor }}
              >
                <span className="text-[13px] font-bold leading-none">{item.day}</span>
                <span className="text-[10px] leading-none">{item.dow}</span>
                {hasNote && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-dashboard-accent" />}
              </button>

              {hoveredKey === item.key && timelineNotes[item.key] && (
                <div className="tl-tooltip">
                  <p className="text-[10px] font-bold opacity-70">{item.month}/{item.day}</p>
                  <p className="text-[12px] leading-snug">{timelineNotes[item.key]}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default TimelineSection
