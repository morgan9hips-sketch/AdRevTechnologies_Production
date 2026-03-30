'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type WaitlistEntry = {
  id: string
  name: string
  email: string
  company_name: string | null
  role: string | null
  website: string | null
  platform_type: string | null
  monthly_active_users: string | null
  interested_tier: string | null
  message: string | null
  how_did_you_hear: string | null
  status: 'pending' | 'contacted' | 'converted'
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  contacted: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  converted: 'bg-green-500/10 text-green-400 border border-green-500/20',
}

const STATUS_OPTIONS = ['pending', 'contacted', 'converted'] as const

export default function AdminWaitlistPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/waitlist')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Failed to load waitlist.')
        return
      }
      setEntries(data.entries)
    } catch {
      setError('Failed to load waitlist.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    setUpdateError('')
    try {
      const res = await fetch('/api/admin/waitlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) {
        const data = await res.json()
        setUpdateError(data?.error || 'Update failed.')
        return
      }
      setEntries(prev => prev.map(e => e.id === id ? { ...e, status: status as WaitlistEntry['status'] } : e))
    } catch {
      setUpdateError('Update failed.')
    } finally {
      setUpdating(null)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const filtered = filterStatus === 'all' ? entries : entries.filter(e => e.status === filterStatus)
  const counts = {
    all: entries.length,
    pending: entries.filter(e => e.status === 'pending').length,
    contacted: entries.filter(e => e.status === 'contacted').length,
    converted: entries.filter(e => e.status === 'converted').length,
  }

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
            <h1 className="text-2xl font-bold text-[#f1f5f9]">Waitlist — Admin</h1>
            <p className="text-sm text-[#94a3b8] mt-1">{entries.length} total signups</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchEntries}
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

        {updateError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center justify-between">
            <p className="text-red-400 text-sm">{updateError}</p>
            <button onClick={() => setUpdateError('')} className="text-red-400 hover:text-red-300 ml-4 text-xs">Dismiss</button>
          </div>
        )}

        {/* Status filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'contacted', 'converted'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#0f1629] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e2d4a]'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-[#0f1629] border border-[#1e2d4a] rounded-xl p-8 text-center">
            <p className="text-[#94a3b8]">No entries found.</p>
          </div>
        ) : (
          <div className="bg-[#0f1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2d4a] text-[#94a3b8]">
                    <th className="text-left px-4 py-3 font-medium">Name / Company</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Tier</th>
                    <th className="text-left px-4 py-3 font-medium">MAU</th>
                    <th className="text-left px-4 py-3 font-medium">Platform</th>
                    <th className="text-left px-4 py-3 font-medium">Signed Up</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry, i) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-[#1e2d4a]/50 hover:bg-[#080d1a]/40 transition-colors ${
                        i === filtered.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#f1f5f9]">{entry.name}</div>
                        {entry.company_name && (
                          <div className="text-[#94a3b8] text-xs mt-0.5">{entry.company_name}</div>
                        )}
                        {entry.role && (
                          <div className="text-[#94a3b8] text-xs">{entry.role}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${entry.email}`}
                          className="text-[#3b82f6] hover:underline"
                        >
                          {entry.email}
                        </a>
                        {entry.website && (
                          <div className="text-xs mt-0.5">
                            <a
                              href={entry.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#94a3b8] hover:text-[#f1f5f9]"
                            >
                              {entry.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-[#f1f5f9]">{entry.interested_tier || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">
                        {entry.monthly_active_users?.replace(/_/g, ' ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">
                        {entry.platform_type?.replace(/_/g, ' ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8] whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={entry.status}
                          disabled={updating === entry.id}
                          onChange={(e) => updateStatus(entry.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-md cursor-pointer outline-none ${STATUS_COLORS[entry.status]} bg-transparent disabled:opacity-50`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} className="bg-[#0f1629] text-[#f1f5f9]">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Message column — show on expansion or tooltip */}
        {filtered.some(e => e.message) && (
          <div className="mt-6 bg-[#0f1629] border border-[#1e2d4a] rounded-xl p-4">
            <h3 className="text-sm font-medium text-[#94a3b8] mb-3">Messages</h3>
            <div className="space-y-3">
              {filtered.filter(e => e.message).map(entry => (
                <div key={entry.id} className="flex gap-3 items-start">
                  <div className="text-xs text-[#94a3b8] whitespace-nowrap pt-0.5">{entry.name}:</div>
                  <div className="text-xs text-[#f1f5f9]">{entry.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
