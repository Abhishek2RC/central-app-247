import { useState } from 'react'

const HANDOVERS = [
  { id: 1, shift: 'Second shift', date: '5 Jul 2026', by: 'Rahul Raj',    calls: 3, critsit: 0, summary: 'Routine shift. 3 support calls handled. No escalations.' },
  { id: 2, shift: 'First shift',  date: '5 Jul 2026', by: 'Amey Dadgale', calls: 5, critsit: 1, summary: 'P2 CritSit raised for Client C — network latency. VPN issue resolved. 5 calls handled.' },
  { id: 3, shift: 'Second shift', date: '4 Jul 2026', by: 'Amey Dadgale', calls: 2, critsit: 0, summary: '2 calls handled. Maintenance window completed successfully.' },
  { id: 4, shift: 'First shift',  date: '4 Jul 2026', by: 'Rahul Raj',    calls: 4, critsit: 0, summary: '4 support calls. Topdesk ticket #4815 escalated to L2.' },
  { id: 5, shift: 'Second shift', date: '3 Jul 2026', by: 'Amey Dadgale', calls: 6, critsit: 1, summary: 'Busy shift — P2 raised and resolved within shift. 6 calls handled.' },
  { id: 6, shift: 'First shift',  date: '3 Jul 2026', by: 'Rahul Ingale', calls: 3, critsit: 0, summary: '3 calls. Quality checks completed. Shared mailbox reviewed.' },
]

const SHIFT_OPTIONS = ['All shifts', 'First shift', 'Second shift']
const MEMBER_OPTIONS = ['All members', 'Rahul Raj', 'Girish Bhagat', 'Rahul Ingale', 'Amey Dadgale']

export default function PastHandovers() {
  const [selectedHandover, setSelectedHandover] = useState(null)
  const [search,  setSearch]  = useState('')
  const [shift,   setShift]   = useState('All shifts')
  const [member,  setMember]  = useState('All members')
  const [fromDate, setFromDate] = useState('2026-07-01')
  const [toDate,   setToDate]  = useState('2026-07-28')

  const filtered = HANDOVERS.filter(h => {
    const matchShift  = shift  === 'All shifts'  || h.shift  === shift
    const matchMember = member === 'All members' || h.by     === member
    const matchSearch = !search || h.summary.toLowerCase().includes(search.toLowerCase()) || h.by.toLowerCase().includes(search.toLowerCase())
    return matchShift && matchMember && matchSearch
  })

  if (selectedHandover) {
    return (
      <div>
        <button
          onClick={() => setSelectedHandover(null)}
          className="flex items-center gap-2 text-sm font-semibold mb-4"
          style={{ color: '#006DB7' }}
        >
          ← Back to list
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div
            className="pb-4 mb-5"
            style={{ borderBottom: '2px solid #F2F2F2' }}
          >
            <div className="text-lg font-bold" style={{ color: '#004672' }}>
              {selectedHandover.shift} — {selectedHandover.date}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Logged by {selectedHandover.by}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Calls handled', value: selectedHandover.calls, color: '#006DB7', bg: '#DFF0FF' },
              { label: 'CritSits',      value: selectedHandover.critsit, color: selectedHandover.critsit > 0 ? '#A32D2D' : '#3B6D11', bg: selectedHandover.critsit > 0 ? '#FCEBEB' : '#EAF3DE' },
              { label: 'Shift',         value: selectedHandover.shift.split(' ')[0], color: '#004672', bg: '#D8E9F5' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: s.bg }}>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: s.color }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#004672' }}>
                Summary
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{selectedHandover.summary}</p>
            </div>
            <div
              className="text-xs text-center rounded-lg py-3"
              style={{ background: '#F0F8FF', color: '#90BADC' }}
            >
              Full handover details will be available once connected to Shift_Handover_2 SharePoint list.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div
        className="bg-white rounded-xl shadow-sm p-4 mb-4 flex gap-3 flex-wrap items-center"
      >
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg outline-none"
          style={{ border: '1.5px solid #D0D7DE', width: '140px' }}
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg outline-none"
          style={{ border: '1.5px solid #D0D7DE', width: '140px' }}
        />
        <select
          value={shift}
          onChange={e => setShift(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg outline-none"
          style={{ border: '1.5px solid #D0D7DE', width: '160px' }}
        >
          {SHIFT_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={member}
          onChange={e => setMember(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg outline-none"
          style={{ border: '1.5px solid #D0D7DE', width: '160px' }}
        >
          {MEMBER_OPTIONS.map(m => <option key={m}>{m}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg outline-none flex-1"
          style={{ border: '1.5px solid #D0D7DE', minWidth: '160px' }}
        />
        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-300">
            <div className="text-4xl mb-2">🕘</div>
            <div className="text-sm">No handovers match your filters</div>
          </div>
        ) : (
          filtered.map((h, i) => (
            <div
              key={h.id}
              className="flex items-center justify-between px-5 py-4 cursor-pointer transition-colors"
              style={{
                borderBottom: i < filtered.length - 1 ? '1px solid #F2F2F2' : 'none',
              }}
              onClick={() => setSelectedHandover(h)}
              onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div className="font-semibold text-sm" style={{ color: '#004672' }}>
                  {h.shift} — {h.date}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Logged by {h.by}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">📞 {h.calls} calls</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: h.critsit > 0 ? '#A32D2D' : '#3B6D11' }}
                >
                  🚨 {h.critsit} CritSit
                </span>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: 'white', color: '#006DB7', border: '1.5px solid #006DB7' }}
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
