function DdaySection({
  ddays, getDdayText, showDdayForm, setShowDdayForm,
  newDdayName, setNewDdayName, newDdayDate, setNewDdayDate,
  onAddDday, onDeleteDday,
}) {
  return (
    <section className="flex shrink-0 gap-2">
      {ddays.map((item) => {
        const t = new Date(); t.setHours(0,0,0,0)
        const g = new Date(item.date); g.setHours(0,0,0,0)
        const remain = Math.ceil((g - t) / 86400000)
        const ring = remain <= 0 ? 'ring-2 ring-red-400' : remain <= 7 ? 'ring-2 ring-amber-300' : ''

        return (
          <article key={item.id} className={`relative w-[140px] rounded-xl bg-gradient-to-br p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.color} ${ring}`}>
            <button
              type="button"
              onClick={() => onDeleteDday(item.id)}
              style={{ position: 'absolute', right: 6, top: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', zIndex: 10 }}
            >{'\u2715'}</button>
            <p className="text-[11px] opacity-90">{item.name}</p>
            <p className="mt-1 text-xl font-black tracking-tight">{getDdayText(item.date)}</p>
            <p className="mt-0.5 text-[10px] opacity-70">{item.date}</p>
          </article>
        )
      })}

      {ddays.length < 4 && (
        <div className="w-[140px] rounded-xl border border-dashed border-dashboard-border bg-dashboard-card/60 p-2">
          {showDdayForm ? (
            <div className="flex h-full flex-col gap-1.5">
              <input value={newDdayName} onChange={e => setNewDdayName(e.target.value)} placeholder={'\uC774\uBCA4\uD2B8 \uC774\uB984'} className="input-sm" />
              <input value={newDdayDate} onChange={e => setNewDdayDate(e.target.value)} type="date" className="input-sm" />
              <div className="mt-auto flex gap-1">
                <button type="button" onClick={onAddDday} className="action-btn text-[11px] px-2 py-1">{'\uCD94\uAC00'}</button>
                <button type="button" onClick={() => setShowDdayForm(false)} className="action-btn-muted text-[11px] px-2 py-1">{'\uCDE8\uC18C'}</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setShowDdayForm(true)} className="flex h-full w-full items-center justify-center rounded-lg text-sm font-bold text-dashboard-muted transition hover:text-dashboard-heading">+ D-Day</button>
          )}
        </div>
      )}
    </section>
  )
}

export default DdaySection
