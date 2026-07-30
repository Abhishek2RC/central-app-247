// ─────────────────────────────────────────────────────────
// App.jsx  —  Replace src/App.jsx with this
// ─────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Home from './screens/Home'
import Handover from './screens/Handover'
import PastHandovers from './screens/PastHandovers'
import Roster from './screens/Roster'
import CritSit from './screens/CritSit'
import SOP from './screens/SOP'
import Leave from './screens/Leave'

function AppLayout() {
  const location = useLocation()
  const currentScreen = location.pathname.replace('/', '') || 'home'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#EBF0F5' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar currentScreen={currentScreen} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/"               element={<Navigate to="/home" replace />} />
            <Route path="/home"           element={<Home />} />
            <Route path="/handover"       element={<Handover />} />
            <Route path="/past-handovers" element={<PastHandovers />} />
            <Route path="/roster"         element={<Roster />} />
            <Route path="/critsit"        element={<CritSit />} />
            <Route path="/sop"            element={<SOP />} />
            <Route path="/leave"          element={<Leave />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  )
}
