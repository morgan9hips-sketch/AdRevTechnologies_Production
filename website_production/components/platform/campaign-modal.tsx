'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CampaignModalProps {
  open: boolean
  onClose: () => void
}

const campaignTypes = [
  'Video Ad',
  'Referral Engine',
  'Store Redirect',
  'WhatsApp Status',
  'Mailing Campaign',
  'Social Media',
]

const audienceOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'vip', label: 'VIP Users' },
  { value: 'inactive', label: 'Inactive 7+ Days' },
  { value: 'new', label: 'New Users' },
]

export function CampaignModal({ open, onClose }: CampaignModalProps) {
  const [form, setForm] = useState({
    name: '',
    type: 'Video Ad',
    rewardAmount: '',
    frequencyCap: '',
    startDate: '',
    endDate: '',
    audience: 'all',
    redirectUrl: '',
    activateImmediately: false,
  })

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col shadow-2xl"
        style={{ backgroundColor: '#0f1629', borderLeft: '1px solid #1e2d4a' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: '#1e2d4a' }}
        >
          <h2 className="text-lg font-semibold text-white">Create Campaign</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:bg-[#1e2d4a]"
          >
            <X className="h-5 w-5" style={{ color: '#94a3b8' }} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#f1f5f9' }}>
              Campaign Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Match Day Bonus — May"
              className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-[#94a3b8] border outline-none focus:border-[#3b82f6] transition-colors"
              style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
            />
          </div>

          {/* Campaign Type */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#f1f5f9' }}>
              Campaign Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-[#3b82f6] transition-colors"
              style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
            >
              {campaignTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Reward Amount */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#f1f5f9' }}>
              Reward Amount
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.rewardAmount}
                onChange={(e) => setForm({ ...form, rewardAmount: e.target.value })}
                placeholder="50"
                className="flex-1 rounded-lg px-3 py-2 text-sm text-white placeholder-[#94a3b8] border outline-none focus:border-[#3b82f6] transition-colors"
                style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
              />
              <span className="text-sm" style={{ color: '#94a3b8' }}>
                points
              </span>
            </div>
          </div>

          {/* Frequency Cap */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#f1f5f9' }}>
              Frequency Cap
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: '#94a3b8' }}>
                Max
              </span>
              <input
                type="number"
                value={form.frequencyCap}
                onChange={(e) => setForm({ ...form, frequencyCap: e.target.value })}
                placeholder="3"
                className="w-20 rounded-lg px-3 py-2 text-sm text-white placeholder-[#94a3b8] border outline-none focus:border-[#3b82f6] transition-colors"
                style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
              />
              <span className="text-sm" style={{ color: '#94a3b8' }}>
                ads per user per day
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#f1f5f9' }}>
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-[#3b82f6] transition-colors"
                style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#f1f5f9' }}>
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-[#3b82f6] transition-colors"
                style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
              />
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#f1f5f9' }}>
              Target Audience
            </label>
            <div className="space-y-2">
              {audienceOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="audience"
                    value={opt.value}
                    checked={form.audience === opt.value}
                    onChange={() => setForm({ ...form, audience: opt.value })}
                    className="accent-[#3b82f6]"
                  />
                  <span className="text-sm" style={{ color: '#f1f5f9' }}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Redirect URL */}
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
              placeholder="https://yourstore.com/offer"
              className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-[#94a3b8] border outline-none focus:border-[#3b82f6] transition-colors"
              style={{ backgroundColor: '#080d1a', borderColor: '#1e2d4a' }}
            />
          </div>

          {/* Activate immediately toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>
              Activate immediately
            </span>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, activateImmediately: !form.activateImmediately })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.activateImmediately ? 'bg-[#3b82f6]' : 'bg-[#1e2d4a]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.activateImmediately ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-3 px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: '#1e2d4a' }}
        >
          <button
            onClick={onClose}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium border transition-colors hover:bg-[#1e2d4a]"
            style={{ borderColor: '#1e2d4a', color: '#f1f5f9' }}
          >
            Save as Draft
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
            style={{ backgroundColor: '#3b82f6' }}
          >
            Create Campaign
          </button>
        </div>
      </div>
    </>
  )
}
