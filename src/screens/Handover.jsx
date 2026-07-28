import { useState, useRef, useEffect } from 'react'

// ── HandShake Agent Panel ──
function HandShakePanel({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, from: 'agent', text: "Hi Amey 👋 I'm HandShake. Ready to complete your handover? I'll guide you through it.", time: '14:32' },
    { id: 2, from: 'user',  text: "Yes, let's start handover.", time: '14:32' },
    { id: 3, from: 'agent', text: "How many calls did you handle on the support phone today?", time: '14:33' },
    { id: 4, from: 'user',  text: "5 calls. Also 1 P2 CritSit — Client C, network latency.", time: '14:33' },
    { id: 5, from: 'agent', text: "Got it — 5 calls, 1 P2 CritSit. Any pending tasks for next shift?", time: '14:34' },
    { id: 6, from: 'user',  text: "P2 still open, Topdesk ticket 4821 needs L2 response.", time: '14:35' },
    { id: 7, from: 'agent', text: null, summary: true, time: '14:47' },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const agentReplies = [
    "Got it — I've noted that in the handover summary.",
    "Thanks for the update. I've added that to the pending tasks section.",
    "Understood. Anything else you'd like me to capture?",
    "I've updated the form with that information.",
    "Noted! The next shift engineer will be informed.",
  ]

  const sendMessage = () => {
    if (!input.trim()) return
    const now = new Date()
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    const t = String(ist.getHours()).padStart(2,'0') + ':' + String(ist.getMinutes()).padStart(2,'0')
    const userMsg = { id: Date.now(), from: 'user', text: input.trim(), time: t }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      const reply = agentReplies[Math.floor(Math.random() * agentReplies.length)]
      setMessages(prev => [...prev, { id: Date.now()+1, from: 'agent', text: reply, time: t }])
    }, 800)
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 rounded-xl overflow-hidden flex flex-col"
      style={{
        width: '340px',
        height: '520px',
        boxShadow: '0 8px 32px rgba(0,70,114,.2)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,#004672,#006DB7)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
          style={{ background: '#FFB622', color: '#5c3d00', fontFamily: 'serif' }}
        >
          H
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-bold">HandShake</div>
          <div className="text-[10px]" style={{ color: '#90BADC' }}>Copilot Studio · Shift Agent</div>
        </div>
        <button
          onClick={onClose}
          className="text-white text-lg leading-none opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>

      {/* Topics */}
      <div
        className="flex gap-1.5 flex-wrap px-3 py-2 flex-shrink-0"
        style={{ background: '#F0F4FA', borderBottom: '1px solid #E8EEF4' }}
      >
        {[
          { label: 'Start Shift',        active: false },
          { label: 'Who Is In Shift',    active: false },
          { label: '● Complete Handover',active: true  },
          { label: 'Shift Swap',         active: false },
          { label: 'Shift Override',     active: false },
        ].map(t => (
          <span
            key={t.label}
            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={t.active
              ? { background: '#EAF3DE', color: '#3B6D11' }
              : { background: '#EEEEEE', color: '#888' }
            }
          >
            {t.label}
          </span>
        ))}
      </div>

      {/* Status */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold flex-shrink-0"
        style={{ background: '#E8F5E9', borderBottom: '1px solid #B5D88A', color: '#3B6D11' }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: '#72B62A',
            animation: 'pulse 2s infinite',
          }}
        />
        Complete Handover — active · Call ended 14:47 IST
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5"
        style={{ background: '#F8FAFC' }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.from === 'agent' && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded mb-1"
                style={{ background: '#FFF3DD', color: '#8a5d00' }}
              >
                HandShake
              </span>
            )}
            {msg.summary ? (
              <div
                className="rounded-xl p-3 text-xs max-w-[90%]"
                style={{
                  background: '#EAF3DE',
                  border: '1px solid #B5D88A',
                  borderRadius: '0 10px 10px 10px',
                }}
              >
                <div className="font-bold mb-2" style={{ color: '#3B6D11' }}>
                  ✅ Form filled from conversation
                </div>
                <div className="space-y-1" style={{ color: '#3B6D11', lineHeight: '1.8' }}>
                  <div>📞 Calls handled: 5</div>
                  <div>🚨 CritSit: 1 (P2 · Client C)</div>
                  <div>⏳ Pending: P2 open · Ticket #4821</div>
                  <div>🌴 Leave: Vivek 28–29 Jul (Abhishek)</div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl text-xs px-3 py-2 max-w-[88%] leading-relaxed"
                style={msg.from === 'agent'
                  ? { background: 'white', border: '1px solid #E0EAF5', color: '#3F3F3F', borderRadius: '0 10px 10px 10px' }
                  : { background: '#006DB7', color: 'white', borderRadius: '10px 10px 0 10px' }
                }
              >
                {msg.text}
              </div>
            )}
            <div className="text-[9px] text-gray-300 mt-0.5">{msg.time} IST</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Actions */}
      <div
        className="flex-shrink-0 p-3 space-y-2"
        style={{ background: 'white', borderTop: '1px solid #F2F2F2' }}
      >
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-300 mb-1">
          HandShake actions
        </div>
        {[
          { label: '✍️ Re-fill form from conversation', action: () => alert('HandShake would re-fill the form from the call transcript.') },
          { label: '📣 Post summary to Teams',          action: () => alert('HandShake would post the handover summary to the 24x7 Teams channel.') },
          { label: '🔄 Initiate shift swap',            action: () => alert('HandShake would start the Shift Swap topic.'), gold: true },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.action}
            className="w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            style={btn.gold
              ? { background: '#FFF3DD', border: '1px solid #FFD166', color: '#7a5800' }
              : { background: '#EEF5FF', border: '1px solid #CCE4F5', color: '#006DB7' }
            }
          >
            {btn.label}
          </button>
        ))}
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            placeholder="Ask HandShake..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 text-xs px-3 py-2 rounded-lg outline-none"
            style={{ border: '1.5px solid #D0D7DE' }}
          />
          <button
            onClick={sendMessage}
            className="px-3 py-2 rounded-lg text-white text-xs font-bold"
            style={{ background: '#006DB7' }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Tab Component ──
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2.5 text-sm font-semibold transition-colors"
      style={{
        color: active ? '#006DB7' : '#999',
        borderBottom: active ? '2px solid #006DB7' : '2px solid transparent',
        marginBottom: '-2px',
      }}
    >
      {label}
    </button>
  )
}

// ── Form Field ──
function Field({ label, required, children }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#004672' }}>
        {label} {required && <span style={{ color: '#F25022' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass = "w-full text-sm px-3 py-2 rounded-lg outline-none"
const inputStyle = { border: '1.5px solid #D0D7DE' }
const taStyle    = { border: '1.5px solid #D0D7DE', resize: 'vertical' }

// ── Client Card ──
function ClientCard({ label }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ border: '1px solid #E8EEF4', background: '#FAFCFF' }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-wide mb-2"
        style={{ color: '#006DB7' }}
      >
        {label}
      </div>
      <Field label="Tickets handled">
        <input type="number" defaultValue={0} className={inputClass} style={inputStyle} />
      </Field>
      <Field label="Details">
        <textarea rows={2} className={inputClass} style={taStyle} />
      </Field>
    </div>
  )
}

// ── Handover Screen ──
export default function Handover() {
  const [activeTab,       setActiveTab]       = useState('overview')
  const [showHandShake,   setShowHandShake]   = useState(false)
  const [submitted,       setSubmitted]       = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview'              },
    { id: 'clients',  label: 'Clients'               },
    { id: 'tasks',    label: 'Tasks & Quality'       },
    { id: 'updates',  label: 'Updates & Attachments' },
  ]

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      {/* Top bar */}
      <div
        className="flex items-center justify-between mb-3 flex-wrap gap-2"
      >
        <div
          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg"
          style={{ background: '#EAF3DE', border: '1px solid #B5D88A', color: '#3B6D11' }}
        >
          ✅ <strong>Team B · NL Project</strong> &nbsp;·&nbsp; Fill manually or use HandShake
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('In the live app this opens the HandShake Teams chat directly.\n\nhttps://teams.microsoft.com/l/chat/0/0?users=28:BOT_ID')}
            className="text-xs font-semibold px-3 py-2 rounded-lg text-white"
            style={{ background: '#5059C9' }}
          >
            ↗ Open in Teams
          </button>
          <button
            onClick={() => setShowHandShake(s => !s)}
            className="text-xs font-semibold px-3 py-2 rounded-lg text-white"
            style={{ background: '#004672' }}
          >
            🤖 HandShake {showHandShake ? '▲' : '▼'}
          </button>
          <button
            onClick={() => window.location.href = '/past-handovers'}
            className="text-xs font-semibold px-3 py-2 rounded-lg"
            style={{ background: 'white', color: '#006DB7', border: '1.5px solid #006DB7' }}
          >
            🕘 Past handovers
          </button>
        </div>
      </div>

      {/* Direct link bar */}
      <div
        className="flex items-center justify-between rounded-lg px-4 py-2 mb-4 text-xs"
        style={{ background: '#F0F8FF', border: '1px solid #CCE4F5', color: '#555' }}
      >
        <span>
          🔗 Direct link: <strong style={{ color: '#006DB7' }}>https://yourapp.com/handover</strong>
        </span>
        <button
          className="font-semibold text-xs"
          style={{ color: '#006DB7', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => {
            navigator.clipboard?.writeText('https://yourapp.com/handover')
              .then(() => alert('Link copied!'))
              .catch(() => alert('Copy not supported in this browser.'))
          }}
        >
          📋 Copy link
        </button>
      </div>

      {/* Submitted confirmation */}
      {submitted && (
        <div
          className="text-center py-4 rounded-xl mb-4 text-sm font-semibold"
          style={{ background: '#EAF3DE', color: '#3B6D11' }}
        >
          ✅ Handover submitted successfully! HandShake will notify the team.
        </div>
      )}

      {/* Form card */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: '2px solid #F2F2F2', marginBottom: '20px' }}
        >
          {tabs.map(t => (
            <Tab
              key={t.id}
              label={t.label}
              active={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
            />
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-2">
              <Field label="Created by">
                <input
                  className={inputClass}
                  style={{ ...inputStyle, background: '#F7F9FB' }}
                  value="Amey Dadgale"
                  readOnly
                />
              </Field>
              <Field label="Shift number" required>
                <select className={inputClass} style={inputStyle}>
                  <option>First Shift — 28 Jul 2026</option>
                  <option>Second Shift — 28 Jul 2026</option>
                </select>
              </Field>
              <Field label="Title" required>
                <input className={inputClass} style={inputStyle} defaultValue="Handover" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Calls handled on support phone" required>
                <input type="number" className={inputClass} style={inputStyle} defaultValue={5} />
              </Field>
              <Field label="Number of on-going CritSits">
                <input type="number" className={inputClass} style={inputStyle} defaultValue={1} />
              </Field>
            </div>
            <Field label="Detailed description of call(s) handled">
              <textarea
                rows={3}
                className={inputClass}
                style={taStyle}
                defaultValue="2 calls related to NL network latency issue. 1 call regarding VPN access. 1 Topdesk escalation. 1 routine support call."
              />
            </Field>
            <Field label="States of on-going CritSit">
              <textarea
                rows={3}
                className={inputClass}
                style={taStyle}
                defaultValue="P2 — Network latency spike on Client C. Under investigation by NOC team. ETA for resolution: 2 hours."
              />
            </Field>
          </div>
        )}

        {/* ── Tab: Clients ── */}
        {activeTab === 'clients' && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <ClientCard label="Client 1" />
              <ClientCard label="Client 2" />
              <ClientCard label="Client 3" />
              <ClientCard label="Client 4" />
              <ClientCard label="Client 5" />
              <ClientCard label="AU" />
            </div>
            <Field label="Other clients details">
              <textarea rows={2} className={inputClass} style={taStyle} />
            </Field>
          </div>
        )}

        {/* ── Tab: Tasks & Quality ── */}
        {activeTab === 'tasks' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <Field label="Important tasks performed" required>
                <textarea rows={3} className={inputClass} style={taStyle}
                  defaultValue="Resolved VPN access issue for Client C. Raised P2 CritSit. Completed daily monitoring checklist." />
              </Field>
              <Field label="Pending tasks" required>
                <textarea rows={3} className={inputClass} style={taStyle}
                  defaultValue="P2 CritSit (Client C latency) still open — handover to next shift. Topdesk ticket #4821 pending L2 response." />
              </Field>
              <Field label="Archived mails information" required>
                <textarea rows={3} className={inputClass} style={taStyle}
                  defaultValue="3 emails archived to Client C folder. Security alert email forwarded to NOC." />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Leaves information (RUN)" required>
                <textarea
                  rows={2}
                  className={inputClass}
                  style={{ ...taStyle, background: '#F7FDF3', color: '#3B6D11' }}
                  defaultValue="Vivek Singh on leave 28-29 Jul (backup: Abhishek Mane)"
                />
              </Field>
              <Field label="Quality checks" required>
                <textarea rows={2} className={inputClass} style={taStyle}
                  defaultValue="All monitoring dashboards checked. No false alerts. Support phone tested — working." />
              </Field>
              <Field label="Test call to upcoming shift engineer">
                <textarea rows={2} className={inputClass} style={taStyle}
                  defaultValue="Called Rahul Ingale at 14:50 IST — confirmed handover received." />
              </Field>
            </div>
          </div>
        )}

        {/* ── Tab: Updates & Attachments ── */}
        {activeTab === 'updates' && (
          <div>
            {/* Announcements section */}
            <div
              className="text-xs font-bold px-3 py-2 rounded-lg mb-3"
              style={{ background: '#EEF5FF', color: '#006DB7' }}
            >
              📢 IMPORTANT ANNOUNCEMENTS
            </div>
            <Field label="Topdesk announcement and ticket details" required>
              <textarea rows={2} className={inputClass} style={taStyle}
                defaultValue="Maintenance window scheduled for Client A on 29 Jul 22:00–02:00 IST. Ticket #4820 raised." />
            </Field>

            {/* Client-specific updates section */}
            <div
              className="text-xs font-bold px-3 py-2 rounded-lg mb-3 mt-4"
              style={{ background: '#EEF5FF', color: '#006DB7' }}
            >
              📊 CLIENT-SPECIFIC UPDATES
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <Field label="Incidents & requests">
                <input type="number" className={inputClass} style={inputStyle} defaultValue={2} />
              </Field>
              <Field label="Incident & requests details">
                <textarea rows={2} className={inputClass} style={taStyle}
                  defaultValue="P2 latency spike Client C. VPN access request Client C resolved." />
              </Field>
              <Field label="Important updates">
                <textarea rows={2} className={inputClass} style={taStyle}
                  defaultValue="NOC team notified of P2. Client C account manager informed." />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Field label="Tasks performed">
                <textarea rows={2} className={inputClass} style={taStyle}
                  defaultValue="Monitoring checks, CritSit raised, client comms sent." />
              </Field>
              <Field label="Mailbox quality checks">
                <textarea rows={2} className={inputClass} style={taStyle}
                  defaultValue="Shared mailbox reviewed — 0 unread older than 2 hours." />
              </Field>
              <Field label="Shared mailbox activities">
                <textarea rows={2} className={inputClass} style={taStyle}
                  defaultValue="3 emails responded to. 2 forwarded to L2." />
              </Field>
            </div>

            {/* Attachments */}
            <Field label="Attachments">
              <div
                className="rounded-lg p-4 text-center text-sm text-gray-300"
                style={{ border: '1.5px dashed #D0D7DE' }}
              >
                📎 Drop files here or{' '}
                <span className="font-semibold cursor-pointer" style={{ color: '#006DB7' }}>
                  browse
                </span>
              </div>
            </Field>

            {/* Submit button */}
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmit}
                className="text-sm font-semibold px-6 py-2.5 rounded-lg text-white"
                style={{ background: '#006DB7' }}
              >
                Submit handover ✓
              </button>
            </div>
          </div>
        )}
      </div>

      {/* HandShake floating panel */}
      {showHandShake && (
        <HandShakePanel onClose={() => setShowHandShake(false)} />
      )}
    </div>
  )
}
