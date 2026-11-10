import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { BookingCalendar } from "./BookingCalendar";

export const metadata: Metadata = pageMetadata({
  title: "Book a Free Strategy Call — Pick a Time That Suits You",
  description:
    "Choose a time for a free 30-minute strategy call with Law Pro Digital. We’ll walk you through how your law firm shows up on Google, Maps and ChatGPT, and where leads slip away.",
  path: "/book-a-call/",
});

export default function BookACallPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Book a Call", path: "/book-a-call/" }])} />
      <PageHero
        eyebrow="Book a call"
        crumbs={[{ name: "Book a Call", path: "/book-a-call/" }]}
        title={
          <>
            Pick a time for your <em className="text-gold">free strategy call.</em>
          </>
        }
        intro="Thirty minutes on Google Meet. Choose a day and time below; times are shown in your time zone."
      />
      <section aria-label="Booking calendar" className="bg-paper">
        <div className="container-x py-16 sm:py-24">
          <BookingCalendar />
        </div>
      </section>
    </>
  );
}
