'use client'

import { useState } from 'react'
import { MessageCircle, Mail, Share2, X, Plus } from 'lucide-react'
import { marketingAutomations } from '@/lib/mock-platform-data'

const channelConfig: Record<
  string,
  { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>, label: string, color: string }
> = {
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: '#25D366' },
  email: { icon: Mail, label: 'Email', color: '#3b82f6' },
  social: { icon: Share2, label: 'Social Media', color: '#8b5cf6' },
}

function ChannelIcon({ channel }: { channel: string }) {
  const cfg = channelConfig[channel] ?? channelConfig.email
  const Icon = cfg.icon
  return <Icon className="h-4 w-4" style={{ color: cfg.color }} />
}

function AutomationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    name: '',
    channel: 'whatsapp',
    trigger: 'After ad completion',
    message: '',
    redirectUrl: '',
  })

  const triggers = [
    'After ad completion',
    'After referral',
    'User inactive 7 days',
    'Scheduled',
    'Match day',
  ]

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-xl shadow-2xl"
          style={{ backgroundColor: '#0f1629', border: '1px solid #1e2d4a' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: '#1e2d4a' }}
          >
            <h2 className="text-base font-semibold text-white">Create Automation</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1e2d4a]">
              <X className="h-5 w-5" style={{ color: '#94a3b8' }} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#f1f5f9' }}>
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Post-Win Celebration"
                className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-[#94a3b8] border outline-none focus:border-[#3b82f6]"
                style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#f1f5f9' }}
                >
                  Channel
                </label>
                <select
                  value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-[#3b82f6]"
                  style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="social">Social Media</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#f1f5f9' }}
                >
                  Trigger
                </label>
                <select
                  value={form.trigger}
                  onChange={(e) => setForm({ ...form, trigger: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-[#3b82f6]"
                  style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
                >
                  {triggers.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#f1f5f9' }}>
                Message / Content
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your message here..."
                rows={3}
                className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-[#94a3b8] border outline-none focus:border-[#3b82f6] resize-none"
                style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#f1f5f9' }}>
                Redirect URL{' '}
                <span className="font-normal" style={{ color: '#94a3b8' }}>
                  (optional)
                </span>
              </label>
              <input
                type="url"
                value={form.redirectUrl}
                onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
                placeholder="https://yourstore.com/promo"
                className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-[#94a3b8] border outline-none focus:border-[#3b82f6]"
                style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
              />
            </div>
          </div>

          <div
            className="px-6 py-4 border-t"
            style={{ borderColor: '#1e2d4a' }}
          >
            <button
              onClick={onClose}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
              style={{ backgroundColor: '#3b82f6' }}
            >
              Save Automation
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function MarketingPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [automations, setAutomations] = useState(marketingAutomations)

  function toggleAutomation(id: string) {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
      )
    )
  }

  // Channel overview cards
  const channelCards = [
    {
      key: 'whatsapp',
      label: 'WhatsApp Status',
      Icon: MessageCircle,
      color: '#25D366',
      active: 2,
      lastSent: '2 hours ago',
      next: 'Continuous',
    },
    {
      key: 'email',
      label: 'Mailing Campaigns',
      Icon: Mail,
      color: '#3b82f6',
      active: 1,
      lastSent: '3 days ago',
      next: 'Apr 7, 09:00',
    },
    {
      key: 'social',
      label: 'Social Media',
      Icon: Share2,
      color: '#8b5cf6',
      active: 1,
      lastSent: '1 day ago',
      next: 'Apr 5, 15:00',
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Marketing Hub</h2>
          <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
            Automate outreach across WhatsApp, email, and social media
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          style={{ backgroundColor: '#3b82f6' }}
        >
          <Plus className="h-4 w-4" />
          Create Automation
        </button>
      </div>

      {/* Channel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {channelCards.map((ch) => {
          const Icon = ch.Icon
          return (
            <div
              key={ch.key}
              className="rounded-xl border p-5"
              style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${ch.color}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: ch.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{ch.label}</p>
                  <p className="text-xs" style={{ color: ch.color }}>
                    {ch.active} active automation{ch.active !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-xs" style={{ color: '#94a3b8' }}>
                <p>Last sent: {ch.lastSent}</p>
                <p>Next: {ch.next}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Automation list */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1e2d4a' }}>
          <h3 className="text-sm font-semibold text-white">All Automations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #1e2d4a' }}>
                {['Name', 'Channel', 'Trigger', 'Status', 'Sent', 'Last Sent', 'Next', ''].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-medium"
                      style={{ color: '#94a3b8' }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {automations.map((a) => {
                const cfg = channelConfig[a.channel] ?? channelConfig.email
                const Icon = cfg.icon
                return (
                  <tr
                    key={a.id}
                    className="transition-colors hover:bg-[#1e2d4a]/30"
                    style={{ borderBottom: '1px solid #1e2d4a' }}
                  >
                    <td className="px-5 py-3 font-medium text-white">{a.name}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
                        <span style={{ color: '#94a3b8' }}>{cfg.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3" style={{ color: '#94a3b8' }}>
                      {a.trigger}
                    </td>
                    <td className="px-5 py-3">
                      {a.status === 'active' ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#10b981]/15 text-[#10b981]">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#f59e0b]/15 text-[#f59e0b]">
                          Paused
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-white">{a.sent.toLocaleString()}</td>
                    <td className="px-5 py-3" style={{ color: '#94a3b8' }}>
                      {a.lastSent}
                    </td>
                    <td className="px-5 py-3" style={{ color: '#94a3b8' }}>
                      {a.nextScheduled}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => toggleAutomation(a.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          a.status === 'active' ? 'bg-[#10b981]' : 'bg-[#1e2d4a]'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            a.status === 'active' ? 'translate-x-4' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AutomationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
