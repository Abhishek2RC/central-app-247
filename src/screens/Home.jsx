import { useState, useEffect } from 'react'

// ── Team data (will connect to SharePoint later) ──
const TEAM_A = [
  { name: 'Abhishek Mane', email: 'abhishek.mane@rapidcircle.com' },
  { name: 'Nihal Jha',     email: 'nihal.jha@rapidcircle.com' },
  { name: 'Ritik Mishra',  email: 'ritik.mishra@rapidcircle.com' },
  { name: 'Vivek Singh',   email: 'vivek.singh@rapidcircle.com' },
  { name: 'Vikas TJ',      email: 'vikas.tj@rapidcircle.com' },
]
const TEAM_B = [
  { name: 'Rahul Raj',     email: 'rahul.raj@rapidcircle.com',     notice: true },
  { name: 'Girish Bhagat', email: 'girish.bhagat@rapidcircle.com', notice: true },
  { name: 'Rahul Ingale',  email: 'rahul.ingale@rapidcircle.com' },
  { name: 'Amey Dadgale',  email: 'amey.dadgale@rapidcircle.com' },
]

const A_CYCLE = ['FS', 'SS', 'TS', 'WO', 'WO']
const B_CYCLE = ['FS', 'SS', 'WO', 'WO']

const SHIFTS = {
  FS: { name: 'First Shift',         ist: '07:00 – 15:00', cet: '03:30 – 11:30', aest: '11:30 – 19:30' },
  SS: { name: 'Second Shift',        ist: '15:00 – 23:00', cet: '11:30 – 19:30', aest: '19:30 – 03:30' },
  TS: { name: 'Third Shift · Night', ist: '23:00 – 07:00', cet: '19:30 – 03:30', aest: '03:30 – 11:30' },
}

// Sample leave data (will come from SharePoint later)
const LEAVE_DATA = [
  { name: 'Vivek Singh',  start: '2026-07-28', end: '2026-07-29', backup: 'Abhishek Mane' },
  { name: 'Rahul Ingale', start: '2026-07-30', end: '2026-07-31', backup: 'Amey Dadgale'  },
]

function getShift(cycle, index, day) {
  return cycle[(day - 1 + index) % cycle.length]
}

function isOnLeave(name) {
  const today = new Date().toISOString().split('T')[0]
  return LEAVE_DATA.find(l => l.name === name && l.start <= today && l.end >= today)
}

function getActiveShiftCode(hour) {
  if (hour >= 7  && hour < 15) return 'FS'
  if (hour >= 15 && hour < 23) return 'SS'
  return 'TS'
}

function getNextShiftIn(hour, min) {
  const ends  = { FS: 15, SS: 23, TS: 7 }
  const code  = getActiveShiftCode(hour)
  const endH  = ends[code]
  let diff    = (endH - hour - 1) * 60 + (60 - min)
  if (diff < 0) diff += 24 * 60
  return `${Math.floor(diff / 60)}h ${String(diff % 60).padStart(2, '0')}m`
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ── Leave Ticker ──
function LeaveTicker() {
  const today    = new Date().toISOString().split('T')[0]
  const upcoming = LEAVE_DATA.filter(l => l.end >= today)
  if (upcoming.length === 0) return null

  const items = [...upcoming, ...upcoming]
  const text  = items
    .map(l => `🌴  ${l.name} on leave ${formatDateShort(l.start)}–${formatDateShort(l.end)}  —  Backup: ${l.backup}`)
    .join('     •     ')

  return (
    <div
      className="rounded-lg h-9 overflow-hidden flex items-center mb-4"
      style={{ background: '#FFB622' }}
    >
      <div
        className="whitespace-nowrap ticker-animate text-xs font-semibold"
        style={{ color: '#5c3d00', paddingLeft: '100%' }}
      >
        {text}
      </div>
    </div>
  )
}

// ── Stat Cards ──
function StatCards({ activeShift, nextIn, onLeaveCount }) {
  const stats = [
    { icon: '⏰', label: 'Active shift right now',  value: activeShift,  bg: '#E3F0FC' },
    { icon: '🌴', label: 'On leave today',           value: onLeaveCount, bg: '#FCEBEB' },
    { icon: '⏱',  label: 'Until next shift change',  value: nextIn,       bg: '#EAF3DE' },
  ]
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: s.bg }}
          >
            {s.icon}
          </div>
          <div>
            <div className="text-xl font-bold" style={{ color: '#004672' }}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Person Card ──
function PersonCard({ person, shiftCode, team }) {
  const leave   = isOnLeave(person.name)
  const isNight = shiftCode === 'TS'

  const borderColor = leave ? '#F25022' : isNight ? '#004672' : '#006DB7'
  const bgColor     = leave ? '#FCEBEB' : isNight ? '#EEF4F9' : '#F6FBFF'

  return (
    <div
      className="rounded-lg p-3 mb-2"
      style={{ background: bgColor, borderLeft: `3px solid ${borderColor}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold" style={{ color: '#004672' }}>
            {person.name}
          </div>
          {person.notice && (
            <div className="text-[9px] text-gray-400 italic mt-0.5">On notice period</div>
          )}
        </div>
        <div className="flex gap-1 flex-wrap justify-end flex-shrink-0">
          {team === 'A' && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#D8E9F5', color: '#004672' }}
            >ABC</span>
          )}
          {team === 'A' && isNight && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#E0F4FC', color: '#0a6a9e' }}
            >NL</span>
          )}
          {team === 'B' && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#EAF3DE', color: '#3B6D11' }}
            >NL</span>
          )}
          {leave && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#FCEBEB', color: '#A32D2D' }}
            >🌴 Leave</span>
          )}
        </div>
      </div>

      {leave ? (
        <div
          className="mt-2 text-[10px] rounded px-2 py-1"
          style={{ background: '#F8D7D7', color: '#A32D2D' }}
        >
          Backup: {leave.backup}
        </div>
      ) : (
        <div className="mt-1.5 text-[10px] text-gray-400 leading-relaxed">
          IST {SHIFTS[shiftCode]?.ist}
        </div>
      )}
    </div>
  )
}

// ── Shift Column ──
function ShiftColumn({ code, day, activeCode }) {
  const info      = SHIFTS[code]
  const isCurrent = code === activeCode

  const aPersons = TEAM_A.filter((_, i) => getShift(A_CYCLE, i, day) === code)
  const bPersons = code !== 'TS'
    ? TEAM_B.filter((_, i) => getShift(B_CYCLE, i, day) === code)
    : []

  return (
    <div
      className="rounded-xl shadow-sm overflow-hidden"
      style={{
        background: 'white',
        border: `2px solid ${isCurrent ? '#FFB622' : 'transparent'}`,
      }}
    >
      {/* Column header */}
      <div
        className="p-3 relative"
        style={{ background: isCurrent ? '#006DB7' : '#004672' }}
      >
        {isCurrent && (
          <span
            className="absolute top-2.5 right-3 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ background: '#FFB622', color: '#5c3d00' }}
          >
            ▶ Now
          </span>
        )}
        <div className="text-white text-sm font-bold pr-12">{info.name}</div>
        <div className="text-[10px] mt-1" style={{ color: '#90BADC' }}>
          IST {info.ist}
        </div>
        <div className="flex gap-4 mt-1.5">
          <span className="text-[10px]" style={{ color: '#90BADC' }}>
            CET <span className="text-white font-semibold">{info.cet}</span>
          </span>
          <span className="text-[10px]" style={{ color: '#90BADC' }}>
            AEST <span className="text-white font-semibold">{info.aest}</span>
          </span>
        </div>
      </div>

      {/* Column body */}
      <div className="p-3">

        {/* Team A section */}
        <div
          className="text-[9px] font-bold uppercase tracking-widest mb-2"
          style={{ color: '#bbb' }}
        >
          Team A — Project ABC{code === 'TS' ? ' + NL' : ''}
        </div>
        {aPersons.length > 0
          ? aPersons.map(p => (
              <PersonCard key={p.name} person={p} shiftCode={code} team="A" />
            ))
          : (
            <div className="text-[10px] text-gray-300 text-center py-2">
              No one scheduled
            </div>
          )
        }

        {/* Team B section */}
        <div
          className="text-[9px] font-bold uppercase tracking-widest mt-3 mb-2"
          style={{ color: '#bbb' }}
        >
          Team B — NL Project
        </div>
        {code === 'TS' ? (
          <div
            className="text-[10px] text-center py-2 rounded-lg"
            style={{ background: '#EEF4F9', color: '#999' }}
          >
            🌙 Not on night shift
          </div>
        ) : bPersons.length > 0 ? (
          bPersons.map(p => (
            <PersonCard key={p.name} person={p} shiftCode={code} team="B" />
          ))
        ) : (
          <div className="text-[10px] text-gray-300 text-center py-2">
            No one scheduled
          </div>
        )}
      </div>
    </div>
  )
}

// ── Home Screen (main export) ──
export default function Home() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const ist        = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const hour       = ist.getHours()
  const min        = ist.getMinutes()
  const day        = ist.getDate()
  const activeCode = getActiveShiftCode(hour)
  const nextIn     = getNextShiftIn(hour, min)
  const today      = now.toISOString().split('T')[0]
  const onLeave    = LEAVE_DATA.filter(l => l.start <= today && l.end >= today).length

  const shiftNames = { FS: 'First', SS: 'Second', TS: 'Night' }

  return (
    <div>
      <LeaveTicker />
      <StatCards
        activeShift={shiftNames[activeCode]}
        nextIn={nextIn}
        onLeaveCount={onLeave}
      />
      <div
        className="text-[10px] font-bold uppercase tracking-widest mb-3"
        style={{ color: '#aaa' }}
      >
        All shifts — {ist.toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        })}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['FS', 'SS', 'TS'].map(code => (
          <ShiftColumn key={code} code={code} day={day} activeCode={activeCode} />
        ))}
      </div>
    </div>
  )
}
