function RightInfoPanel({
  focusMode, weather, weatherMessage,
  meals, mealMessage, parsedTimetable, currentPeriod,
}) {
  return (
    <div className={`flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-dashboard-border bg-dashboard-card/60 backdrop-blur-sm p-4 ${focusMode ? 'focus-dim' : ''}`}>
      <article className="info-card">
        <p className="info-title">날씨</p>
        {weather ? (
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-dashboard-heading">{weather.emoji} {weather.temp}°C</p>
            <p className="text-[12px] text-dashboard-muted">{weather.description}</p>
            <p className="text-[11px] text-dashboard-muted">최저 {weather.min}° / 최고 {weather.max}°</p>
          </div>
        ) : (
          <p className="text-[12px] text-dashboard-muted">{weatherMessage}</p>
        )}
      </article>

      <article className="info-card">
        <p className="info-title">급식</p>
        {meals.length > 0 ? (
          <ul className="space-y-0.5">
            {meals.map((item, i) => (
              <li key={`${item.text}-${i}`} className={`text-[12px] ${item.warning ? 'font-bold text-red-500' : 'text-dashboard-text'}`}>
                {item.warning ? '⚠️ ' : '• '}{item.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-dashboard-muted">{mealMessage}</p>
        )}
      </article>

      <article className="info-card min-h-0 flex-1 overflow-auto">
        <p className="info-title">시간표</p>
        <ul className="space-y-1.5">
          {parsedTimetable.map(item => (
            <li key={`${item.period}-${item.start}`} className={`flex items-center gap-2 rounded-lg border border-dashboard-border bg-dashboard-panel/50 px-2 py-1 ${currentPeriod === item.period ? 'pulse-active border-dashboard-accent' : ''}`}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dashboard-heading text-[10px] font-bold text-dashboard-panel">{item.period}</span>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-dashboard-heading">{item.subject}</p>
                <p className="text-[10px] text-dashboard-muted">{item.start} - {item.end}</p>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </div>
  )
}

export default RightInfoPanel
