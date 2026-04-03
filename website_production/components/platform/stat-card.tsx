import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changePositive?: boolean
  accent?: 'blue' | 'green' | 'amber'
  icon?: ReactNode
}

export function StatCard({
  title,
  value,
  change,
  changePositive,
  accent = 'blue',
  icon,
}: StatCardProps) {
  const accentColor =
    accent === 'green' ? '#10b981' : accent === 'amber' ? '#f59e0b' : '#3b82f6'

  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>
          {title}
        </p>
        {icon && (
          <span style={{ color: accentColor }}>{icon}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {change && (
        <p
          className="text-xs font-medium"
          style={{ color: changePositive ? '#10b981' : '#f87171' }}
        >
          {changePositive ? '▲' : '▼'} {change}
        </p>
      )}
    </div>
  )
}
