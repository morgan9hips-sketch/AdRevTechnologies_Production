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
      <div className="rounded-[28px] border border-[#c9d8e2]/75 bg-[linear-gradient(145deg,rgba(237,242,246,0.98),rgba(223,231,236,0.96)_62%,rgba(210,229,228,0.94))] p-8 shadow-[0_24px_80px_rgba(166,183,194,0.28)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Monthly Active Users */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#27455b]">
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
                className="w-24 rounded-md border border-[#9fb7c7] bg-white/75 px-2 py-1 text-center text-sm font-bold text-[#0d2f4a] focus:border-[#0d4568] focus:outline-none"
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
              className="mb-2 w-full accent-[#0d4568]"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#48657c]">0</span>
              <span className="text-lg font-bold text-[#0d2f4a]">
                {mau.toLocaleString()}
              </span>
              <span className="text-xs text-[#48657c]">2,000,000</span>
            </div>
          </div>

          {/* Daily Impressions Per User */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#27455b]">
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
                className="w-24 rounded-md border border-[#9fb7c7] bg-white/75 px-2 py-1 text-center text-sm font-bold text-[#0d2f4a] focus:border-[#0d4568] focus:outline-none"
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
              className="mb-2 w-full accent-[#0d4568]"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#48657c]">1</span>
              <span className="text-lg font-bold text-[#0d2f4a]">
                {impressionsPerUser}
              </span>
              <span className="text-xs text-[#48657c]">10</span>
            </div>
          </div>

          {/* eCPM */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#27455b]">
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
                className="w-24 rounded-md border border-[#9fb7c7] bg-white/75 px-2 py-1 text-center text-sm font-bold text-[#0d2f4a] focus:border-[#0d4568] focus:outline-none"
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
              className="mb-2 w-full accent-[#0d4568]"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#48657c]">$1.00</span>
              <span className="text-lg font-bold text-[#0d2f4a]">
                ${ecpm.toFixed(2)}
              </span>
              <span className="text-xs text-[#48657c]">$30.00</span>
            </div>
          </div>
        </div>
        {/* Results */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-[#c9d8e2] bg-white/65 p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]">
            <div className="mb-1 text-xs text-[#48657c]">
              Monthly Ad Revenue
            </div>
            <div className="text-2xl font-bold text-[#0d2f4a]">
              {formatUSD(monthlyRevenue)}
            </div>
          </div>
          <div className="rounded-xl border border-[#c9d8e2] bg-white/65 p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]">
            <div className="mb-1 text-xs text-[#48657c]">Annual Ad Revenue</div>
            <div className="text-2xl font-bold text-[#0d2f4a]">
              {formatUSD(annualRevenue)}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-[#0d4568] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#0b3854]"
          >
            Talk to Us About Your Numbers →
          </Link>
        </div>
      </div>
    </div>
  )
}
