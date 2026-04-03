'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { AdCompletionState } from '@/components/platform/ad-preview-modal'

function MockBettingApp() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-sm mx-auto"
      style={{ backgroundColor: '#111827', border: '1px solid #374151' }}
    >
      {/* App top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
      >
        {/* Logo placeholder */}
        <div className="flex items-center gap-2">
          <div
            className="rounded"
            style={{ width: '80px', height: '22px', backgroundColor: '#374151' }}
          />
          <span className="text-xs font-semibold text-white">SportsBet Pro</span>
        </div>
        {/* Nav */}
        <div className="flex gap-3 text-xs" style={{ color: '#9ca3af' }}>
          <span>Home</span>
          <span className="text-white font-medium">Live</span>
          <span>My Bets</span>
          <span>Wallet</span>
        </div>
      </div>

      {/* Live match card */}
      <div className="px-4 py-3">
        <div
          className="rounded-xl px-4 py-3 mb-3"
          style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{ color: '#10b981' }}>
              ● LIVE
            </span>
            <span className="text-xs" style={{ color: '#9ca3af' }}>
              {"67'"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Arsenal</span>
            <span className="text-xl font-bold text-white px-4">2 – 1</span>
            <span className="text-sm font-semibold text-white">Chelsea</span>
          </div>
        </div>

        {/* Bet slip */}
        <div className="text-xs font-semibold mb-2 text-white">Bet Slip</div>
        <div className="space-y-1.5 mb-3">
          {[
            { label: 'Arsenal Win', odds: '1.85' },
            { label: 'Over 2.5 Goals', odds: '1.65' },
          ].map((bet) => (
            <div
              key={bet.label}
              className="flex justify-between items-center rounded-lg px-3 py-2 text-xs"
              style={{ backgroundColor: '#1f2937', color: '#d1d5db' }}
            >
              <span>{bet.label}</span>
              <span className="font-semibold text-white">{bet.odds}</span>
            </div>
          ))}
        </div>

        {/* Ad Rev Widget — injected at bottom */}
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            backgroundColor: '#0f1629',
            border: '1px solid rgba(59,130,246,0.3)',
          }}
        >
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(59,130,246,0.15)', border: '1.5px solid #3b82f6' }}
          >
            <Play className="h-5 w-5" style={{ color: '#3b82f6' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white mb-0.5">
              Watch a 30s video — earn 50 bonus points
            </p>
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              Powered by SportsBet Pro Rewards
            </p>
          </div>
          <button
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors hover:bg-blue-600"
            style={{ backgroundColor: '#3b82f6' }}
          >
            Watch Now
          </button>
        </div>
      </div>
    </div>
  )
}

function AdExperienceSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start justify-items-center">
      {/* Before state */}
      <div className="w-full max-w-sm">
        <div
          className="text-center mb-3 text-xs font-semibold px-3 py-1 rounded-full inline-block"
          style={{ backgroundColor: '#1e2d4a', color: '#94a3b8' }}
        >
          Before completion
        </div>
        <div
          className="rounded-2xl overflow-hidden w-full"
          style={{ backgroundColor: '#0f1629', border: '1px solid #1e2d4a' }}
        >
          {/* Header */}
          <div
            className="text-center py-4 border-b"
            style={{ borderColor: '#1e2d4a' }}
          >
            <p className="text-sm font-bold text-white">SportsBet Pro Rewards</p>
          </div>

          {/* Video placeholder */}
          <div
            className="mx-4 mt-4 rounded-lg flex flex-col items-center justify-center"
            style={{
              backgroundColor: '#080d1a',
              height: '150px',
              border: '1px solid #1e2d4a',
            }}
          >
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center mb-2"
              style={{
                backgroundColor: 'rgba(59,130,246,0.2)',
                border: '2px solid #3b82f6',
              }}
            >
              <Play className="h-5 w-5" style={{ color: '#3b82f6' }} />
            </div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              30 second video
            </p>
          </div>

          {/* Progress bar */}
          <div className="mx-4 mt-3">
            <div
              className="w-full rounded-full h-1"
              style={{ backgroundColor: '#1e2d4a' }}
            >
              <div
                className="h-1 rounded-full"
                style={{ width: '0%', backgroundColor: '#3b82f6' }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="text-center px-4 pt-3 pb-2">
            <p className="text-sm font-medium text-white mb-2">
              Complete this video to earn 50 Bonus Points
            </p>
            <div
              className="inline-block px-4 py-1 rounded-full text-lg font-bold mb-2"
              style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
            >
              50 pts
            </div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              0 / 30 seconds
            </p>
          </div>

          {/* Skip */}
          <div className="text-center pb-4">
            <button
              disabled
              className="text-xs px-4 py-1.5 rounded-lg opacity-30 cursor-not-allowed"
              style={{ color: '#94a3b8', border: '1px solid #1e2d4a' }}
            >
              Skip available in 30s
            </button>
          </div>
        </div>
      </div>

      {/* After state */}
      <div className="w-full max-w-sm">
        <div
          className="text-center mb-3 text-xs font-semibold px-3 py-1 rounded-full inline-block"
          style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' }}
        >
          After completion
        </div>
        <AdCompletionState />
      </div>
    </div>
  )
}

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState<'host' | 'user'>('host')

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Platform Blend Preview</h2>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
          See exactly how Ad Rev integrates into your app — invisible to your users, powerful
          for your business.
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex rounded-xl p-1 gap-1 w-fit"
        style={{ backgroundColor: '#0f1629', border: '1px solid #1e2d4a' }}
      >
        <button
          onClick={() => setActiveTab('host')}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={
            activeTab === 'host'
              ? { backgroundColor: '#3b82f6', color: '#fff' }
              : { color: '#94a3b8' }
          }
        >
          SportsBet Pro — Host App View
        </button>
        <button
          onClick={() => setActiveTab('user')}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={
            activeTab === 'user'
              ? { backgroundColor: '#3b82f6', color: '#fff' }
              : { color: '#94a3b8' }
          }
        >
          End User Ad Experience
        </button>
      </div>

      {/* Tab 1 — Host App View */}
      {activeTab === 'host' && (
        <div>
          <MockBettingApp />
          <div
            className="mt-6 rounded-xl border p-5 text-center"
            style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
          >
            <p className="text-base font-semibold text-white mb-1">
              Your brand on every touchpoint.
            </p>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              {`Users never see "Ad Rev". The engine is ours. The experience is yours.`}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2 — End User Ad Experience */}
      {activeTab === 'user' && (
        <div>
          <AdExperienceSection />
          <div
            className="mt-6 rounded-xl border p-5"
            style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
          >
            <p className="text-sm font-semibold text-white mb-1">Technical note</p>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              Ad completion is verified server-side. Reward event fires via webhook to your
              loyalty system. Users cannot game the system.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
