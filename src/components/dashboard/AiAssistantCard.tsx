import { Check, Mail, Sparkles } from 'lucide-react'

const FEATURES = [
  'Natural-language equipment queries',
  'Predictive fault recommendations',
  'Automated work-order drafts',
]

export function AiAssistantCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-5 text-white shadow-card">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-white/15">
            <Sparkles className="size-4" strokeWidth={2} />
          </span>
          <div>
            <p className="text-sm font-bold">ThermalOps AI Assistant</p>
            <p className="text-[11px] text-blue-100">Ops copilots for facilities teams</p>
          </div>
        </div>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
          Coming Soon
        </span>
      </div>

      <ul className="space-y-2">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-[12px] text-blue-50">
            <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-300" strokeWidth={2.4} />
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-4 inline-flex h-10 w-full cursor-default items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-blue-700"
        title="Planned for a later milestone"
      >
        <Mail className="size-4" strokeWidth={2} />
        Join the Waitlist
      </button>
    </article>
  )
}
