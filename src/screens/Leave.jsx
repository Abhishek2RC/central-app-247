import { useState } from 'react'

const TEAM_MEMBERS = [
  { name: 'Abhishek Mane', team: 'A' },
  { name: 'Nihal Jha',     team: 'A' },
  { name: 'Ritik Mishra',  team: 'A' },
  { name: 'Vivek Singh',   team: 'A' },
  { name: 'Vikas TJ',      team: 'A' },
  { name: 'Rahul Raj',     team: 'B', notice: true },
  { name: 'Girish Bhagat', team: 'B', notice: true },
  { name: 'Rahul Ingale',  team: 'B' },
  { name: 'Amey Dadgale',  team: 'B' },
]

const LEAVE_RECORDS = [
  { name: 'Vivek Singh',  team: 'A', start: '2026-07-28', end: '2026-07-29', backup: 'Abhishek Mane', status: 'active'   },
  { name: 'Rahul Ingale', team: 'B', start: '2026-07-30', end: '2026-07-31', backup: 'Amey Dadgale',  status: 'upcoming' },
  { name: 'Girish Bhagat',team: 'B', start: '2026-06-20', end: '2026-06-21', backup: 'Rahul Raj',     status: 'past'     },
  { name: 'Nihal Jha',    team: 'A', start: '2026-06-14', end: '2026-06-14', backup: 'Vikas TJ',      status: 'past'     },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function TeamBadge({ team }) {
  return (
    <span
      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
      style={team === 'A'
        ? { background: '#D8E9F5', color: '#004672' }
        : { background: '#DFF0FF', color: '#0062a8' }
      }
    >
      Team {team}
    </span>
  )
}

function StatusBadge({ status }) {
  const styles = {
    active:   { bg: '#FCEBEB', color: '#A32D2D', label: '● Active today' },
    upcoming: { bg: '#DFF0FF', color: '#0062a8', label: 'Upcoming' },
    past:     { bg: '#EEEEEE', color: '#666',    label: 'Completed' },
  }
  const s = styles[status]
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

export default function Leave() {
  const [person,    setPerson]    = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate,   setEndDate]   = useState('')
  const [backup,    setBackup]    = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!person || !startDate || !endDate || !backup) {
      alert('Please fill in all required fields.')
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setPerson('')
      setStartDate('')
      setEndDate('')
      setBackup('')
    }, 3000)
  }

  const activeLeave   = LEAVE_RECORDS.filter(l => l.status === 'active')
  const upcomingLeave = LEAVE_RECORDS.filter(l => l.status === 'upcoming')
  const pastLeave     = LEAVE_RECORDS.filter(l => l.status === 'past')

  return (
    <div>
      {/* Info banner */}
      <div
        className="flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 mb-4 flex-wrap"
        style={{ background: '#FFF9EC', border: '1px solid #FFD166' }}
      >
        <div className="text-xs font-medium" style={{ color: '#7a5800' }}>
          ℹ️ <strong>Main leave is managed in Keka.</strong> Log here only to update 24x7 shift coverage and assign a backup person.
        </div>
        <button
          className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
          style={{ background: 'white', color: '#006DB7', border: '1.5px solid #006DB7' }}
          onClick={() => alert('In the live app this opens the Leave Power App.')}
        >
          ↗ Open Leave App
        </button>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>

        {/* ── Left: Log Coverage Form ── */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-base font-bold mb-4" style={{ color: '#004672' }}>
            Log 24x7 Leave Coverage
          </div>

          {submitted ? (
            <div
              className="text-center py-8 rounded-xl"
              style={{ background: '#EAF3DE' }}
            >
              <div className="text-3xl mb-2">✅</div>
              <div className="font-bold" style={{ color: '#3B6D11' }}>Leave coverage logged!</div>
              <div className="text-xs text-gray-500 mt-1">
                Home screen and roster will update automatically.
              </div>
            </div>
          ) : (
            <>
              {/* Person on leave */}
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#004672' }}>
                  Person on leave <span style={{ color: '#F25022' }}>*</span>
                </label>
                <select
                  value={person}
                  onChange={e => setPerson(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                  style={{ border: '1.5px solid #D0D7DE' }}
                >
                  <option value="">— Select person —</option>
                  <optgroup label="Team A">
                    {TEAM_MEMBERS.filter(m => m.team === 'A').map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Team B">
                    {TEAM_MEMBERS.filter(m => m.team === 'B').map(m => (
                      <option key={m.name} value={m.name}>
                        {m.name}{m.notice ? ' (notice period)' : ''}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#004672' }}>
                    Start date <span style={{ color: '#F25022' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                    style={{ border: '1.5px solid #D0D7DE' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#004672' }}>
                    End date <span style={{ color: '#F25022' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                    style={{ border: '1.5px solid #D0D7DE' }}
                  />
                </div>
              </div>

              {/* Backup */}
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#004672' }}>
                  Backup person <span style={{ color: '#F25022' }}>*</span>
                </label>
                <select
                  value={backup}
                  onChange={e => setBackup(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                  style={{ border: '1.5px solid #D0D7DE' }}
                >
                  <option value="">— Select backup —</option>
                  <optgroup label="Team A">
                    {TEAM_MEMBERS.filter(m => m.team === 'A' && m.name !== person).map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Team B">
                    {TEAM_MEMBERS.filter(m => m.team === 'B' && m.name !== person).map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Note */}
              <div
                className="text-xs rounded-lg px-3 py-2 mb-4 leading-relaxed"
                style={{ background: '#F0F8FF', color: '#555' }}
              >
                📋 This updates the Home screen ticker, person cards, and roster calendar automatically.
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
                  style={{ background: '#006DB7' }}
                >
                  Log Coverage
                </button>
                <button
                  className="text-sm font-semibold px-4 py-2 rounded-lg"
                  style={{ background: 'white', color: '#006DB7', border: '1.5px solid #006DB7' }}
                  onClick={() => alert('In the live app, a team lead can log leave on behalf of someone else.')}
                >
                  Log for someone else
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Right: Who's on leave ── */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-base font-bold mb-4" style={{ color: '#004672' }}>
            Who's on leave
          </div>

          {/* Active today */}
          {activeLeave.length > 0 && (
            <div className="mb-4">
              <div
                className="text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: '#bbb' }}
              >
                Active today
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400" style={{ borderBottom: '2px solid #F2F2F2' }}>
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Team</th>
                    <th className="pb-2">Dates</th>
                    <th className="pb-2">Backup</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLeave.map(l => (
                    <tr key={l.name} style={{ borderBottom: '1px solid #F2F2F2' }}>
                      <td className="py-2 font-semibold" style={{ color: '#004672' }}>{l.name}</td>
                      <td className="py-2"><TeamBadge team={l.team} /></td>
                      <td className="py-2 text-xs text-gray-500">
                        {formatDate(l.start)}
                        {l.start !== l.end && ` – ${formatDate(l.end)}`}
                      </td>
                      <td className="py-2 text-xs text-gray-500">{l.backup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Upcoming */}
          {upcomingLeave.length > 0 && (
            <div className="mb-4">
              <div
                className="text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: '#bbb' }}
              >
                Upcoming
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400" style={{ borderBottom: '2px solid #F2F2F2' }}>
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Team</th>
                    <th className="pb-2">Dates</th>
                    <th className="pb-2">Backup</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingLeave.map(l => (
                    <tr key={l.name} style={{ borderBottom: '1px solid #F2F2F2' }}>
                      <td className="py-2 font-semibold" style={{ color: '#004672' }}>{l.name}</td>
                      <td className="py-2"><TeamBadge team={l.team} /></td>
                      <td className="py-2 text-xs text-gray-500">
                        {formatDate(l.start)}
                        {l.start !== l.end && ` – ${formatDate(l.end)}`}
                      </td>
                      <td className="py-2 text-xs text-gray-500">{l.backup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Past 30 days */}
          {pastLeave.length > 0 && (
            <div>
              <div
                className="text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: '#bbb', borderTop: '1px solid #F2F2F2', paddingTop: '12px' }}
              >
                Past 30 days
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400" style={{ borderBottom: '2px solid #F2F2F2' }}>
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Team</th>
                    <th className="pb-2">Dates</th>
                    <th className="pb-2">Backup</th>
                  </tr>
                </thead>
                <tbody>
                  {pastLeave.map(l => (
                    <tr key={l.name} className="text-gray-400" style={{ borderBottom: '1px solid #F2F2F2' }}>
                      <td className="py-2">{l.name}</td>
                      <td className="py-2"><TeamBadge team={l.team} /></td>
                      <td className="py-2 text-xs">
                        {formatDate(l.start)}
                        {l.start !== l.end && ` – ${formatDate(l.end)}`}
                      </td>
                      <td className="py-2 text-xs">{l.backup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div
            className="mt-4 text-xs text-center rounded-lg py-2"
            style={{ background: '#F2F2F2', color: '#aaa' }}
          >
            ⚠️ This screen may change after internal discussions.
          </div>
        </div>
      </div>
    </div>
  )
}
