"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { bookingUrl } from "@/content/site";
import { trackLead } from "@/lib/analytics";
import { submitContact } from "./actions";
import { serviceOptions, type ContactField, type ContactState } from "./form-config";

const initial: ContactState = { status: "idle" };

const inputClass =
  "mt-2 block w-full rounded-field border-0 bg-surface px-4 py-3.5 text-ink ring-1 ring-line transition-shadow placeholder:text-muted/70 hover:ring-ink/30 focus:outline-none focus:ring-2 focus:ring-navy aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-600";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  // Time the form was first shown, for the server-side bot check.
  const startedAt = useRef<HTMLInputElement>(null);
  const status = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state.status !== "idle") status.current?.focus();
    if (state.status === "success") trackLead();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={status} tabIndex={-1} role="status" className="on-dark rounded-card bg-navy p-10 text-paper outline-none">
        <span className="grid size-14 place-items-center rounded-tag bg-gold text-ink">
          <CheckIcon className="size-6" />
        </span>
        <h2 className="mt-6 font-display text-4xl tracking-[-0.02em]">Message sent</h2>
        <p className="mt-3 text-lg text-mist">{state.message}</p>
        {bookingUrl && (
          <div className="mt-8 border-t border-white/15 pt-8">
            <p className="text-mist">Want to skip the back-and-forth? Pick a time for your audit walkthrough now.</p>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("gold", "mt-5")}>
              <span>Book a call</span>
              <ButtonArrow />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        )}
      </div>
    );
  }

  const err = (f: ContactField) => state.errors?.[f];
  const val = (f: ContactField) => state.values?.[f] ?? "";
  const fieldProps = (f: ContactField) => ({
    id: f,
    name: f,
    defaultValue: val(f),
    "aria-invalid": err(f) ? true : undefined,
    "aria-describedby": err(f) ? `${f}-error` : undefined,
  });
  const errorText = (f: ContactField) =>
    err(f) ? (
      <p id={`${f}-error`} className="mt-1.5 text-sm font-medium text-red-700">
        {err(f)}
      </p>
    ) : null;
  const label = (f: ContactField, children: string, optional = false) => (
    <label htmlFor={f} className="text-sm font-semibold">
      {children}
      {optional ? <span className="font-normal text-muted"> (optional)</span> : <span aria-hidden className="text-brass"> *</span>}
    </label>
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        // Submit in a transition instead of letting React reset the form, so a
        // visitor fixing a validation error keeps everything they typed.
        // Without JS the native form action still posts to the server action.
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
      noValidate className="relative grid gap-6 rounded-card bg-wash p-6 ring-1 ring-line sm:p-10">
      <div ref={status} tabIndex={-1} aria-live="polite" className="outline-none empty:hidden">
        {state.status === "error" && state.message && (
          <p className="rounded-field bg-red-50 px-4 py-3 font-medium text-red-800 ring-1 ring-red-200">{state.message}</p>
        )}
      </div>

      {/* Spam traps — hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          {label("firstName", "First name")}
          <input {...fieldProps("firstName")} type="text" autoComplete="given-name" required maxLength={80} className={inputClass} />
          {errorText("firstName")}
        </div>
        <div>
          {label("lastName", "Last name", true)}
          <input {...fieldProps("lastName")} type="text" autoComplete="family-name" maxLength={80} className={inputClass} />
          {errorText("lastName")}
        </div>
        <div>
          {label("email", "Email")}
          <input {...fieldProps("email")} type="email" autoComplete="email" required maxLength={200} className={inputClass} />
          {errorText("email")}
        </div>
        <div>
          {label("firmWebsite", "Your firm’s website")}
          <input
            {...fieldProps("firmWebsite")}
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourfirm.com"
            required
            maxLength={200}
            className={inputClass}
          />
          {errorText("firmWebsite")}
        </div>
        <div>
          {label("phone", "Phone", true)}
          <input {...fieldProps("phone")} type="tel" autoComplete="tel" maxLength={40} className={inputClass} />
          {errorText("phone")}
        </div>
        <div>
          {label("city", "City or state", true)}
          <input {...fieldProps("city")} type="text" autoComplete="address-level2" maxLength={80} className={inputClass} />
          {errorText("city")}
        </div>
        <div>
          {label("service", "Service", true)}
          <select {...fieldProps("service")} className={inputClass}>
            <option value="">Select your service</option>
            {serviceOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {errorText("service")}
        </div>
      </div>
      <div>
        {label("message", "Anything we should know?", true)}
        <textarea {...fieldProps("message")} rows={5} maxLength={5000} className={`${inputClass} resize-y`} />
        {errorText("message")}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          We’ll only use your details to respond to your enquiry. See our{" "}
          <Link href="/privacy-policy/" className="font-medium text-navy-2 underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
        <button type="submit" disabled={pending} className={buttonClasses("gold", "disabled:cursor-wait disabled:opacity-70")}>
          <span>{pending ? "Sending…" : "Request my free AI lead audit"}</span>
          <ButtonArrow />
        </button>
      </div>
    </form>
  );
}
