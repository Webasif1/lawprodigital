import Link from "next/link";
import { ai } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChatDemo } from "./ChatDemo";

export function AiSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  return (
    <section aria-labelledby="ai-heading" className="on-dark relative isolate overflow-hidden bg-navy-deep text-white">
      <div aria-hidden className="ledger-rules pointer-events-none absolute inset-0 -z-10 mask-[radial-gradient(ellipse_at_80%_50%,#000,transparent_70%)]" />
      <div className="container-x section-y grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading tone="dark" as={headingLevel} eyebrow="AI intake" title={<span id="ai-heading">{ai.heading}</span>} />
          <p data-reveal className="mt-6 max-w-xl text-lead text-mist">
            {ai.body}
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {ai.bullets.map((b, i) => (
              <li key={b} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex items-start gap-3 rounded-field bg-white/5 p-4 ring-1 ring-inset ring-white/10">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-ink">
                  <CheckIcon className="size-3.5" />
                </span>
                <span className="font-medium leading-snug">{b}</span>
              </li>
            ))}
          </ul>
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-5">
            <ButtonLink href="/contact-us/">Get Your Free AI Lead Audit</ButtonLink>
            <Link href="/ai-solutions/" className="font-semibold text-white/85 underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">
              How the AI assistant works
            </Link>
          </div>
        </div>
        <div data-reveal className="lg:col-span-5 lg:col-start-8">
          <ChatDemo />
        </div>
      </div>
    </section>
  );
}
