// ─────────────────────────────────────────────────────────
// Home.jsx  —  Replace src/screens/Home.jsx with this
// ─────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useAppData } from '../context/AppContext'

// ── Fallback hardcoded data (used when SharePoint not connected) ──
const SAMPLE_ROSTER_A = [
  { FullName: 'Abhishek Mane', ShiftDate: '2026-07-29', ShiftCode: 'TS' },
  { FullName: 'Nihal Jha',     ShiftDate: '2026-07-29', ShiftCode: 'SS' },
  { FullName: 'Ritik Mishra',  ShiftDate: '2026-07-29', ShiftCode: 'FS' },
  { FullName: 'Vivek Singh',   ShiftDate: '2026-07-29', ShiftCode: 'WO' },
  { FullName: 'Vikas TJ',      ShiftDate: '2026-07-29', ShiftCode: 'WO' },
]
const SAMPLE_ROSTER_B = [
  { FullName: 'Amey Dadgale',  ShiftDate: '2026-07-29', ShiftCode: 'FS' },
  { FullName: 'Rahul Ingale',  ShiftDate: '2026-07-29', ShiftCode: 'SS' },
  { FullName: 'Girish Bhagat', ShiftDate: '2026-07-29', ShiftCode: 'WO' },
]
const SAMPLE_LEAVE = [
  { FullName: 'Vivek Singh',  StartDate: '2026-07-28', EndDate: '2026-07-29', Backup: 'Abhishek Mane' },
  { FullName: 'Rahul Ingale', StartDate: '2026-07-30', EndDate: '2026-07-31', Backup: 'Amey Dadgale'  },
]

const SHIFTS = {
  FS: { name: 'First Shift',         ist: '07:00–15:00', cet: '03:30–11:30', aest: '11:30–19:30' },
  SS: { name: 'Second Shift',        ist: '15:00–23:00', cet: '11:30–19:30', aest: '19:30–03:30' },
  TS: { name: 'Third Shift · Night', ist: '23:00–07:00', cet: '19:30–03:30', aest: '03:30–11:30' },
}

function getActiveShiftCode(hour) {
  if (hour >= 7  && hour < 15) return 'FS'
  if (hour >= 15 && hour < 23) return 'SS'
  return 'TS'
}

function getNextShiftIn(hour, min) {
  const ends = { FS: 15, SS: 23, TS: 7 }
  const code  = getActiveShiftCode(hour)
  let diff    = (ends[code] - hour - 1) * 60 + (60 - min)
  if (diff < 0) diff += 24 * 60
  return `${Math.floor(diff / 60)}h ${String(diff % 60).padStart(2, '0')}m`
}

function todayStr() {
  const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  return ist.toISOString().split('T')[0]
}

// ── Leave Ticker ──
function LeaveTicker({ leaveRecords }) {
  const today    = todayStr()
  const upcoming = leaveRecords.filter(l => {
    const end = l.EndDate || l.endDate || ''
    return end >= today
  })
  if (!upcoming.length) return null

  const items = [...upcoming, ...upcoming]
  const text  = items.map(l => {
    const name   = l.FullName   || l.fullName   || ''
    const backup = l.Backup     || l.backup     || ''
    const start  = l.StartDate  || l.startDate  || ''
    const end    = l.EndDate    || l.endDate    || ''
    return `🌴  ${name} on leave ${start} – ${end}  —  Backup: ${backup}`
  }).join('     •     ')

  return (
    <div className="rounded-lg h-9 overflow-hidden flex items-center mb-4"
      style={{ background: '#FFB622' }}>
      <div className="whitespace-nowrap ticker-animate text-xs font-semibold"
        style={{ color: '#5c3d00', paddingLeft: '100%' }}>
        {text}
      </div>
    </div>
  )
}

// ── Person Card ──
function PersonCard({ person, shiftCode, team, leaveRecords }) {
  const today  = todayStr()
  const leave  = leaveRecords.find(l => {
    const name = l.FullName || l.fullName || ''
    const start = l.StartDate || l.startDate || ''
    const end   = l.EndDate   || l.endDate   || ''
    return name === person && start <= today && end >= today
  })
  const isNight = shiftCode === 'TS'
  const borderColor = leave ? '#F25022' : isNight ? '#004672' : '#006DB7'
  const bgColor     = leave ? '#FCEBEB' : isNight ? '#EEF4F9' : '#F6FBFF'

  return (
    <div className="rounded-lg p-3 mb-2"
      style={{ background: bgColor, borderLeft: `3px solid ${borderColor}` }}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold" style={{ color: '#004672' }}>{person}</div>
        <div className="flex gap-1 flex-wrap justify-end flex-shrink-0">
          {team === 'A' && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#D8E9F5', color: '#004672' }}>ABC</span>}
          {team === 'A' && isNight && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#E0F4FC', color: '#0a6a9e' }}>NL</span>}
          {team === 'B' && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#EAF3DE', color: '#3B6D11' }}>NL</span>}
          {leave && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#FCEBEB', color: '#A32D2D' }}>🌴 Leave</span>}
        </div>
      </div>
      {leave ? (
        <div className="mt-2 text-[10px] rounded px-2 py-1" style={{ background: '#F8D7D7', color: '#A32D2D' }}>
          Backup: {leave.Backup || leave.backup || '—'}
        </div>
      ) : (
        <div className="mt-1.5 text-[10px] text-gray-400">IST {SHIFTS[shiftCode]?.ist}</div>
      )}
    </div>
  )
}

// ── Shift Column ──
function ShiftColumn({ code, rosterA, rosterB, activeCode, leaveRecords }) {
  const info      = SHIFTS[code]
  const isCurrent = code === activeCode
  const today     = todayStr()

  const aPersons = rosterA
    .filter(r => (r.ShiftDate || r.shiftDate || '').startsWith(today) && (r.ShiftCode || r.shiftCode) === code)
    .map(r => r.FullName || r.fullName)

  const bPersons = code !== 'TS'
    ? rosterB
        .filter(r => (r.ShiftDate || r.shiftDate || '').startsWith(today) && (r.ShiftCode || r.shiftCode) === code)
        .map(r => r.FullName || r.fullName)
    : []

  return (
    <div className="rounded-xl shadow-sm overflow-hidden"
      style={{ background: 'white', border: `2px solid ${isCurrent ? '#FFB622' : 'transparent'}` }}>

      {/* Header */}
      <div className="p-3 relative" style={{ background: isCurrent ? '#006DB7' : '#004672' }}>
        {isCurrent && (
          <span className="absolute top-2.5 right-3 text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
            style={{ background: '#FFB622', color: '#5c3d00' }}>▶ Now</span>
        )}
        <div className="text-white text-sm font-bold pr-12">{info.name}</div>
        <div className="text-[10px] mt-1" style={{ color: '#90BADC' }}>IST {info.ist}</div>
        <div className="flex gap-4 mt-1.5">
          <span className="text-[10px]" style={{ color: '#90BADC' }}>CET <span className="text-white font-semibold">{info.cet}</span></span>
          <span className="text-[10px]" style={{ color: '#90BADC' }}>AEST <span className="text-white font-semibold">{info.aest}</span></span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#bbb' }}>
          Team A — Project ABC{code === 'TS' ? ' + NL' : ''}
        </div>
        {aPersons.length > 0
          ? aPersons.map(p => <PersonCard key={p} person={p} shiftCode={code} team="A" leaveRecords={leaveRecords} />)
          : <div className="text-[10px] text-gray-300 text-center py-2">No one scheduled</div>
        }
        <div className="text-[9px] font-bold uppercase tracking-widest mt-3 mb-2" style={{ color: '#bbb' }}>
          Team B — NL Project
        </div>
        {code === 'TS'
          ? <div className="text-[10px] text-center py-2 rounded-lg" style={{ background: '#EEF4F9', color: '#999' }}>🌙 Not on night shift</div>
          : bPersons.length > 0
            ? bPersons.map(p => <PersonCard key={p} person={p} shiftCode={code} team="B" leaveRecords={leaveRecords} />)
            : <div className="text-[10px] text-gray-300 text-center py-2">No one scheduled</div>
        }
      </div>
    </div>
  )
}

// ── Home Screen ──
export default function Home() {
  const { rosterA, rosterB, leave, usingLive } = useAppData()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const ist        = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const hour       = ist.getHours()
  const min        = ist.getMinutes()
  const activeCode = getActiveShiftCode(hour)
  const nextIn     = getNextShiftIn(hour, min)

  // Use live SharePoint data
  const liveRosterA = rosterA.length ? rosterA : SAMPLE_ROSTER_A
  const liveRosterB = rosterB.length ? rosterB : SAMPLE_ROSTER_B
  const liveLeave   = leave.length   ? leave   : SAMPLE_LEAVE

  const today      = todayStr()
  const onLeave    = liveLeave.filter(l => {
    const start = l.StartDate || l.startDate || ''
    const end   = l.EndDate   || l.endDate   || ''
    return start <= today && end >= today
  }).length

  const shiftNames = { FS: 'First', SS: 'Second', TS: 'Night' }

  return (
    <div>


      <LeaveTicker leaveRecords={liveLeave} />

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: '⏰', label: 'Active shift right now',  value: shiftNames[activeCode], bg: '#E3F0FC' },
          { icon: '🌴', label: 'On leave today',           value: onLeave,               bg: '#FCEBEB' },
          { icon: '⏱',  label: 'Until next shift change',  value: nextIn,                bg: '#EAF3DE' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="text-xl font-bold" style={{ color: '#004672' }}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#aaa' }}>
        All shifts — {ist.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['FS', 'SS', 'TS'].map(code => (
          <ShiftColumn
            key={code}
            code={code}
            rosterA={liveRosterA}
            rosterB={liveRosterB}
            activeCode={activeCode}
            leaveRecords={liveLeave}
          />
        ))}
      </div>
    </div>
  )
}
