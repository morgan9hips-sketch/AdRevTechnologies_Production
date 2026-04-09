'use client'

import { useState } from 'react'

type RequestAccessFormData = {
  name: string
  email: string
  company_name: string
  role: string
  website: string
  platform_type: string
  monthly_active_users: string
  interested_tier: string
  message: string
  how_did_you_hear: string
}

interface RequestAccessFormProps {
  id?: string
  title: string
  description: string
  submitLabel?: string
}

const initialState: RequestAccessFormData = {
  name: '',
  email: '',
  company_name: '',
  role: '',
  website: '',
  platform_type: '',
  monthly_active_users: '',
  interested_tier: '',
  message: '',
  how_did_you_hear: '',
}

export function RequestAccessForm({
  id = 'request-access',
  title,
  description,
  submitLabel = 'Request Access',
}: RequestAccessFormProps) {
  const [form, setForm] = useState<RequestAccessFormData>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(
          (data as { error?: string }).error ||
            'Unable to submit your request right now.',
        )
      }

      setSubmitted(true)
      setForm(initialState)
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to submit your request right now.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(170deg,rgba(5,11,25,0.98),rgba(8,21,40,0.96))] px-6 py-8 shadow-[0_22px_90px_rgba(0,212,255,0.12)] sm:px-8 sm:py-10"
    >
      <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-[#1d4ed8]/20 blur-3xl" />
      <div className="absolute -right-12 bottom-0 h-36 w-36 rounded-full bg-[#00d4ff]/16 blur-3xl" />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
            Request access
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-[#b5c8df]">
            {description}
          </p>
        </div>

        {submitted ? (
          <div className="rounded-[28px] border border-[#00d4ff]/25 bg-[#00d4ff]/10 p-8 text-center">
            <p className="text-lg font-semibold text-white">
              Your access request is in.
            </p>
            <p className="mt-3 text-sm text-[#cce8f2]">
              We have your details and will follow up within 24 to 48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-5 lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
              <Field label="Your name" required htmlFor="request-name">
                <input
                  id="request-name"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Jane Smith"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white placeholder:text-[#5f7893] focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
                />
              </Field>

              <Field label="Work email" required htmlFor="request-email">
                <input
                  id="request-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="jane@company.com"
                  className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white placeholder:text-[#5f7893] focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
                />
              </Field>
            </div>

            <Field label="Company" required htmlFor="request-company">
              <input
                id="request-company"
                required
                value={form.company_name}
                onChange={(event) =>
                  setForm({ ...form, company_name: event.target.value })
                }
                placeholder="Acme Growth"
                className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white placeholder:text-[#5f7893] focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
              />
            </Field>

            <Field label="Role" required htmlFor="request-role">
              <input
                id="request-role"
                required
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value })
                }
                placeholder="Founder, CTO, Growth Lead"
                className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white placeholder:text-[#5f7893] focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
              />
            </Field>

            <Field label="Company website" htmlFor="request-website">
              <input
                id="request-website"
                type="url"
                value={form.website}
                onChange={(event) =>
                  setForm({ ...form, website: event.target.value })
                }
                placeholder="https://yourcompany.com"
                className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white placeholder:text-[#5f7893] focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
              />
            </Field>

            <Field
              label="Business type"
              required
              htmlFor="request-business-type"
            >
              <select
                id="request-business-type"
                title="Business type"
                required
                value={form.platform_type}
                onChange={(event) =>
                  setForm({ ...form, platform_type: event.target.value })
                }
                className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
              >
                <option value="" disabled>
                  Select business type
                </option>
                <option value="platform_operator">Platform operator</option>
                <option value="digital_agency">Digital agency</option>
                <option value="ecommerce">Retail and ecommerce</option>
                <option value="gaming">Gaming platform</option>
                <option value="fintech">Fintech and wallets</option>
                <option value="sports_betting">Sports betting</option>
                <option value="telecoms">Telecoms</option>
                <option value="loyalty">Loyalty program</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Monthly active users" required htmlFor="request-mau">
              <select
                id="request-mau"
                title="Monthly active users"
                required
                value={form.monthly_active_users}
                onChange={(event) =>
                  setForm({ ...form, monthly_active_users: event.target.value })
                }
                className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
              >
                <option value="" disabled>
                  Select MAU band
                </option>
                <option value="0_500k">0 to 500K</option>
                <option value="500k_1_5m">500K to 1.5M</option>
                <option value="1_5m_3m">1.5M to 3M</option>
                <option value="3m_plus">3M+</option>
              </select>
            </Field>

            <Field
              label="Pricing band of interest"
              required
              htmlFor="request-band"
            >
              <select
                id="request-band"
                title="Pricing band of interest"
                required
                value={form.interested_tier}
                onChange={(event) =>
                  setForm({ ...form, interested_tier: event.target.value })
                }
                className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
              >
                <option value="" disabled>
                  Select pricing band
                </option>
                <option value="founding_partner_0_500k">
                  Founding Partner Early Access · 0 to 500K MAU
                </option>
                <option value="growth_500k_1_5m">500K to 1.5M MAU</option>
                <option value="scale_1_5m_3m">1.5M to 3M MAU</option>
                <option value="custom_3m_plus">3M+ custom partnership</option>
              </select>
            </Field>

            <Field label="How did you hear about us?" htmlFor="request-source">
              <select
                id="request-source"
                title="How did you hear about us?"
                value={form.how_did_you_hear}
                onChange={(event) =>
                  setForm({ ...form, how_did_you_hear: event.target.value })
                }
                className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
              >
                <option value="">Select an option</option>
                <option value="search">Search</option>
                <option value="social_media">Social media</option>
                <option value="referral">Referral</option>
                <option value="conference">Conference or event</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field
              label="What are you trying to launch?"
              htmlFor="request-message"
              className="lg:col-span-2"
            >
              <textarea
                id="request-message"
                rows={4}
                maxLength={1000}
                value={form.message}
                onChange={(event) =>
                  setForm({ ...form, message: event.target.value })
                }
                placeholder="Tell us about your platform, clients, commercial goals, or deployment timeline."
                className="w-full rounded-2xl border border-white/10 bg-[#07121f] px-4 py-3 text-sm text-white placeholder:text-[#5f7893] focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]"
              />
            </Field>

            {error && (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200 lg:col-span-2">
                {error}
              </div>
            )}

            <div className="lg:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#8aa7c7]">
                Submit once. We will review your fit, pricing band, and
                onboarding path.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#05131d] transition hover:bg-[#76ebff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Submitting...' : submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

interface FieldProps {
  children: React.ReactNode
  label: string
  htmlFor: string
  required?: boolean
  className?: string
}

function Field({
  children,
  label,
  htmlFor,
  required = false,
  className = '',
}: FieldProps) {
  return (
    <label className={className} htmlFor={htmlFor}>
      <span className="mb-2 block text-sm font-medium text-[#b7cae2]">
        {label}
        {required && <span className="ml-1 text-[#ff8a3d]">*</span>}
      </span>
      {children}
    </label>
  )
}
