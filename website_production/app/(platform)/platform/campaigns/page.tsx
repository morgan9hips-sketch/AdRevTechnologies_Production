'use client'

import { useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { campaigns } from '@/lib/mock-platform-data'
import { CampaignModal } from '@/components/platform/campaign-modal'

function statusBadge(status: string) {
  if (status === 'active')
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#10b981]/15 text-[#10b981]">
        Active
      </span>
    )
  if (status === 'scheduled')
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#3b82f6]/15 text-[#3b82f6]">
        Scheduled
      </span>
    )
  return (
    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#1e2d4a] text-[#94a3b8]">
      Draft
    </span>
  )
}

function typeBadge(type: string) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: '#1e2d4a', color: '#94a3b8' }}
    >
      {type}
    </span>
  )
}

export default function CampaignsPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Campaigns</h2>
          <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
            {campaigns.filter((c) => c.status === 'active').length} active ·{' '}
            {campaigns.length} total
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          style={{ backgroundColor: '#3b82f6' }}
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      {/* Campaign cards */}
      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-xl border p-5 transition-colors hover:border-[#3b82f6]/30"
            style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="font-semibold text-white">{campaign.name}</h3>
                  {typeBadge(campaign.type)}
                  {statusBadge(campaign.status)}
                </div>

                {campaign.status !== 'draft' && campaign.startDate && (
                  <p className="text-xs mb-3" style={{ color: '#94a3b8' }}>
                    {campaign.startDate} → {campaign.endDate}
                  </p>
                )}

                {/* Metrics row */}
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: '#94a3b8' }}>
                      Impressions
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {campaign.impressions.toLocaleString() || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: '#94a3b8' }}>
                      Completions
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {campaign.completions.toLocaleString() || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: '#94a3b8' }}>
                      Revenue
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {campaign.revenue > 0 ? `$${campaign.revenue.toLocaleString()}` : '—'}
                    </p>
                  </div>
                  {campaign.conversionRate > 0 && (
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: '#94a3b8' }}>
                        Conv. Rate
                      </p>
                      <p className="text-sm font-semibold" style={{ color: '#10b981' }}>
                        {campaign.conversionRate}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Three-dot menu */}
              <div className="relative flex-shrink-0">
                <button
                  className="p-2 rounded-lg transition-colors hover:bg-[#1e2d4a]"
                  style={{ color: '#94a3b8' }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CampaignModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
