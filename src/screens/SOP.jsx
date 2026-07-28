import { useState } from 'react'

// ── SOP Data (will connect to SharePoint document library later) ──
const CATEGORIES = [
  {
    id: 'documents',
    label: '📁 Documents',
    files: [
      {
        id: 'escalation',
        name: 'Escalation Matrix.pdf',
        icon: '📄',
        meta: 'Last updated: 1 Jun 2026 · PDF',
        content: {
          title: 'Escalation Matrix',
          sections: [
            {
              heading: 'Purpose',
              body: 'This document defines the escalation path for all P1 and P2 incidents raised through the 24x7 Central Operations team. Follow this matrix for every CritSit where a resolution is not achieved within the first 30 minutes.',
            },
            {
              heading: 'P1 Escalation path',
              bullets: [
                '0–15 min: On-shift engineer attempts resolution',
                '15–30 min: Notify shift lead and open CritSit record',
                '30 min+: Escalate to L2 support and client account manager',
                '60 min+: Escalate to Service Delivery Manager',
              ],
            },
            {
              heading: 'P2 Escalation path',
              bullets: [
                '0–30 min: On-shift engineer investigates and logs notes in CritSit',
                '30 min+: Notify shift lead — assess whether to promote to P1',
                '2 hours+: Escalate to account manager if still unresolved',
              ],
            },
            {
              heading: 'Contact list',
              body: 'Refer to CritSit Settings in SharePoint for all escalation contact numbers and email IDs by role and client.',
            },
          ],
        },
      },
      {
        id: 'network',
        name: 'Network Outage SOP.pdf',
        icon: '📄',
        meta: 'Last updated: 15 May 2026 · PDF',
        content: {
          title: 'Network Outage SOP',
          sections: [
            {
              heading: 'Scope',
              body: 'Covers all network-layer incidents affecting client connectivity, including VPN failures, DNS issues, and BGP route instability.',
            },
            {
              heading: 'Steps',
              bullets: [
                'Confirm the outage via monitoring dashboard',
                'Check if multiple clients are impacted',
                'Raise CritSit if P1 threshold is met',
                'Notify NOC team via Teams channel',
              ],
            },
          ],
        },
      },
      {
        id: 'onboarding',
        name: 'Onboarding Guide.pdf',
        icon: '📄',
        meta: 'Last updated: 10 Mar 2026 · PDF',
        content: {
          title: 'Onboarding Guide',
          sections: [
            {
              heading: 'Overview',
              body: 'Step-by-step guide for new team members joining the 24x7 operations team. Covers access provisioning, tool setup, and first-week checkpoints.',
            },
            {
              heading: 'Access checklist',
              bullets: [
                'Request access to 24x7 Central App',
                'Set up VPN and SSO',
                'Join Teams channels: 24x7-general, critsit-alerts',
                'Complete shadow shifts with a senior engineer',
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'checklist',
    label: '✅ Checklist',
    files: [
      {
        id: 'daily',
        name: 'Daily Ops Checklist.xlsx',
        icon: '📋',
        meta: 'Last updated: 1 Jul 2026 · XLSX',
        content: {
          title: 'Daily Operations Checklist',
          sections: [
            {
              heading: 'Start of shift',
              bullets: [
                'Review overnight handover notes',
                'Check monitoring dashboards for any open alerts',
                'Confirm support phone is active and routed correctly',
                'Review Topdesk queue for any pending tickets',
              ],
            },
            {
              heading: 'End of shift',
              bullets: [
                'Complete shift handover form',
                'Update CritSit records if any open',
                'Archive shift emails',
                'Test call to incoming shift engineer',
              ],
            },
          ],
        },
      },
      {
        id: 'critsit-cl',
        name: 'CritSit Checklist.pdf',
        icon: '📋',
        meta: 'Last updated: 20 Apr 2026 · PDF',
        content: {
          title: 'CritSit Checklist',
          sections: [
            {
              heading: 'When a CritSit is raised',
              bullets: [
                'Confirm severity with the client',
                'Open a CritSit record immediately',
                'Notify the shift lead',
                'Create a Teams sub-channel for the incident',
                'Start a call with the client',
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'report',
    label: '📊 Report Templates',
    files: [
      {
        id: 'monthly',
        name: 'Monthly Report.docx',
        icon: '📄',
        meta: 'Last updated: 1 Jun 2026 · DOCX',
        content: {
          title: 'Monthly Report Template',
          sections: [
            {
              heading: 'Sections to include',
              bullets: [
                'Executive summary',
                'CritSit count by severity',
                'Call volume and support phone stats',
                'SLA compliance summary',
                'Team leave and coverage summary',
              ],
            },
          ],
        },
      },
      {
        id: 'incident',
        name: 'Incident Report.docx',
        icon: '📄',
        meta: 'Last updated: 12 Mar 2026 · DOCX',
        content: {
          title: 'Incident Report Template',
          sections: [
            {
              heading: 'Sections to include',
              bullets: [
                'Incident summary',
                'Timeline of events',
                'Root cause analysis',
                'Impact assessment',
                'Resolution steps',
                'Preventive measures',
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: 'security',
    label: '🔒 Security Alert Emails',
    files: [
      {
        id: 'alert-tmpl',
        name: 'Alert Email Template.msg',
        icon: '📧',
        meta: 'Last updated: 5 Jan 2026 · MSG',
        content: {
          title: 'Security Alert Email Template',
          sections: [
            {
              heading: 'When to use',
              body: 'Use this template when a security alert is triggered in the SIEM system and requires immediate notification to the client and internal stakeholders.',
            },
            {
              heading: 'Template fields',
              bullets: [
                'Subject: [SECURITY ALERT] — {Client Name} — {Alert Type}',
                'Severity level',
                'Alert description',
                'Affected systems',
                'Actions taken so far',
                'Next steps',
              ],
            },
          ],
        },
      },
      {
        id: 'siem',
        name: 'SIEM Alert Guide.pdf',
        icon: '📄',
        meta: 'Last updated: 10 Feb 2026 · PDF',
        content: {
          title: 'SIEM Alert Guide',
          sections: [
            {
              heading: 'Overview',
              body: 'This guide explains how to interpret SIEM alerts, classify their severity, and take the appropriate first-response action.',
            },
            {
              heading: 'Alert severity levels',
              bullets: [
                'Critical — immediate action required, notify shift lead',
                'High — investigate within 15 minutes',
                'Medium — investigate within 1 hour',
                'Low — log and review at end of shift',
              ],
            },
          ],
        },
      },
    ],
  },
]

// ── Document Viewer ──
function DocViewer({ file }) {
  if (!file) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full text-gray-300"
        style={{ minHeight: '400px' }}
      >
        <div className="text-5xl mb-4">📄</div>
        <div className="text-sm font-semibold">Select a document to preview</div>
        <div className="text-xs mt-1">Click any file from the left panel</div>
      </div>
    )
  }

  const { content, meta, name } = file

  return (
    <div>
      {/* Doc header */}
      <div
        className="flex items-end justify-between pb-3 mb-4"
        style={{ borderBottom: '2px solid #006DB7' }}
      >
        <div>
          <div className="text-base font-bold" style={{ color: '#004672' }}>
            {content.title}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{meta}</div>
        </div>
        <button
          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{
            background: 'white',
            color: '#006DB7',
            border: '1.5px solid #006DB7',
          }}
          onClick={() => alert('In the live app this opens the SharePoint document in a new tab.')}
        >
          ↗ Open in browser
        </button>
      </div>

      {/* Doc content */}
      <div className="space-y-5">
        {content.sections.map((s, i) => (
          <div key={i}>
            <h4
              className="text-xs font-bold uppercase tracking-wide mb-2"
              style={{ color: '#004672' }}
            >
              {s.heading}
            </h4>
            {s.body && (
              <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
                {s.body}
              </p>
            )}
            {s.bullets && (
              <ul className="space-y-1 pl-4">
                {s.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="text-sm leading-relaxed list-disc"
                    style={{ color: '#555' }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SOP Screen ──
export default function SOP() {
  const [activeCat,  setActiveCat]  = useState(CATEGORIES[0].id)
  const [activeFile, setActiveFile] = useState(CATEGORIES[0].files[0])

  const currentCat = CATEGORIES.find(c => c.id === activeCat)

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: '220px 1fr', alignItems: 'start' }}
    >
      {/* ── Left nav ── */}
      <div className="bg-white rounded-xl shadow-sm p-3">
        {CATEGORIES.map(cat => (
          <div key={cat.id}>
            {/* Category button */}
            <button
              onClick={() => {
                setActiveCat(cat.id)
                setActiveFile(cat.files[0])
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold mb-1 transition-colors"
              style={activeCat === cat.id
                ? { background: '#FFF3DD', color: '#7a5800' }
                : { color: '#666' }
              }
              onMouseEnter={e => {
                if (activeCat !== cat.id) e.currentTarget.style.background = '#F2F2F2'
              }}
              onMouseLeave={e => {
                if (activeCat !== cat.id) e.currentTarget.style.background = 'transparent'
              }}
            >
              {cat.label}
            </button>

            {/* File list — only show for active category */}
            {activeCat === cat.id && (
              <div
                className="mb-3 pb-3"
                style={{ borderBottom: '1px solid #F2F2F2' }}
              >
                {cat.files.map(file => (
                  <button
                    key={file.id}
                    onClick={() => setActiveFile(file)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors mb-0.5"
                    style={activeFile?.id === file.id
                      ? { background: '#DFF0FF', color: '#006DB7', fontWeight: 600 }
                      : { color: '#555' }
                    }
                    onMouseEnter={e => {
                      if (activeFile?.id !== file.id) e.currentTarget.style.background = '#F2F2F2'
                    }}
                    onMouseLeave={e => {
                      if (activeFile?.id !== file.id) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <span>{file.icon}</span>
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Right preview ── */}
      <div
        className="bg-white rounded-xl shadow-sm p-6"
        style={{ minHeight: '480px' }}
      >
        <DocViewer file={activeFile} />
      </div>
    </div>
  )
}
