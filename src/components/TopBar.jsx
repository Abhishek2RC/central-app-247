import { useState, useEffect } from 'react'

const titles = {
  home: 'Who is in shift',
  handover: '24x7 Shift Handover',
  'past-handovers': 'Past Handovers',
  roster: '24x7 Roster',
  critsit: 'CritSit Status',
  sop: "24x7 SOP's",
  leave: 'RUN Leave',
}

export default function TopBar({ currentScreen }) {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      setTime(
        String(ist.getHours()).padStart(2, '0') + ':' +
        String(ist.getMinutes()).padStart(2, '0') + ' IST'
      )
      setDate(ist.toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
      }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      className="h-14 flex items-center justify-between px-6 flex-shrink-0"
      style={{ background: '#004672' }}
    >
      <h1 className="text-white text-base font-bold tracking-wide">
        {titles[currentScreen] || '24x7 Central App 2.0'}
      </h1>
      <div className="flex items-center gap-5 text-sm" style={{ color: '#90BADC' }}>
        <span>{date}</span>
        <span className="text-white font-semibold">{time}</span>
      </div>
    </header>
  )
}