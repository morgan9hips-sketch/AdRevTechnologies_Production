'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type FoundingMember = {
  id: string
  name: string
  email: string
  paystack_reference: string | null
  amount: number | null
  currency: string | null
  status: string
  is_test: boolean
  founding_member_number: number
  created_at: string
}

export default function AdminFoundingMembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<FoundingMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hideTest, setHideTest] = useState(false)

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/founding-members')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Failed to load founding members.')
        return
      }
      setMembers(data.members)
    } catch {
      setError('Failed to load founding members.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const displayed = hideTest ? members.filter(m => !m.is_test) : members
  const realCount = members.filter(m => !m.is_test).length
  const testCount = members.filter(m => m.is_test).length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <p className="text-[#94a3b8]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080d1a] text-[#f1f5f9] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f5f9]">Founding Members — Admin</h1>
            <p className="text-sm text-[#94a3b8] mt-1">
              {realCount} real · {testCount} test
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMembers}
              className="text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors px-3 py-1.5 rounded-lg border border-[#1e2d4a] hover:border-[#3b82f6]"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-[#94a3b8] hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-[#1e2d4a]"
            >
              Log Out
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap items-center">
          <button
            onClick={() => setHideTest(false)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !hideTest
                ? 'bg-[#3b82f6] text-white'
                : 'bg-[#0f1629] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e2d4a]'
            }`}
          >
            All ({members.length})
          </button>
          <button
            onClick={() => setHideTest(true)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              hideTest
                ? 'bg-[#3b82f6] text-white'
                : 'bg-[#0f1629] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e2d4a]'
            }`}
          >
            Hide test payments ({realCount})
          </button>
        </div>

        {/* Table */}
        {displayed.length === 0 ? (
          <div className="bg-[#0f1629] border border-[#1e2d4a] rounded-xl p-8 text-center">
            <p className="text-[#94a3b8]">No founding members found.</p>
          </div>
        ) : (
          <div className="bg-[#0f1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2d4a] text-[#94a3b8]">
                    <th className="text-left px-4 py-3 font-medium">#</th>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Amount</th>
                    <th className="text-left px-4 py-3 font-medium">Reference</th>
                    <th className="text-left px-4 py-3 font-medium">Joined</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((member, i) => (
                    <tr
                      key={member.id}
                      className={`border-b border-[#1e2d4a]/50 hover:bg-[#080d1a]/40 transition-colors ${
                        i === displayed.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#f59e0b]">
                            #{member.founding_member_number}
                          </span>
                          {member.is_test && (
                            <span className="inline-block bg-[#6b7280]/20 border border-[#6b7280]/30 text-[#9ca3af] text-[10px] font-bold px-1.5 py-0.5 rounded">
                              TEST
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#f1f5f9]">
                        {member.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-[#3b82f6] hover:underline"
                        >
                          {member.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-[#f1f5f9]">
                        {member.amount != null && member.currency
                          ? member.currency === 'ZAR'
                            ? `R${(member.amount / 100).toFixed(2)}`
                            : `$${(member.amount / 100).toFixed(2)} ${member.currency}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8] font-mono text-xs">
                        {member.paystack_reference || '—'}
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8] whitespace-nowrap">
                        {new Date(member.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-2 py-0.5 rounded-md capitalize">
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
