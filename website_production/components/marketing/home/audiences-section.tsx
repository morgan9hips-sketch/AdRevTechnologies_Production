import { audienceCards } from '@/lib/site-content'

export function AudiencesSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            Built for operators
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Designed for platforms and agencies with real users.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
            The commercial model is built around scale, not feature gating. The
            operating model is built around speed, attribution, and deployment
            confidence.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {audienceCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[30px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,30,0.96),rgba(7,20,36,0.92))] p-7"
            >
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <ul className="mt-5 space-y-3">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm leading-7 text-[#d9e5f2]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
