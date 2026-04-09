import { howItWorksSteps } from '@/lib/site-content'

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            One integration. Every monetisation motion.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
            Most platforms do not need more users. They need better
            infrastructure.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {howItWorksSteps.map((step) => (
            <div
              key={step.step}
              className="rounded-[30px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,13,24,0.94),rgba(7,19,34,0.88))] p-7"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ffb36e]">
                {step.step}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#afc4dd]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
