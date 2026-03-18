import { useEffect, useMemo, useRef, useState } from 'react'
import DdaySection from './components/DdaySection'
import HeaderBar from './components/HeaderBar'
import LeftDropzonePanel from './components/LeftDropzonePanel'
import RightInfoPanel from './components/RightInfoPanel'
import SettingsModal from './components/SettingsModal'
import TimelineNoteModal from './components/TimelineNoteModal'
import TimelineSection from './components/TimelineSection'
import TodoMemoPanel from './components/TodoMemoPanel'

const STORAGE_KEYS = {
  headerNote: 'teacher-dashboard-header-note',
  timelineNotes: 'teacher-dashboard-timeline-notes',
  ddays: 'teacher-dashboard-ddays',
  todos: 'teacher-dashboard-todos',
  memo: 'teacher-dashboard-memo',
  settings: 'teacher-dashboard-settings',
}

const DEFAULT_SETTINGS = {
  schoolStart: '08:30',
  schoolEnd: '16:30',
  weatherApiKey: '',
  weatherCity: 'Daejeon',
  neisApiKey: '',
  neisOfficeCode: '',
  neisSchoolCode: '',
  allergyNumbers: '',
  semesterUrl: '',
  timetableText: '1,08:50,09:35,국어\n2,09:45,10:30,수학\n3,10:40,11:25,영어\n4,11:35,12:20,사회\n5,13:20,14:05,과학\n6,14:15,15:00,체육\n7,15:10,15:55,창체',
}

const DDAY_COLORS = [
  'from-slate-900 to-slate-700 text-white',
  'from-blue-900 to-indigo-700 text-white',
  'from-purple-900 to-fuchsia-700 text-white',
  'from-emerald-900 to-teal-700 text-white',
]

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    if (!saved) return initialValue
    try { return JSON.parse(saved) } catch { return initialValue }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)) }, [key, value])
  return [value, setValue]
}

function parseMinutes(time) {
  const [h, m] = String(time).split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

function useTheme(schoolStart, schoolEnd) {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    const update = () => {
      const s = parseMinutes(schoolStart)
      const e = parseMinutes(schoolEnd)
      const now = new Date()
      const nm = now.getHours() * 60 + now.getMinutes()
      const next = s !== null && e !== null && nm >= s && nm <= e ? 'light' : 'dark'
      setTheme(next)
      document.documentElement.dataset.theme = next
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [schoolStart, schoolEnd])
  return theme
}

function getDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getDateLabel(d) {
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${WEEKDAYS[d.getDay()]})`
}

function getDdayText(target) {
  const t = new Date(); t.setHours(0,0,0,0)
  const g = new Date(target); g.setHours(0,0,0,0)
  const diff = Math.ceil((g - t) / 86400000)
  if (diff === 0) return 'D-DAY'
  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`
}

function getWeatherEmoji(main) {
  const m = { Thunderstorm:'⛈️', Drizzle:'🌦️', Rain:'🌧️', Snow:'❄️', Mist:'🌫️', Smoke:'🌫️', Haze:'🌫️', Dust:'🌫️', Fog:'🌫️', Sand:'🌫️', Ash:'🌫️', Squall:'💨', Tornado:'🌪️', Clear:'☀️', Clouds:'☁️' }
  return m[main] ?? '🌤️'
}

function App() {
  const [headerNote, setHeaderNote] = useLocalStorage(STORAGE_KEYS.headerNote, '오늘도 좋은 수업을 만들어요')
  const [timelineNotes, setTimelineNotes] = useLocalStorage(STORAGE_KEYS.timelineNotes, {})
  const [ddays, setDdays] = useLocalStorage(STORAGE_KEYS.ddays, [])
  const [todos, setTodos] = useLocalStorage(STORAGE_KEYS.todos, [])
  const [memo, setMemo] = useLocalStorage(STORAGE_KEYS.memo, '')
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)

  const [isTitleEditing, setIsTitleEditing] = useState(false)
  const [todoInput, setTodoInput] = useState('')
  const [newDdayName, setNewDdayName] = useState('')
  const [newDdayDate, setNewDdayDate] = useState('')
  const [showDdayForm, setShowDdayForm] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsDraft, setSettingsDraft] = useState(settings)
  const [timelineModal, setTimelineModal] = useState(null)
  const [timelineText, setTimelineText] = useState('')
  const [draggingTodoId, setDraggingTodoId] = useState(null)
  const [dropzoneActive, setDropzoneActive] = useState('')
  const [weather, setWeather] = useState(null)
  const [weatherMsg, setWeatherMsg] = useState('')
  const [meals, setMeals] = useState([])
  const [mealMsg, setMealMsg] = useState('')
  const [timeTick, setTimeTick] = useState(Date.now())

  const timelineRef = useRef(null)
  const today = new Date()
  const todayKey = getDateKey(today)
  const theme = useTheme(settings.schoolStart, settings.schoolEnd)

  useEffect(() => {
    const isCorrupted = (str) => typeof str === 'string' && /[\ufffd\u25c6]/.test(str)

    const storedNote = localStorage.getItem(STORAGE_KEYS.headerNote)
    if (storedNote) {
      try {
        const parsed = JSON.parse(storedNote)
        if (isCorrupted(parsed)) {
          localStorage.removeItem(STORAGE_KEYS.headerNote)
          setHeaderNote('\uC624\uB298\uB3C4 \uC88B\uC740 \uC218\uC5C5\uC744 \uB9CC\uB4E4\uC5B4\uC694')
        }
      } catch { /* ignore */ }
    }

    const storedDdays = localStorage.getItem(STORAGE_KEYS.ddays)
    if (storedDdays) {
      try {
        const parsed = JSON.parse(storedDdays)
        if (Array.isArray(parsed)) {
          const hasBad = parsed.some(d => isCorrupted(d.name))
          if (hasBad) {
            localStorage.removeItem(STORAGE_KEYS.ddays)
            setDdays([])
          }
        }
      } catch { /* ignore */ }
    }

    const storedSettings = localStorage.getItem(STORAGE_KEYS.settings)
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings)
        if (parsed.timetableText && isCorrupted(parsed.timetableText)) {
          const fixed = {
            ...parsed,
            timetableText: '1,08:50,09:35,\uAD6D\uC5B4\n2,09:45,10:30,\uC218\uD559\n3,10:40,11:25,\uC601\uC5B4\n4,11:35,12:20,\uC0AC\uD68C\n5,13:20,14:05,\uACFC\uD559\n6,14:15,15:00,\uCCB4\uC721\n7,15:10,15:55,\uCC3D\uCCB4',
          }
          localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(fixed))
          setSettings(fixed)
        }
      } catch { /* ignore */ }
    }
  }, [setHeaderNote, setSettings, setDdays])

  const timelineDays = useMemo(() => {
    const days = []
    for (let i = -7; i <= 21; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      days.push({ key: getDateKey(d), month: d.getMonth() + 1, day: d.getDate(), dow: WEEKDAYS[d.getDay()], dowIdx: d.getDay() })
    }
    return days
  }, [])

  const parsedTimetable = useMemo(() => {
    return settings.timetableText.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const [period, start, end, subject] = l.split(',').map(s => s.trim())
      return { period, start, end, subject }
    }).slice(0, 7)
  }, [settings.timetableText])

  const currentPeriod = useMemo(() => {
    const now = new Date(timeTick)
    const nm = now.getHours() * 60 + now.getMinutes()
    return parsedTimetable.find(t => {
      const s = parseMinutes(t.start), e = parseMinutes(t.end)
      return s !== null && e !== null && nm >= s && nm <= e
    })?.period
  }, [parsedTimetable, timeTick])

  const completedCount = todos.filter(t => t.done).length

  useEffect(() => {
    if (!timelineRef.current) return
    const el = timelineRef.current.querySelector('[data-today="true"]')
    if (el) el.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTimeTick(Date.now()), 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    async function fetchWeather() {
      if (!settings.weatherApiKey) { setWeather(null); setWeatherMsg('설정에서 OpenWeatherMap API 키를 입력하세요.'); return }
      try {
        const q = new URLSearchParams({ q: settings.weatherCity || 'Daejeon', appid: settings.weatherApiKey, units: 'metric', lang: 'kr' })
        const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?${q}`)
        if (!r.ok) throw new Error()
        const d = await r.json()
        setWeather({ temp: Math.round(d.main.temp), min: Math.round(d.main.temp_min), max: Math.round(d.main.temp_max), description: d.weather?.[0]?.description ?? '-', emoji: getWeatherEmoji(d.weather?.[0]?.main) })
        setWeatherMsg('')
      } catch { setWeather(null); setWeatherMsg('날씨 정보를 불러올 수 없습니다.') }
    }
    fetchWeather()
    const id = setInterval(fetchWeather, 600000)
    return () => clearInterval(id)
  }, [settings.weatherApiKey, settings.weatherCity])

  useEffect(() => {
    async function fetchMeals() {
      if (!settings.neisApiKey || !settings.neisOfficeCode || !settings.neisSchoolCode) { setMeals([]); setMealMsg('설정에서 NEIS API 정보를 입력하세요.'); return }
      const n = new Date()
      const ymd = `${n.getFullYear()}${String(n.getMonth()+1).padStart(2,'0')}${String(n.getDate()).padStart(2,'0')}`
      const q = new URLSearchParams({ KEY: settings.neisApiKey, Type: 'json', pIndex: '1', pSize: '10', ATPT_OFCDC_SC_CODE: settings.neisOfficeCode, SD_SCHUL_CODE: settings.neisSchoolCode, MLSV_YMD: ymd })
      try {
        const r = await fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?${q}`)
        if (!r.ok) throw new Error()
        const d = await r.json()
        const dish = d?.mealServiceDietInfo?.[1]?.row?.[0]?.DDISH_NM
        if (!dish) { setMeals([]); setMealMsg('오늘 급식 정보가 없습니다.'); return }
        const tokens = settings.allergyNumbers.split(',').map(s=>s.trim()).filter(Boolean)
        setMeals(dish.split('<br/>').map(menu => {
          const matched = menu.match(/\(([^)]+)\)/)?.[1] ?? ''
          const al = matched.split('.').map(s=>s.trim()).filter(Boolean)
          return { text: menu.replace(/\(\d+(\.\d+)*\)/g,'').trim(), warning: tokens.some(t => al.includes(t)) }
        }))
        setMealMsg('')
      } catch { setMeals([]); setMealMsg('급식 정보를 불러올 수 없습니다.') }
    }
    fetchMeals()
  }, [settings.neisApiKey, settings.neisOfficeCode, settings.neisSchoolCode, settings.allergyNumbers])

  const addTodo = () => {
    const t = todoInput.trim()
    if (!t) return
    setTodos(p => [...p, { id: crypto.randomUUID(), text: t, done: false }])
    setTodoInput('')
  }

  const moveTodo = (targetId) => {
    if (!draggingTodoId || draggingTodoId === targetId) return
    const list = [...todos]
    const f = list.findIndex(i => i.id === draggingTodoId)
    const t = list.findIndex(i => i.id === targetId)
    if (f === -1 || t === -1) return
    const [moved] = list.splice(f, 1)
    list.splice(t, 0, moved)
    setTodos(list)
  }

  const addDday = () => {
    if (!newDdayName.trim() || !newDdayDate || ddays.length >= 4) return
    const name = newDdayName.trim()
    const ddayId = crypto.randomUUID()
    setDdays(p => [...p, { id: ddayId, name, date: newDdayDate, color: DDAY_COLORS[p.length % DDAY_COLORS.length] }])
    setTodos(p => [...p, { id: crypto.randomUUID(), text: `📌 ${name} (${newDdayDate})`, done: false, ddayId }])
    setNewDdayName(''); setNewDdayDate(''); setShowDdayForm(false)
  }

  const deleteDday = (id) => {
    const next = ddays.filter(i => i.id !== id)
    setDdays(next)
    setTodos(todos.filter(i => i.ddayId !== id))
  }

  const openTimelineModal = (key) => { setTimelineModal(key); setTimelineText(timelineNotes[key] ?? '') }

  const saveTimelineNote = () => {
    if (!timelineModal) return
    const t = timelineText.trim()
    setTimelineNotes(p => { const n = {...p}; t ? n[timelineModal] = t : delete n[timelineModal]; return n })
    setTimelineModal(null); setTimelineText('')
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-dashboard-bg p-4 text-dashboard-text">
      <div className="flex h-full w-full flex-col gap-3">

        <HeaderBar
          todayLabel={getDateLabel(today)}
          headerNote={headerNote} setHeaderNote={setHeaderNote}
          isTitleEditing={isTitleEditing} setIsTitleEditing={setIsTitleEditing}
          settings={settings} focusMode={focusMode} setFocusMode={setFocusMode}
          onOpenSettings={() => { setSettingsDraft(settings); setSettingsOpen(true) }}
        />

        <div className="flex shrink-0 gap-3">
          <TimelineSection
            timelineRef={timelineRef} timelineDays={timelineDays} todayKey={todayKey}
            timelineNotes={timelineNotes} onOpenNote={openTimelineModal}
          />
          <DdaySection
            ddays={ddays} getDdayText={getDdayText}
            showDdayForm={showDdayForm} setShowDdayForm={setShowDdayForm}
            newDdayName={newDdayName} setNewDdayName={setNewDdayName}
            newDdayDate={newDdayDate} setNewDdayDate={setNewDdayDate}
            onAddDday={addDday} onDeleteDday={deleteDday}
          />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1fr_2fr_1fr] gap-3">
          <LeftDropzonePanel focusMode={focusMode} dropzoneActive={dropzoneActive} setDropzoneActive={setDropzoneActive} />
          <TodoMemoPanel
            todos={todos} completedCount={completedCount}
            todoInput={todoInput} setTodoInput={setTodoInput}
            onAddTodo={addTodo} setDraggingTodoId={setDraggingTodoId}
            onMoveTodo={moveTodo}
            onToggleTodo={(id) => setTodos(p => p.map(i => i.id === id ? {...i, done: !i.done} : i))}
            onDeleteTodo={(id) => setTodos(p => p.filter(i => i.id !== id))}
            memo={memo} setMemo={setMemo}
          />
          <RightInfoPanel
            focusMode={focusMode} weather={weather} weatherMessage={weatherMsg}
            meals={meals} mealMessage={mealMsg}
            parsedTimetable={parsedTimetable} currentPeriod={currentPeriod}
          />
        </div>
      </div>

      <TimelineNoteModal timelineModal={timelineModal} timelineText={timelineText} setTimelineText={setTimelineText} onClose={() => setTimelineModal(null)} onSave={saveTimelineNote} />
      <SettingsModal settingsOpen={settingsOpen} settingsDraft={settingsDraft} setSettingsDraft={setSettingsDraft} onClose={() => setSettingsOpen(false)} onSave={() => { setSettings(settingsDraft); setSettingsOpen(false) }} theme={theme} />
    </div>
  )
}

export default App
