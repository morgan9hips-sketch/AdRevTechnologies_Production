'use client'

import { X, Play, CheckCircle } from 'lucide-react'

interface AdPreviewModalProps {
  open: boolean
  onClose: () => void
}

export function AdPreviewModal({ open, onClose }: AdPreviewModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#1e2d4a] bg-[#0f1629] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1 rounded-lg hover:bg-[#1e2d4a]"
          aria-label="Close preview"
          title="Close preview"
        >
          <X className="h-5 w-5 text-[#94a3b8]" />
        </button>

        {/* Header */}
        <div className="border-b border-[#1e2d4a] py-4 text-center">
          <p className="text-sm font-bold text-white">BookieAI Rewards</p>
        </div>

        {/* Video placeholder */}
        <div className="mx-4 mt-4 flex h-40 flex-col items-center justify-center rounded-lg border border-[#1e2d4a] bg-[#080d1a]">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#3b82f6] bg-[#3b82f6]/20">
            <Play className="h-6 w-6 text-[#3b82f6]" />
          </div>
          <p className="text-xs text-[#94a3b8]">30 second video</p>
        </div>

        {/* Progress bar */}
        <div className="mx-4 mt-3">
          <div className="h-1 w-full rounded-full bg-[#1e2d4a]">
            <div className="h-1 w-0 rounded-full bg-[#3b82f6]" />
          </div>
        </div>

        {/* Info */}
        <div className="text-center px-4 pt-3 pb-2">
          <p className="text-sm font-medium text-white mb-2">
            Complete this video to earn 50 Bonus Points
          </p>
          <div className="mb-2 inline-block rounded-full bg-[#f59e0b]/15 px-4 py-1 text-lg font-bold text-[#f59e0b]">
            50 pts
          </div>
          <p className="text-xs text-[#94a3b8]">0 / 30 seconds</p>
        </div>

        {/* Skip */}
        <div className="text-center pb-4">
          <button
            disabled
            className="cursor-not-allowed rounded-lg border border-[#1e2d4a] px-4 py-1.5 text-xs text-[#94a3b8] opacity-30"
          >
            Skip available in 30s
          </button>
        </div>
      </div>
    </div>
  )
}

// Completion state variant — used inline on the preview page
export function AdCompletionState() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
      {/* Header */}
      <div className="bg-[#16a34a] px-4 py-3">
        <p className="text-center text-sm font-bold text-white">
          BookieAI Rewards
        </p>
      </div>

      <div className="flex flex-col items-center py-8 px-4">
        {/* Checkmark */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#10b981] bg-[#10b981]/15">
          <CheckCircle className="h-8 w-8 text-[#10b981]" />
        </div>

        <div className="mb-3 inline-block rounded-full bg-[#f59e0b]/15 px-6 py-2 text-2xl font-bold text-[#f59e0b]">
          50 pts
        </div>

        <p className="mb-1 text-base font-bold text-[#0f172a]">
          50 Bonus Points Added!
        </p>
        <p className="mb-6 text-center text-xs text-[#64748b]">
          Points added to your BookieAI wallet
        </p>

        <button className="w-full rounded-lg bg-[#16a34a] py-2.5 text-sm font-semibold text-white transition-colors">
          Continue
        </button>
      </div>
    </div>
  )
}
