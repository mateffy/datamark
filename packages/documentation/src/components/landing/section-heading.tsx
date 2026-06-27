import * as React from "react";

export function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] ${className}`}
    >
      {children}
    </h2>
  );
}
