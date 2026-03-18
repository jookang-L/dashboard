function openFolder(path) {
  const img = new Image()
  img.src = `/api/open-folder?path=${encodeURIComponent(path)}&t=${Date.now()}`
}

function HeaderBar({
  todayLabel, headerNote, setHeaderNote,
  isTitleEditing, setIsTitleEditing,
  settings, focusMode, setFocusMode, onOpenSettings,
}) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-dashboard-border bg-dashboard-card/60 backdrop-blur-sm px-5 py-3">
      <div className="flex items-center gap-4">
        <h1 className="text-[22px] font-extrabold tracking-tight text-dashboard-heading">{todayLabel}</h1>
        {isTitleEditing ? (
          <input
            value={headerNote}
            onChange={e => setHeaderNote(e.target.value)}
            onBlur={() => setIsTitleEditing(false)}
            onKeyDown={e => { if (e.key === 'Enter') setIsTitleEditing(false) }}
            className="input-sm w-[260px]"
            autoFocus
          />
        ) : (
          <button type="button" onClick={() => setIsTitleEditing(true)} className="rounded-lg px-3 py-1.5 text-sm text-dashboard-muted transition hover:bg-dashboard-panel">
            {headerNote || '\uBA54\uBAA8\uB97C \uC785\uB825\uD558\uC138\uC694'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button type="button" className="shortcut-btn" onClick={() => openFolder('C:\\Users\\sec\\Downloads')} title="Downloads">{'\u2B07\uFE0F'}</button>
        <button type="button" className="shortcut-btn" onClick={() => openFolder('C:\\Users\\sec\\Documents\\CNE 받은파일')} title="CNE 받은파일">{'\uD83D\uDCC4'}</button>
        <button type="button" className="shortcut-btn" onClick={() => openFolder('C:\\Users\\sec\\Documents\\카카오톡 받은 파일')} title="카카오톡 받은 파일">{'\uD83D\uDCAC'}</button>
        {settings.semesterUrl && (
          <a className="shortcut-btn" href={settings.semesterUrl} title="1학기 명렬표" target="_blank" rel="noreferrer">{'\uD83D\uDCCA'}</a>
        )}
        <button type="button" className="shortcut-btn" onClick={() => setFocusMode(p => !p)}>
          {focusMode ? '\uD83E\uDDD8 ON' : '\uD83E\uDDD8 OFF'}
        </button>
        <button type="button" className="shortcut-btn" onClick={onOpenSettings}>{'\u2699\uFE0F'}</button>
      </div>
    </header>
  )
}

export default HeaderBar
