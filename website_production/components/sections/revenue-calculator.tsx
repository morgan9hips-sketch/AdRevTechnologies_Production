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

  const monthlyRevenue = ((mau * impressionsPerUser * 30) / 1000) * ecpm
  const annualRevenue = monthlyRevenue * 12

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#0f1629] border border-[#8b5cf6]/40 rounded-2xl p-8 shadow-[0_0_40px_-8px_rgba(139,92,246,0.2)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Monthly Active Users */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#94a3b8]">
                Monthly Active Users
              </label>
              <input
                type="number"
                aria-label="Monthly Active Users number input"
                min={0}
                max={2000000}
                step={1000}
                value={mau}
                onChange={(e) => setMau(Number(e.target.value) || 0)}
                onBlur={(e) =>
                  setMau(Math.min(2000000, Math.max(0, Number(e.target.value))))
                }
                className="w-24 bg-[#080d1a] border border-[#1e2d4a] text-[#22d3ee] font-bold text-sm rounded-md px-2 py-1 text-center focus:border-[#8b5cf6] focus:outline-none"
              />
            </div>
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
              <span className="text-lg font-bold text-[#22d3ee]">
                {mau.toLocaleString()}
              </span>
              <span className="text-xs text-[#94a3b8]">2,000,000</span>
            </div>
          </div>

          {/* Daily Impressions Per User */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#94a3b8]">
                Daily Impressions Per User
              </label>
              <input
                type="number"
                aria-label="Daily Impressions Per User number input"
                min={1}
                max={10}
                step={1}
                value={impressionsPerUser}
                onChange={(e) =>
                  setImpressionsPerUser(Number(e.target.value) || 1)
                }
                onBlur={(e) =>
                  setImpressionsPerUser(
                    Math.min(10, Math.max(1, Number(e.target.value))),
                  )
                }
                className="w-24 bg-[#080d1a] border border-[#1e2d4a] text-[#22d3ee] font-bold text-sm rounded-md px-2 py-1 text-center focus:border-[#8b5cf6] focus:outline-none"
              />
            </div>
            <input
              type="range"
              aria-label="Daily Impressions Per User"
              min={1}
              max={10}
              step={1}
              value={impressionsPerUser}
              onChange={(e) => setImpressionsPerUser(Number(e.target.value))}
              className="w-full accent-[#8b5cf6] mb-2"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94a3b8]">1</span>
              <span className="text-lg font-bold text-[#22d3ee]">
                {impressionsPerUser}
              </span>
              <span className="text-xs text-[#94a3b8]">10</span>
            </div>
          </div>

          {/* eCPM */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#94a3b8]">
                eCPM ($ per 1,000 impressions)
              </label>
              <input
                type="number"
                aria-label="eCPM number input"
                min={1}
                max={30}
                step={0.5}
                value={ecpm}
                onChange={(e) => setEcpm(Number(e.target.value) || 1)}
                onBlur={(e) =>
                  setEcpm(Math.min(30, Math.max(1, Number(e.target.value))))
                }
                className="w-24 bg-[#080d1a] border border-[#1e2d4a] text-[#22d3ee] font-bold text-sm rounded-md px-2 py-1 text-center focus:border-[#8b5cf6] focus:outline-none"
              />
            </div>
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
              <span className="text-lg font-bold text-[#22d3ee]">
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
            <div className="text-xs text-[#94a3b8] mb-1">Annual Ad Revenue</div>
            <div className="text-2xl font-bold text-[#10b981]">
              {formatUSD(annualRevenue)}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Talk to Us About Your Numbers →
          </Link>
        </div>
      </div>
    </div>
  )
}
