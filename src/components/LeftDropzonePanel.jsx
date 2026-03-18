const ZONES = [
  { id: 'desktop', icon: '\u{1F5A5}\uFE0F', label: '\uBC14\uD0D5\uD654\uBA74' },
  { id: 'working', icon: '\u{1F4DD}', label: '\uC791\uC5C5\uC911' },
  { id: 'done', icon: '\u2705', label: '\uC644\uB8CC' },
  { id: 'etc', icon: '\u{1F4C1}', label: '\uAE30\uD0C0' },
]

function LeftDropzonePanel({ focusMode, dropzoneActive, setDropzoneActive }) {
  return (
    <div className={`flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-dashboard-border bg-dashboard-card/80 backdrop-blur-sm p-4 ${focusMode ? 'focus-dim' : ''}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-dashboard-muted">{'\uD30C\uC77C \uC815\uB9AC'}</p>
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
        {ZONES.map(zone => (
          <div
            key={zone.id}
            onDragEnter={e => { e.preventDefault(); setDropzoneActive(zone.id) }}
            onDragOver={e => e.preventDefault()}
            onDragLeave={() => setDropzoneActive('')}
            onDrop={e => { e.preventDefault(); setDropzoneActive('') }}
            className={`dropzone ${dropzoneActive === zone.id ? 'dropzone-active' : ''}`}
            title={zone.label}
          >
            <span className="text-3xl opacity-70">{zone.icon}</span>
            <span className="mt-1 text-[10px] font-medium text-dashboard-muted">{zone.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeftDropzonePanel
