// ── CritSit Status Screen ──
// Read-only view from CritSit SharePoint app
// Data will be connected to SharePoint in Phase 7

const CRITSIT_DATA = [
  {
    id: 1,
    client: 'Client A',
    title: 'P1 — SOC monitoring down',
    services: 'Azure',
    createdOn: '5 Jul 2026, 09:24 PM',
    phase: 'Active',
    priority: 'P1',
  },
  {
    id: 2,
    client: 'Client C',
    title: 'P2 — Network latency spike',
    services: 'Network / VPN',
    createdOn: '4 Jul 2026, 02:15 PM',
    phase: 'Investigating',
    priority: 'P2',
  },
  {
    id: 3,
    client: 'TEST',
    title: '[DRILL] Monthly exercise',
    services: 'TEST',
    createdOn: '16 Jun 2026, 03:59 PM',
    phase: 'Closed',
    priority: null,
  },
  {
    id: 4,
    client: 'TEST',
    title: '[DRILL]',
    services: 'TEST',
    createdOn: '13 May 2026, 10:26 AM',
    phase: 'Closed',
    priority: null,
  },
  {
    id: 5,
    client: 'TEST',
    title: '[DRILL]',
    services: 'TEST',
    createdOn: '23 Apr 2026, 02:20 AM',
    phase: 'Closed',
    priority: null,
  },
]

// ── Phase badge ──
function PhaseBadge({ phase, priority }) {
  const styles = {
    Active:       { bg: '#FCEBEB', color: '#A32D2D', dot: '●' },
    Investigating:{ bg: '#FFF3DD', color: '#8a5d00', dot: '⧗' },
    Closed:       { bg: '#EEEEEE', color: '#666666', dot: '✓' },
  }
  const s = styles[phase] || styles.Closed
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {s.dot} {phase}
    </span>
  )
}

// ── Priority badge ──
function PriorityBadge({ priority }) {
  if (!priority) return null
  const isP1 = priority === 'P1'
  return (
    <span
      className="inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded ml-2"
      style={{
        background: isP1 ? '#F25022' : '#FFB622',
        color: isP1 ? 'white' : '#5c3d00',
      }}
    >
      {priority}
    </span>
  )
}

// ── Stat Card ──
function StatCard({ value, label, color, borderColor }) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-4"
      style={{ borderTop: `3px solid ${borderColor}` }}
    >
      <div className="text-3xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}

// ── CritSit Screen ──
export default function CritSit() {
  const active      = CRITSIT_DATA.filter(c => c.phase === 'Active')
  const investigating = CRITSIT_DATA.filter(c => c.phase === 'Investigating')
  const open        = CRITSIT_DATA.filter(c => c.phase !== 'Closed')
  const closedMonth = CRITSIT_DATA.filter(c => c.phase === 'Closed')

  return (
    <div>

      {/* Data source note */}
      <div
        className="flex items-center gap-2 rounded-lg px-4 py-2.5 mb-4 text-xs"
        style={{
          background: '#F0F8FF',
          border: '1px solid #CCE4F5',
          color: '#555',
        }}
      >
        <span>🔗</span>
        <span>
          <strong>Live data from CritSit SharePoint app</strong> — read only.
          To raise a new CritSit use the CritSit Power App directly.
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard
          value={active.length}
          label="P1 active right now"
          color="#F25022"
          borderColor="#F25022"
        />
        <StatCard
          value={investigating.length}
          label="P2 investigating"
          color="#8a5d00"
          borderColor="#FFB622"
        />
        <StatCard
          value={open.length}
          label="Total open"
          color="#004672"
          borderColor="#D0D7DE"
        />
        <StatCard
          value={closedMonth.length}
          label="Closed this month"
          color="#3B6D11"
          borderColor="#72B62A"
        />
      </div>

      {/* CritSit table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Table header */}
        <div
          className="grid gap-0 text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-3"
          style={{
            gridTemplateColumns: '180px 1fr 160px 180px 140px',
            borderBottom: '2px solid #F2F2F2',
          }}
        >
          <div>Client</div>
          <div>Issue title</div>
          <div>Services impacted</div>
          <div>Created on</div>
          <div>Phase</div>
        </div>

        {/* Table rows */}
        {CRITSIT_DATA.map((c, i) => (
          <div
            key={c.id}
            className="grid items-center px-4 py-3 text-sm transition-colors"
            style={{
              gridTemplateColumns: '180px 1fr 160px 180px 140px',
              borderBottom: i < CRITSIT_DATA.length - 1 ? '1px solid #F2F2F2' : 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FAFCFF'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div className="font-semibold" style={{ color: '#004672' }}>
              {c.client}
            </div>
            <div style={{ color: '#3F3F3F' }}>
              {c.title}
              {c.priority && <PriorityBadge priority={c.priority} />}
            </div>
            <div className="text-gray-500">{c.services}</div>
            <div className="text-gray-400 text-xs">{c.createdOn}</div>
            <div>
              <PhaseBadge phase={c.phase} priority={c.priority} />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
