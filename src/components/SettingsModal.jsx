function SettingsModal({ settingsOpen, settingsDraft, setSettingsDraft, onClose, onSave, theme }) {
  if (!settingsOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-2xl">
        <p className="mb-4 text-lg font-bold text-dashboard-heading">설정</p>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="setting-field">
            등교 시간
            <input
              type="time"
              value={settingsDraft.schoolStart}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, schoolStart: event.target.value }))}
            />
          </label>
          <label className="setting-field">
            하교 시간
            <input
              type="time"
              value={settingsDraft.schoolEnd}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, schoolEnd: event.target.value }))}
            />
          </label>
          <label className="setting-field">
            OpenWeatherMap API 키
            <input
              value={settingsDraft.weatherApiKey}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, weatherApiKey: event.target.value }))}
            />
          </label>
          <label className="setting-field">
            날씨 도시명
            <input
              value={settingsDraft.weatherCity}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, weatherCity: event.target.value }))}
            />
          </label>
          <label className="setting-field">
            NEIS API 키
            <input
              value={settingsDraft.neisApiKey}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, neisApiKey: event.target.value }))}
            />
          </label>
          <label className="setting-field">
            교육청 코드
            <input
              value={settingsDraft.neisOfficeCode}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, neisOfficeCode: event.target.value }))}
            />
          </label>
          <label className="setting-field">
            학교 코드
            <input
              value={settingsDraft.neisSchoolCode}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, neisSchoolCode: event.target.value }))}
            />
          </label>
          <label className="setting-field">
            알레르기 번호 (쉼표 구분)
            <input
              value={settingsDraft.allergyNumbers}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, allergyNumbers: event.target.value }))}
            />
          </label>
          <label className="setting-field md:col-span-2">
            1학기 명렬표 URL
            <input
              value={settingsDraft.semesterUrl}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, semesterUrl: event.target.value }))}
            />
          </label>
          <label className="setting-field md:col-span-2">
            시간표 설정 (교시,시작,종료,과목)
            <textarea
              value={settingsDraft.timetableText}
              onChange={(event) => setSettingsDraft((prev) => ({ ...prev, timetableText: event.target.value }))}
              rows={7}
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="action-btn-muted" onClick={onClose}>
            취소
          </button>
          <button type="button" className="action-btn" onClick={onSave}>
            저장
          </button>
        </div>
        <p className="mt-2 text-xs text-dashboard-muted">현재 자동 테마: {theme === 'light' ? '라이트' : '다크'}</p>
      </div>
    </div>
  )
}

export default SettingsModal
