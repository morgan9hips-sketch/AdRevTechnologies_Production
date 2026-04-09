import {
  Bolt,
  ChartNoAxesCombined,
  Shield,
  Sparkles,
  Waypoints,
} from 'lucide-react'
import { homeValuePoints } from '@/lib/site-content'

const icons = [Bolt, ChartNoAxesCombined, Waypoints, Shield, Sparkles]

export function ValueStrip() {
  return (
    <section className="px-6 py-6">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-5">
        {homeValuePoints.map((item, index) => {
          const Icon = icons[index]
          return (
            <div
              key={item}
              className="rounded-3xl border border-[#ff8a3d]/20 bg-white/[0.035] px-4 py-4 text-center text-sm text-[#d7e2ef] backdrop-blur-sm"
            >
              <div className="mb-3 inline-flex items-center justify-center rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/8 p-2 text-[#7ee7ff]">
                <Icon className="h-4 w-4" />
              </div>
              <p className="leading-6">{item}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
