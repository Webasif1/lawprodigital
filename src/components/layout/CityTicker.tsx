/** A slim strip above the header with the one-line coverage statement. */
export function CityTicker() {
  return (
    <section aria-label="Where we work" className="on-dark border-b border-white/10 bg-navy-deep text-[0.8rem] text-mist">
      <div className="container-x flex h-9 items-center justify-center gap-3 sm:justify-start">
        <span aria-hidden className="size-1.5 rounded-full bg-gold" />
        <p>
          <span className="font-semibold text-white">Serving US law firms nationwide</span>
          <span className="hidden sm:inline"> · immigration-first, plus bankruptcy and personal injury</span>
        </p>
      </div>
    </section>
  );
}
