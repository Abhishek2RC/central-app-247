// ─────────────────────────────────────────────────────────
// AppContext.jsx  —  Global data store
// Place this file at: src/context/AppContext.jsx
// ─────────────────────────────────────────────────────────

import { createContext, useContext, useReducer, useEffect } from 'react'
import { getListItems } from '../utils/sharepoint'
import CONFIG from '../config'

// ── Sample data fallback (used when SharePoint is not reachable) ──
const SAMPLE = {
  people: [
    { FullName: 'Abhishek Mane', Team: 'Team A', Email: 'abhishek.mane@rapidcircle.com', NoticePeriod: 'No' },
    { FullName: 'Nihal Jha',     Team: 'Team A', Email: 'nihal.jha@rapidcircle.com', NoticePeriod: 'No' },
    { FullName: 'Ritik Mishra',  Team: 'Team A', Email: 'ritik.mishra@rapidcircle.com', NoticePeriod: 'No' },
    { FullName: 'Vivek Singh',   Team: 'Team A', Email: 'vivek.singh@rapidcircle.com', NoticePeriod: 'No' },
    { FullName: 'Vikas TJ',      Team: 'Team A', Email: 'vikas.tj@rapidcircle.com', NoticePeriod: 'No' },
    { FullName: 'Rahul Ingale',  Team: 'Team B', Email: 'rahul.ingale@rapidcircle.com', NoticePeriod: 'No' },
    { FullName: 'Amey Dadgale',  Team: 'Team B', Email: 'amey.dadgale@rapidcircle.com', NoticePeriod: 'No' },
    { FullName: 'Girish Bhagat', Team: 'Team B', Email: 'girish.bhagat@rapidcircle.com', NoticePeriod: 'Yes' },
  ],
  rosterA: [],   // will be loaded from SharePoint
  rosterB: [],   // will be loaded from SharePoint
  leave:   [],   // will be loaded from SharePoint
}

// ── Initial state ──
const initialState = {
  loading:   true,
  error:     null,
  usingLive: false,      // true when SharePoint data loaded successfully

  people:    SAMPLE.people,
  rosterA:   [],
  rosterB:   [],
  leave:     [],
  handovers: [],
}

// ── Reducer ──
function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        ...action.payload,
        loading:   false,
        error:     null,
        usingLive: true,
      }
    case 'ADD_LEAVE':
      return { ...state, leave: [...state.leave, action.payload] }
    case 'ADD_HANDOVER':
      return { ...state, handovers: [...state.handovers, action.payload] }
    default:
      return state
  }
}

// ── Context ──
const AppContext = createContext(null)

// ── Today's date string for filtering ──
function todayStr() {
  return new Date().toISOString().split('T')[0]
}

// ── Provider ──
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    loadAllData()
  }, [])

  async function loadAllData() {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const sp = CONFIG.sharePoint

      // Load all lists in parallel
      const [people, rosterA, rosterB, leave, handovers] = await Promise.all([

        // People list
        getListItems(sp.people.siteUrl, sp.people.listName, {
          select: 'FullName,Team,Email,Phone,NoticePeriod',
        }),

        // Team A roster — only current year
        getListItems(sp.shiftRosterA.siteUrl, sp.shiftRosterA.listName, {
          select:  'FullName,ShiftDate,ShiftCode',
          filter:  `ShiftDate ge '2026-01-01'`,
          orderby: 'ShiftDate asc',
          top:     2000,
        }),

        // Team B roster
        getListItems(sp.shiftRosterB.siteUrl, sp.shiftRosterB.listName, {
          select:  'FullName,ShiftDate,ShiftCode',
          orderby: 'ShiftDate asc',
          top:     1000,
        }),

        // Leave — active and upcoming only
        getListItems(sp.leave.siteUrl, sp.leave.listName, {
          select:  'FullName,Team,StartDate,EndDate,Backup,LoggedBy',
          filter:  `EndDate ge '${todayStr()}'`,
          orderby: 'StartDate asc',
        }),

        // Past handovers — last 30 days
        getListItems(sp.handover.siteUrl, sp.handover.listName, {
          select:  'Title,Created,Author/Title,CallsHandled,CritSitCount,ShiftNumber',
          orderby: 'Created desc',
          top:     50,
        }),
      ])

      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { people, rosterA, rosterB, leave, handovers },
      })

      console.log('✅ SharePoint data loaded successfully')
      console.log(`   People: ${people.length}`)
      console.log(`   Roster A: ${rosterA.length}`)
      console.log(`   Roster B: ${rosterB.length}`)
      console.log(`   Leave: ${leave.length}`)
      console.log(`   Handovers: ${handovers.length}`)

    } catch (err) {
      console.error('❌ SharePoint connection failed:', err.message)
      dispatch({ type: 'SET_ERROR', payload: err.message })
    }
  }

  // ── Helper: reload leave data ──
  async function refreshLeave() {
    try {
      const sp = CONFIG.sharePoint
      const leave = await getListItems(sp.leave.siteUrl, sp.leave.listName, {
        select:  'FullName,Team,StartDate,EndDate,Backup,LoggedBy',
        filter:  `EndDate ge '${todayStr()}'`,
        orderby: 'StartDate asc',
      })
      dispatch({ type: 'LOAD_SUCCESS', payload: { ...state, leave } })
    } catch (err) {
      console.warn('Could not refresh leave data:', err.message)
    }
  }

  const value = { ...state, dispatch, refreshLeave, retry: loadAllData }

  return (
    <AppContext.Provider value={value}>
      {state.loading  ? <AppLoader /> :
       state.error    ? <AppError error={state.error} onRetry={loadAllData} /> :
       children}
    </AppContext.Provider>
  )
}

// ── Loading screen ──
function AppLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: '16px',
      background: '#EBF0F5', fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: '#FFB622', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '14px', fontWeight: '900', color: '#5c3d00',
      }}>
        24x7
      </div>
      <div style={{ color: '#004672', fontWeight: '600', fontSize: '15px' }}>
        Loading 24x7 Central App…
      </div>
      <div style={{ color: '#aaa', fontSize: '12px' }}>
        Connecting to SharePoint…
      </div>
      <div style={{
        width: '200px', height: '3px', background: '#E0E0E0',
        borderRadius: '3px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', background: '#006DB7', borderRadius: '3px',
          animation: 'progress 1.5s ease-in-out infinite',
          width: '40%',
        }} />
      </div>
      <style>{`
        @keyframes progress {
          0%   { transform: translateX(-100%) }
          100% { transform: translateX(600%) }
        }
      `}</style>
    </div>
  )
}

// ── Error screen ──
function AppError({ error, onRetry }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: '16px',
      background: '#EBF0F5', fontFamily: 'Segoe UI, sans-serif',
      padding: '40px',
    }}>
      {/* Logo */}
      <div style={{
        width: '52px', height: '52px', borderRadius: '12px',
        background: '#FFB622', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '13px', fontWeight: '900', color: '#5c3d00',
      }}>
        24x7
      </div>

      {/* Error icon */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#FCEBEB', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '28px',
      }}>
        ❌
      </div>

      {/* Title */}
      <div style={{ color: '#A32D2D', fontWeight: '700', fontSize: '18px', textAlign: 'center' }}>
        SharePoint Connection Failed
      </div>

      {/* Description */}
      <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', maxWidth: '420px', lineHeight: '1.6' }}>
        The app could not connect to SharePoint to load your data.
        This usually means you are not logged into Microsoft 365 in this browser,
        or the SharePoint site URLs in <strong>config.js</strong> need to be verified.
      </div>

      {/* Error details */}
      <div style={{
        background: '#fff', border: '1px solid #E0E0E0', borderRadius: '8px',
        padding: '12px 16px', maxWidth: '500px', width: '100%',
        fontFamily: 'Courier New, monospace', fontSize: '11px', color: '#A32D2D',
        wordBreak: 'break-all',
      }}>
        <strong>Error:</strong> {error}
      </div>

      {/* Checklist */}
      <div style={{
        background: '#FFF9EC', border: '1px solid #FFD166', borderRadius: '8px',
        padding: '14px 18px', maxWidth: '500px', width: '100%',
      }}>
        <div style={{ fontWeight: '700', color: '#7a5800', fontSize: '12px', marginBottom: '8px' }}>
          ✅ Check these:
        </div>
        {[
          'Are you logged into Microsoft 365 in this browser?',
          'Are the SharePoint site URLs correct in src/config.js?',
          'Do the SharePoint list names match exactly (case-sensitive)?',
          'Do you have access to the SharePoint site?',
          'If on localhost — deploy to Azure first, then test.',
        ].map((item, i) => (
          <div key={i} style={{ fontSize: '12px', color: '#555', marginBottom: '5px' }}>
            {i + 1}. {item}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onRetry}
          style={{
            background: '#006DB7', color: '#fff', border: 'none',
            padding: '10px 24px', borderRadius: '8px', fontFamily: 'Segoe UI, sans-serif',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          🔄 Retry Connection
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'white', color: '#006DB7',
            border: '1.5px solid #006DB7',
            padding: '10px 24px', borderRadius: '8px', fontFamily: 'Segoe UI, sans-serif',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          ↺ Reload Page
        </button>
      </div>

      <div style={{ color: '#aaa', fontSize: '11px', marginTop: '8px' }}>
        24x7 Central App 2.0 · RC247
      </div>
    </div>
  )
}

// ── Hook ──
export function useAppData() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppData must be used inside AppProvider')
  return ctx
}
