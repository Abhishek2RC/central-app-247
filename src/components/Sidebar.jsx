import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/home',           icon: '🏠', label: 'Who is in shift',  section: 'main' },
  { path: '/handover',       icon: '🔄', label: 'Shift Handover',   section: 'main' },
  { path: '/past-handovers', icon: '🕘', label: 'Past Handovers',   section: 'main' },
  { path: '/roster',         icon: '📅', label: '24x7 Roster',      section: 'team' },
  { path: '/critsit',        icon: '🚨', label: 'CritSit Status',   section: 'team' },
  { path: '/sop',            icon: '📄', label: "24x7 SOP's",       section: 'team' },
  { path: '/leave',          icon: '🌴', label: 'RUN Leave',        section: 'team' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="w-56 bg-white flex flex-col border-r border-gray-200 flex-shrink-0">

      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
          style={{ background: '#FFB622', color: '#5c3d00' }}
        >
          24x7
        </div>
        <div>
          <div className="text-xs font-bold leading-tight" style={{ color: '#004672' }}>
            24x7 Central App
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">2.0 · Operations Hub</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {['main', 'team'].map(section => (
          <div key={section} className="mb-5">
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-300 px-2 mb-2">
              {section === 'main' ? 'Main' : 'Team'}
            </div>
            {navItems.filter(i => i.section === section).map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm mb-0.5 transition-all duration-100"
                style={isActive(item.path)
                  ? { background: '#E3F0FC', color: '#006DB7', fontWeight: 600 }
                  : { color: '#666' }
                }
                onMouseEnter={e => { if (!isActive(item.path)) { e.currentTarget.style.background = '#EEF5FC'; e.currentTarget.style.color = '#006DB7' }}}
                onMouseLeave={e => { if (!isActive(item.path)) { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#666' }}}
              >
                <span className="w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="text-[10px] text-gray-300 leading-relaxed">
          RC247 · v2.0.0
          <span className="ml-2 bg-yellow-50 text-yellow-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
            DEV
          </span>
        </div>
      </div>

    </aside>
  )
}