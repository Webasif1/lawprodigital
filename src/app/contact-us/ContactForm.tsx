"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { ArrowCircle, buttonClasses } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { submitContact } from "./actions";
import { cityOptions, serviceOptions, type ContactField, type ContactState } from "./form-config";

const initial: ContactState = { status: "idle" };

const inputClass =
  "mt-2 block w-full rounded-xl border-0 bg-paper px-4 py-3.5 text-ink ring-1 ring-ink/15 transition-shadow placeholder:text-slate/70 focus:outline-none focus:ring-2 focus:ring-navy aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-600";

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
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={status} tabIndex={-1} role="status" className="rounded-3xl bg-ink p-10 text-paper outline-none">
        <span className="grid size-14 place-items-center rounded-full bg-gold text-ink">
          <CheckIcon className="size-6" />
        </span>
        <h2 className="mt-6 font-display text-3xl tracking-tight">Message sent</h2>
        <p className="mt-3 text-lg text-mist">{state.message}</p>
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
      {optional ? <span className="font-normal text-slate"> (optional)</span> : <span aria-hidden className="text-gold-deep"> *</span>}
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
      noValidate className="relative grid gap-6 rounded-3xl bg-paper-2 p-6 sm:p-10">
      <div ref={status} tabIndex={-1} aria-live="polite" className="outline-none empty:hidden">
        {state.status === "error" && state.message && (
          <p className="rounded-xl bg-red-50 px-4 py-3 font-medium text-red-800 ring-1 ring-red-200">{state.message}</p>
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
          {label("phone", "Phone", true)}
          <input {...fieldProps("phone")} type="tel" autoComplete="tel" maxLength={40} className={inputClass} />
          {errorText("phone")}
        </div>
        <div>
          {label("city", "City", true)}
          <select {...fieldProps("city")} className={inputClass}>
            <option value="">Select your city</option>
            {cityOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
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
        {label("message", "Message")}
        <textarea {...fieldProps("message")} rows={6} required maxLength={5000} className={`${inputClass} resize-y`} />
        {errorText("message")}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate">We’ll only use your details to respond to your enquiry.</p>
        <button type="submit" disabled={pending} className={buttonClasses("gold", "disabled:cursor-wait disabled:opacity-70")}>
          <span>{pending ? "Sending…" : "Send message"}</span>
          <ArrowCircle />
        </button>
      </div>
    </form>
  );
}
