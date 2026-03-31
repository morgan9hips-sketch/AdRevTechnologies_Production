'use client'

import { useState } from 'react'
import Link from 'next/link'

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function RevenueCalculator() {
  const [mau, setMau] = useState(100000)
  const [impressionsPerUser, setImpressionsPerUser] = useState(2)
  const [ecpm, setEcpm] = useState(4.0)

  const monthlyRevenue = (mau * impressionsPerUser / 1000) * ecpm
  const annualRevenue = monthlyRevenue * 12

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#0f1629] border border-[#8b5cf6]/40 rounded-2xl p-8 shadow-[0_0_40px_-8px_rgba(139,92,246,0.2)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Monthly Active Users */}
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">
              Monthly Active Users
            </label>
            <input
              type="range"
              aria-label="Monthly Active Users"
              min={0}
              max={2000000}
              step={1000}
              value={mau}
              onChange={(e) => setMau(Number(e.target.value))}
              className="w-full accent-[#8b5cf6] mb-2"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94a3b8]">0</span>
              <span className="text-lg font-bold text-[#f1f5f9]">
                {mau.toLocaleString()}
              </span>
              <span className="text-xs text-[#94a3b8]">2,000,000</span>
            </div>
          </div>

          {/* Average Impressions Per User Per Month */}
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">
              Average Impressions Per User Per Month
            </label>
            <input
              type="range"
              aria-label="Average Impressions Per User Per Month"
              min={1}
              max={100}
              step={1}
              value={impressionsPerUser}
              onChange={(e) => setImpressionsPerUser(Number(e.target.value))}
              className="w-full accent-[#8b5cf6] mb-2"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94a3b8]">1</span>
              <span className="text-lg font-bold text-[#f1f5f9]">
                {impressionsPerUser}
              </span>
              <span className="text-xs text-[#94a3b8]">100</span>
            </div>
          </div>

          {/* eCPM */}
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">
              eCPM ($ per 1,000 impressions)
            </label>
            <input
              type="range"
              aria-label="eCPM dollars per 1000 impressions"
              min={1}
              max={30}
              step={0.5}
              value={ecpm}
              onChange={(e) => setEcpm(Number(e.target.value))}
              className="w-full accent-[#8b5cf6] mb-2"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94a3b8]">$1.00</span>
              <span className="text-lg font-bold text-[#f1f5f9]">
                ${ecpm.toFixed(2)}
              </span>
              <span className="text-xs text-[#94a3b8]">$30.00</span>
            </div>
          </div>
        </div>
        {/* Results */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-5 text-center">
            <div className="text-xs text-[#94a3b8] mb-1">
              Monthly Ad Revenue
            </div>
            <div className="text-2xl font-bold text-[#10b981]">
              {formatUSD(monthlyRevenue)}
            </div>
          </div>
          <div className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-5 text-center">
            <div className="text-xs text-[#94a3b8] mb-1">
              Annual Ad Revenue
            </div>
            <div className="text-2xl font-bold text-[#10b981]">
              {formatUSD(annualRevenue)}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/#waitlist"
            className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Talk to Us About Your Numbers →
          </Link>
        </div>
      </div>
    </div>
  )
}
