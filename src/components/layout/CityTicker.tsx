import { cities } from "@/content/home";

function CityList({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className={`flex shrink-0 items-center ${hidden ? "motion-reduce:hidden" : ""}`}>
      {cities.map((c) => (
        <li key={c} className="flex items-center whitespace-nowrap">
          <span aria-hidden className="mx-4 size-1 rounded-full bg-gold/70" />
          {c}
        </li>
      ))}
    </ul>
  );
}

/** A slim strip above the header: the cities we serve, drifting past on a loop. */
export function CityTicker() {
  return (
    <section aria-label="Cities we serve" className="on-dark border-b border-white/10 bg-navy-deep text-[0.8rem] text-mist">
      <div className="container-x flex h-9 items-center gap-2">
        <p className="hidden shrink-0 font-semibold text-white sm:block">Serving law firms in</p>
        <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)] motion-reduce:overflow-x-auto">
          {/* Two identical copies; the track shifts by half its width, so the loop has no visible jump. */}
          <div className="flex w-max animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
            <CityList />
            <CityList hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
