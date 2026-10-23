# Privacy policy: proposed changes (draft for owner and legal review)

**Status:** draft only. Nothing here has been changed on the website. The live text is in
`src/content/legal.ts` (rendered at `/privacy-policy/`, last updated 2026-10-20).

**Why:** the published policy no longer matches what the site does. Checked against the code on 2026-10-23
and the Vercel deployment's public responses:

| # | Mismatch | Evidence |
| --- | --- | --- |
| 1 | The AI chat isn't mentioned at all. Visitor messages are sent to OpenRouter and from there to the model provider (by default Google, `google/gemini-2.5-flash-lite`). | `src/app/api/chat/route.ts`; `GET https://lawprodigital.vercel.app/api/chat/` returns `{"enabled":true}`, so the chat is live today |
| 2 | "What we collect" leaves out the **firm website** field, which is required. | `src/app/contact-us/validate.ts` (`firmWebsite` is required) |
| 3 | IP retention says "about ten minutes". The chat keeps per-IP counters for up to **24 hours** (in memory only). | `CHAT_RATE.daily` in `src/app/api/chat/route.ts` |
| 4 | "The website doesn't use analytics…" is only true while all four `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID` and `NEXT_PUBLIC_CLARITY_ID` are empty. Setting any of them loads that tracker on every page, and there's no consent banner. | `src/lib/analytics.ts`, `src/components/seo/Analytics.tsx`. None are loaded on Vercel today (checked HTML). |

## Proposed text

### 1. "What we collect": replace the list

> We only collect what you choose to send us through the contact form or the chat:
>
> - Your first and last name
> - Your email address and, if you add it, your phone number
> - Your firm's website, so we can prepare the audit you asked for
> - The city and service you select, if any
> - The message you write
> - What you type into the AI chat assistant, if you use it

### 2. New section after "How we use it": "The AI chat assistant"

> The chat on this website is an AI assistant, not a person. When you send a message, the website passes it,
> together with the earlier messages in the same conversation, to OpenRouter, an AI service provider, which
> sends it to the AI model that writes the reply (currently a Google Gemini model). Their privacy terms apply
> to that processing. The website itself doesn't save your chat messages: they aren't stored in a database
> or written to our server logs, and the conversation is gone when you close the page. Please don't share
> confidential details about a legal matter in the chat.

**Needs confirmation before publishing (business decision, not code):**
- Check the OpenRouter account's privacy settings: whether providers that may log or train on prompts are
  allowed, and OpenRouter's own prompt-logging setting. The sentence about the provider's terms must
  match what's configured.
- If the model changes (`OPENROUTER_MODEL`), update "currently a Google Gemini model".

### 3. "Where it is stored and for how long": replace the second paragraph

> To stop spam and abuse, the website briefly keeps the IP address a message was sent from in memory: about
> ten minutes for the contact form, and up to 24 hours for the chat's daily limit. These counters aren't
> saved to disk and are cleared when the server restarts. Like most web servers, our hosting provider also
> keeps standard access logs (IP address, browser type, pages requested) for security and troubleshooting.

### 4. Analytics: only if an analytics ID is set

Keep the current sentence while no analytics ID is set. **Before** setting any `NEXT_PUBLIC_*` analytics ID,
replace it with a description of the specific tools (Google Analytics / Tag Manager, Meta Pixel, Microsoft
Clarity), what they record (pages viewed, device data, and for Clarity, session recordings), and how to opt
out. Whether a cookie-consent banner is legally required depends on where visitors are (for example EU/UK
visitors, or US states with opt-out rules for targeted advertising). That's a legal question for counsel. The
site currently has no consent banner.

### 5. Update the date

Set `LEGAL_UPDATED` in `src/content/legal.ts` to the date the revised text is published.
