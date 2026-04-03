'use client'

import { X, Play, CheckCircle } from 'lucide-react'

interface AdPreviewModalProps {
  open: boolean
  onClose: () => void
}

export function AdPreviewModal({ open, onClose }: AdPreviewModalProps) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#0f1629', border: '1px solid #1e2d4a' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1 rounded-lg hover:bg-[#1e2d4a]"
          >
            <X className="h-5 w-5" style={{ color: '#94a3b8' }} />
          </button>

          {/* Header */}
          <div
            className="text-center py-4 border-b"
            style={{ borderColor: '#1e2d4a' }}
          >
            <p className="text-sm font-bold text-white">BookieAI Rewards</p>
            style={{
              backgroundColor: '#080d1a',
              height: '160px',
              border: '1px solid #1e2d4a',
            }}
          >
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: 'rgba(59,130,246,0.2)', border: '2px solid #3b82f6' }}
            >
              <Play className="h-6 w-6" style={{ color: '#3b82f6' }} />
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
    </>
  )
}

// Completion state variant — used inline on the preview page
export function AdCompletionState() {
  return (
    <div
      className="rounded-2xl overflow-hidden w-full max-w-sm"
      style={{ backgroundColor: '#0f1629', border: '1px solid #1e2d4a' }}
    >
      {/* Header */}
      <div
        className="text-center py-4 border-b"
        style={{ borderColor: '#1e2d4a' }}
      >
        <p className="text-sm font-bold text-white">BookieAI Rewards</p>
      </div>

      <div className="flex flex-col items-center py-8 px-4">
        {/* Checkmark */}
        <div
          className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(16,185,129,0.15)', border: '2px solid #10b981' }}
        >
          <CheckCircle className="h-8 w-8" style={{ color: '#10b981' }} />
        </div>

        <div
          className="inline-block px-6 py-2 rounded-full text-2xl font-bold mb-3"
          style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
        >
          50 pts
        </div>

        <p className="text-base font-bold text-white mb-1">50 Bonus Points Added!</p>
        <p className="text-xs text-center mb-6" style={{ color: '#94a3b8' }}>
          Points added to your BookieAI wallet
        </p>

        <button
          className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          style={{ backgroundColor: '#10b981' }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
