import { AiAssistantCard } from '../components/dashboard/AiAssistantCard'

/**
 * Dedicated surface for the experimental grounded assistant.
 * Same card as the dashboard aside; wider layout for longer answers.
 */
export function AssistantPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-ink">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Experimental, informational Q&amp;A over indexed HVAC manuals. Not a
          substitute for manufacturer documentation or qualified technicians.
        </p>
      </header>
      <AiAssistantCard />
    </div>
  )
}
