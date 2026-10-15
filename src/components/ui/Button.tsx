import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowIcon } from "./icons";

type Variant = "gold" | "ghost-dark" | "ghost-light" | "ink";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-ink shadow-[0_8px_24px_-12px_rgba(214,173,59,0.8)] hover:bg-gold-soft",
  ink: "bg-navy text-paper hover:bg-navy-2",
  "ghost-dark": "text-paper ring-1 ring-inset ring-white/25 hover:ring-white/70 hover:bg-white/5",
  "ghost-light": "bg-surface text-ink ring-1 ring-inset ring-line hover:ring-ink/40",
};

export const buttonClasses = (variant: Variant = "gold", extra = "") =>
  `group/btn inline-flex min-h-12 items-center justify-center gap-2.5 rounded-tag px-5 text-[0.95rem] font-semibold tracking-[-0.005em] transition-[background-color,box-shadow,color] duration-(--dur-fast) ${variants[variant]} ${extra}`;

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ variant = "gold", arrow = true, className = "", children, ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={buttonClasses(variant, className)}>
      <span>{children}</span>
      {arrow && <ButtonArrow />}
    </Link>
  );
}

/** Arrow that nudges forward on hover. */
export function ButtonArrow() {
  return <ArrowIcon aria-hidden className="size-4 transition-transform duration-(--dur-base) ease-out-expo group-hover/btn:translate-x-1" />;
}
