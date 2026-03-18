function TimelineNoteModal({ timelineModal, timelineText, setTimelineText, onClose, onSave }) {
  if (!timelineModal) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-dashboard-border bg-dashboard-card p-4 shadow-xl">
        <p className="mb-2 text-sm font-bold text-dashboard-heading">{timelineModal} 메모</p>
        <textarea
          value={timelineText}
          onChange={(event) => setTimelineText(event.target.value)}
          className="h-36 w-full resize-none rounded-lg border border-dashboard-border bg-dashboard-panel p-3 text-sm outline-none ring-dashboard-accent focus:ring-2"
          placeholder="메모를 입력하세요."
        />
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" className="action-btn-muted" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="action-btn" onClick={onSave}>
            저장 / 삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimelineNoteModal
