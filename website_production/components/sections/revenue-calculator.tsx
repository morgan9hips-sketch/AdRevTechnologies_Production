'use client'

import { useState } from 'react'
import Link from 'next/link'

const REVENUE_SHARE = 10 // Fixed 10% — not configurable by user

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function RevenueCalculator() {
  const [mau, setMau] = useState(500000)
  const [sessionsPerDay, setSessionsPerDay] = useState(2)
  const [ecpm, setEcpm] = useState(4.0)

  const monthlyImpressions = mau * sessionsPerDay * 30
  const grossMonthlyRevenue = (monthlyImpressions / 1000) * ecpm
  const rewardCost = grossMonthlyRevenue * (REVENUE_SHARE / 100)
  const netMonthlyRevenue = grossMonthlyRevenue - rewardCost
  const annualRevenue = netMonthlyRevenue * 12

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
              min={1000}
              max={1000000}
              step={1000}
              value={mau}
              onChange={(e) => setMau(Number(e.target.value))}
              className="w-full accent-[#8b5cf6] mb-2"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94a3b8]">1,000</span>
              <span className="text-lg font-bold text-[#f1f5f9]">
                {mau.toLocaleString()}
              </span>
              <span className="text-xs text-[#94a3b8]">1,000,000</span>
            </div>
          </div>

          {/* Ad Sessions Per User Per Day */}
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">
              Ad Sessions Per User Per Day
            </label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={sessionsPerDay}
              onChange={(e) => setSessionsPerDay(Number(e.target.value))}
              className="w-full accent-[#8b5cf6] mb-2"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94a3b8]">1</span>
              <span className="text-lg font-bold text-[#f1f5f9]">
                {sessionsPerDay}
              </span>
              <span className="text-xs text-[#94a3b8]">10</span>
            </div>
          </div>

          {/* eCPM */}
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">
              eCPM ($ per 1,000 impressions)
            </label>
            <input
              type="range"
              min={1}
              max={20}
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
              <span className="text-xs text-[#94a3b8]">$20.00</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#94a3b8]/60 text-center mb-8">
          Revenue share fixed at 10% — returned to users as rewards
        </p>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-5 text-center">
            <div className="text-xs text-[#94a3b8] mb-1">Estimated Annual Revenue</div>
            <div className="text-2xl font-bold text-[#10b981]">
              {formatUSD(annualRevenue)}
            </div>
          </div>
          <div className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-5 text-center">
            <div className="text-xs text-[#94a3b8] mb-1">Monthly Gross Ad Revenue</div>
            <div className="text-2xl font-bold text-[#10b981]">
              {formatUSD(grossMonthlyRevenue)}
            </div>
          </div>
          <div className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-5 text-center">
            <div className="text-xs text-[#94a3b8] mb-1">Ad Rev Revenue Share (10%)</div>
            <div className="text-2xl font-bold text-[#f1f5f9]">
              {formatUSD(rewardCost)}
            </div>
          </div>
          <div className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-5 text-center">
            <div className="text-xs text-[#94a3b8] mb-1">Net Monthly to Platform</div>
            <div className="text-2xl font-bold text-[#10b981]">
              {formatUSD(netMonthlyRevenue)}
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
