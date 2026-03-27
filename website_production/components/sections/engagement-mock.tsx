'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, ChevronLeft, ChevronRight, ShoppingBag, Star, CheckCircle, FileText } from 'lucide-react'

const slides = [
  {
    id: 1,
    label: 'Step 1 of 4',
    title: 'Ad Plays Inside Partner App',
    description: "Rewarded video renders natively inside the partner's branded platform. No iFrame. No redirect. Your brand, our engine.",
    badge: 'FEATURED OFFER',
    badgeColor: 'text-[#3b82f6]',
    content: 'video',
  },
  {
    id: 2,
    label: 'Step 2 of 4',
    title: 'Ad Completes — Store Redirect Fires',
    description: "On verified completion, the user is redirected to the partner's store or product page with a discount tied to the campaign.",
    badge: 'AD COMPLETE',
    badgeColor: 'text-[#10b981]',
    content: 'redirect',
  },
  {
    id: 3,
    label: 'Step 3 of 4',
    title: 'Loyalty Points Credited',
    description: "The partner's system receives the webhook and credits loyalty points to the user's account in real time. Ad Rev never touches the balance.",
    badge: 'REWARD CREDITED',
    badgeColor: 'text-[#10b981]',
    content: 'points',
  },
  {
    id: 4,
    label: 'Step 4 of 4',
    title: 'Audit Log Entry Created',
    description: 'Every event is recorded: ad watched, points allocated, user redirected, timestamp, and webhook delivery status — immutable and auditable.',
    badge: 'AUDIT TRAIL',
    badgeColor: 'text-[#94a3b8]',
    content: 'audit',
  },
]

function SlideContent({ content }: { content: string }) {
  if (content === 'video') {
    return (
      <div className="relative bg-[#080d1a] rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-[#1e2d4a]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#1e2d4a] flex items-center justify-center">
            <Play className="h-5 w-5 text-[#f1f5f9] ml-0.5" />
          </div>
          <span className="text-xs text-[#94a3b8]">Ad playing...</span>
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <span className="text-[10px] text-[#94a3b8] bg-[#080d1a]/80 px-2 py-0.5 rounded">
            Sponsored · 0:15
          </span>
        </div>
      </div>
    )
  }

  if (content === 'redirect') {
    return (
      <div className="bg-[#080d1a] border border-[#10b981]/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-[#10b981]" />
          <span className="text-sm font-medium text-[#10b981]">Ad verified complete</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          <ShoppingBag className="h-4 w-4" />
          <span>Redirecting to store with 15% discount...</span>
        </div>
        <div className="w-full h-1.5 bg-[#1e2d4a] rounded-full">
          <div className="w-3/4 h-1.5 bg-[#10b981] rounded-full" />
        </div>
      </div>
    )
  }

  if (content === 'points') {
    return (
      <div className="bg-[#080d1a] border border-[#10b981]/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-[#10b981]" />
          <span className="text-sm font-medium text-[#f1f5f9]">Points credited to account</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#94a3b8]">ShopPoints balance</span>
          <span className="text-lg font-bold text-[#10b981]">+50</span>
        </div>
        <div className="text-[10px] text-[#94a3b8]/60">
          Webhook delivered · 12ms
        </div>
      </div>
    )
  }

  if (content === 'audit') {
    return (
      <div className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-[#94a3b8]" />
          <span className="text-xs font-medium text-[#94a3b8]">Event Log Entry</span>
        </div>
        {[
          { key: 'event', value: 'ad_completed' },
          { key: 'points', value: '50' },
          { key: 'webhook', value: 'delivered' },
          { key: 'status', value: 'immutable' },
        ].map(({ key, value }) => (
          <div key={key} className="flex justify-between text-[10px]">
            <span className="text-[#94a3b8]">{key}</span>
            <span className="text-[#f1f5f9] font-mono">{value}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export function EngagementMock() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(goToNext, 3000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, goToNext])

  const handlePrev = useCallback(() => {
    setIsAutoPlaying(false)
    goToPrev()
  }, [goToPrev])

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false)
    goToNext()
  }, [goToNext])

  const handleDotClick = useCallback((index: number) => {
    setIsAutoPlaying(false)
    setCurrentSlide(index)
  }, [])

  const slide = slides[currentSlide]

  return (
    <div className="flex justify-center">
      <div className="w-80 bg-[#0f1629] border-2 border-[#1e2d4a] rounded-3xl overflow-hidden shadow-2xl">
        {/* Slide Header */}
        <div className="bg-[#080d1a] border-b border-[#1e2d4a] px-4 py-3 flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${slide.badgeColor}`}>
            {slide.badge}
          </span>
          <span className="text-[10px] text-[#94a3b8]">{slide.label}</span>
        </div>

        {/* Content Area */}
        <div className="px-4 py-4 space-y-4">
          <h3 className="text-sm font-semibold text-[#f1f5f9]">{slide.title}</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">{slide.description}</p>
          <SlideContent content={slide.content} />
        </div>

        {/* Navigation */}
        <div className="px-4 py-3 border-t border-[#1e2d4a] flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-[#1e2d4a] flex items-center justify-center hover:bg-[#3b82f6]/20 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-[#94a3b8]" />
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentSlide ? 'bg-[#3b82f6]' : 'bg-[#1e2d4a]'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-[#1e2d4a] flex items-center justify-center hover:bg-[#3b82f6]/20 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-[#94a3b8]" />
          </button>
        </div>
      </div>
    </div>
  )
}
