import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowIcon } from "./icons";

type Variant = "gold" | "ghost-dark" | "ghost-light" | "ink";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-ink hover:bg-gold-soft",
  ink: "bg-ink text-paper hover:bg-navy",
  "ghost-dark": "text-paper ring-1 ring-inset ring-white/25 hover:ring-white/60 hover:bg-white/5",
  "ghost-light": "text-ink ring-1 ring-inset ring-ink/20 hover:ring-ink/60 hover:bg-ink/[0.03]",
};

export const buttonClasses = (variant: Variant = "gold", extra = "") =>
  `group/btn inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-[0.95rem] font-semibold tracking-tight transition-[background-color,box-shadow,color] duration-300 ${variants[variant]} ${extra}`;

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
      {arrow && <ArrowCircle />}
    </Link>
  );
}

/** Arrow that slides through its own circular mask on hover. */
export function ArrowCircle() {
  return (
    <span aria-hidden className="relative -mr-2 grid size-8 place-items-center overflow-hidden rounded-full bg-current/10">
      <ArrowIcon className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-6" />
      <ArrowIcon className="absolute size-4 -translate-x-6 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0" />
    </span>
  );
}
