import { useState } from 'react'

// ── Data (will connect to SharePoint later) ──
const TEAM_A = [
  { name: 'Abhishek Mane' },
  { name: 'Nihal Jha' },
  { name: 'Ritik Mishra' },
  { name: 'Vivek Singh' },
  { name: 'Vikas TJ' },
]
const TEAM_B = [
  { name: 'Rahul Raj',     notice: true },
  { name: 'Girish Bhagat', notice: true },
  { name: 'Rahul Ingale' },
  { name: 'Amey Dadgale' },
]

const A_CYCLE = ['FS', 'SS', 'TS', 'WO', 'WO']
const B_CYCLE = ['FS', 'SS', 'WO', 'WO']

const SHIFT_LABELS = {
  FS: { label: 'First shift',  short: 'FS', bg: '#EAF3DE', color: '#3B6D11' },
  SS: { label: 'Second shift', short: 'SS', bg: '#DFF0FF', color: '#0062a8' },
  TS: { label: 'Third shift',  short: 'TS', bg: '#D8E9F5', color: '#004672' },
  WO: { label: 'Week off',     short: 'WO', bg: '#EEEEEE', color: '#777777' },
}

const LEAVE_DATA = [
  { name: 'Vivek Singh',  start: '2026-07-28', end: '2026-07-29', backup: 'Abhishek Mane' },
  { name: 'Rahul Ingale', start: '2026-07-30', end: '2026-07-31', backup: 'Amey Dadgale'  },
]

// Days in each month for 2026
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const MONTH_NAMES   = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

function getShift(cycle, personIndex, day) {
  return cycle[(day - 1 + personIndex) % cycle.length]
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay() // 0=Sun
}

function isOnLeave(name, year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return LEAVE_DATA.find(l => l.name === name && l.start <= dateStr && l.end >= dateStr)
}

function hasLeaveOnDay(team, year, month, day) {
  return team.some(p => isOnLeave(p.name, year, month, day))
}

// ── Shift Badge ──
function ShiftBadge({ code }) {
  const s = SHIFT_LABELS[code]
  return (
    <span
      className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-1"
      style={{ background: s.bg, color: s.color }}
    >
      {s.short}
    </span>
  )
}

// ── Day Detail Panel ──
function DayDetail({ day, month, year, team, cycle, onClose }) {
  if (!day) return null
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const dateLabel = new Date(year, month, day).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div
      className="mt-4 rounded-xl p-4"
      style={{ background: '#F0F8FF', border: '1px solid #CCE4F5' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold" style={{ color: '#004672' }}>{dateLabel}</div>
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          ✕ Close
        </button>
      </div>
      <div className="space-y-2">
        {team.map((person, i) => {
          const shift = getShift(cycle, i, day)
          const leave = isOnLeave(person.name, year, month, day)
          const s     = SHIFT_LABELS[shift]
          return (
            <div
              key={person.name}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-white"
              style={{ borderBottom: '1px solid #E0EEF7' }}
            >
              <div>
                <span className="text-sm font-semibold" style={{ color: '#004672' }}>
                  {person.name}
                </span>
                {person.notice && (
                  <span className="ml-2 text-[9px] text-gray-400 italic">notice period</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {leave ? (
                  <>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#FCEBEB', color: '#A32D2D' }}
                    >
                      🌴 On leave
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Backup: {leave.backup}
                    </span>
                  </>
                ) : (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.label}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Calendar Grid ──
function CalendarGrid({ year, month, team, cycle, onDayClick, selectedDay }) {
  const daysInMonth  = DAYS_IN_MONTH[month]
  const firstDayOffs = getFirstDayOfMonth(year, month)
  const today        = new Date()
  const isToday      = (d) =>
    today.getFullYear() === year &&
    today.getMonth()    === month &&
    today.getDate()     === d

  const cells = []

  // Empty cells before first day
  for (let i = 0; i < firstDayOffs; i++) {
    cells.push(<div key={`empty-${i}`} />)
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const hasLeave  = hasLeaveOnDay(team, year, month, d)
    const isSelected = selectedDay === d
    const isTodayDay = isToday(d)

    cells.push(
      <div
        key={d}
        onClick={() => onDayClick(d)}
        className="rounded-lg p-1.5 cursor-pointer relative"
        style={{
          background: isSelected ? '#E3F0FC' : 'white',
          border: isTodayDay
            ? '2px solid #006DB7'
            : isSelected
            ? '1.5px solid #006DB7'
            : '1.5px solid #E8EEF4',
          minHeight: '52px',
        }}
        onMouseEnter={e => {
          if (!isSelected && !isTodayDay) {
            e.currentTarget.style.borderColor = '#006DB7'
          }
        }}
        onMouseLeave={e => {
          if (!isSelected && !isTodayDay) {
            e.currentTarget.style.borderColor = '#E8EEF4'
          }
        }}
      >
        {/* Day number */}
        <div
          className="text-xs font-bold"
          style={{ color: isTodayDay ? '#006DB7' : '#555' }}
        >
          {d}
        </div>

        {/* Shift codes */}
        <div className="flex flex-wrap gap-0.5 mt-0.5">
          {team.slice(0, 3).map((person, i) => {
            const shift = getShift(cycle, i, d)
            if (shift === 'WO') return null
            return <ShiftBadge key={person.name} code={shift} />
          })}
        </div>

        {/* Leave dot */}
        {hasLeave && (
          <div
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: '#F25022' }}
            title="Someone on leave"
          />
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div
            key={d}
            className="text-center text-[10px] font-bold text-white py-1.5 rounded"
            style={{ background: '#72B62A' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    </div>
  )
}

// ── Roster Screen ──
export default function Roster() {
  const today    = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [activeTeam, setActiveTeam] = useState('A')
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const team  = activeTeam === 'A' ? TEAM_A : TEAM_B
  const cycle = activeTeam === 'A' ? A_CYCLE : B_CYCLE

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  return (
    <div>
      {/* Team tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'A', label: 'Team A — 24x7 (Project ABC)' },
          { key: 'B', label: 'Team B — NL (Day shifts)' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setActiveTeam(t.key); setSelectedDay(null) }}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={activeTeam === t.key
              ? { background: '#006DB7', color: 'white', border: '1.5px solid #006DB7' }
              : { background: 'white', color: '#888', border: '1.5px solid #D0D7DE' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-bold" style={{ color: '#004672' }}>
            {MONTH_NAMES[month]} {year}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="px-3 py-1 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
              style={{ border: '1px solid #D0D7DE' }}
            >
              ‹
            </button>
            <button
              onClick={nextMonth}
              className="px-3 py-1 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
              style={{ border: '1px solid #D0D7DE' }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {Object.entries(SHIFT_LABELS).map(([code, s]) => (
            <div key={code} className="flex items-center gap-1">
              <span
                className="w-4 h-4 rounded text-[8px] font-bold flex items-center justify-center"
                style={{ background: s.bg, color: s.color }}
              >
                {s.short}
              </span>
              <span className="text-[10px] text-gray-400">{s.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: '#F25022' }} />
            <span className="text-[10px] text-gray-400">Leave</span>
          </div>
        </div>

        {/* Calendar */}
        <CalendarGrid
          year={year}
          month={month}
          team={team}
          cycle={cycle}
          onDayClick={setSelectedDay}
          selectedDay={selectedDay}
        />

        {/* Day detail panel */}
        {selectedDay && (
          <DayDetail
            day={selectedDay}
            month={month}
            year={year}
            team={team}
            cycle={cycle}
            onClose={() => setSelectedDay(null)}
          />
        )}

      </div>
    </div>
  )
}
