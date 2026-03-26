import { Play } from 'lucide-react'

export function EngagementMock() {
  return (
    <div className="flex justify-center">
      <div className="w-80 bg-[#0f1629] border-2 border-[#1e2d4a] rounded-3xl overflow-hidden shadow-2xl">
        {/* App Header Bar */}
        <div className="bg-[#080d1a] border-b border-[#1e2d4a] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#3b82f6] flex items-center justify-center">
              <span className="text-white text-xs font-bold">SR</span>
            </div>
            <span className="text-[#f1f5f9] font-semibold text-sm">ShopRewards</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1e2d4a] flex items-center justify-center">
            <span className="text-[#94a3b8] text-xs font-medium">JD</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 py-4 space-y-4">
          {/* Featured Offer Label */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#3b82f6] uppercase tracking-wider">
              Featured Offer
            </span>
          </div>

          {/* Video Ad Placeholder */}
          <div className="relative bg-[#080d1a] rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-[#1e2d4a]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#1e2d4a] flex items-center justify-center">
                <Play className="h-5 w-5 text-[#f1f5f9] ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <span className="text-[10px] text-[#94a3b8] bg-[#080d1a]/80 px-2 py-0.5 rounded">
                Sponsored · 0:15
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-[#94a3b8] mb-1">
              <span>Progress</span>
              <span>70%</span>
            </div>
            <div className="w-full h-1.5 bg-[#1e2d4a] rounded-full">
              <div className="w-[70%] h-1.5 bg-[#3b82f6] rounded-full" />
            </div>
          </div>

          {/* Reward Notification */}
          <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-[#10b981] text-lg">★</span>
            <span className="text-[#10b981] text-xs font-medium">
              Complete to earn 50 ShopPoints
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 py-2 text-sm font-medium text-[#94a3b8] border border-[#1e2d4a] rounded-lg hover:border-[#3b82f6] transition-colors">
              Skip
            </button>
            <button className="flex-1 py-2 text-sm font-medium text-white bg-[#3b82f6] rounded-lg hover:bg-[#2563eb] transition-colors">
              Watch & Earn
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#1e2d4a] text-center">
          <span className="text-[10px] text-[#94a3b8]/60">
            Powered by Ad Rev Technologies
          </span>
        </div>
      </div>
    </div>
  )
}
