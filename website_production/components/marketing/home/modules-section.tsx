import {
  BarChart3,
  Mail,
  MessageSquareShare,
  PlaySquare,
  Share2,
} from 'lucide-react'
import { productModules } from '@/lib/site-content'

const moduleIcons = [PlaySquare, Share2, MessageSquareShare, Mail, BarChart3]

export function ModulesSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            Product modules
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Replace fragmented systems with one operating layer.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {productModules.map((module, index) => {
            const Icon = moduleIcons[index]
            return (
              <div
                key={module.title}
                className="rounded-[28px] border border-[#ff8a3d]/20 bg-white/[0.03] p-6 text-center"
              >
                <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-[#00d4ff]/10 p-3 text-[#7ee7ff]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {module.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#a9bfd7]">
                  {module.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
