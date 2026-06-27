import * as React from "react";
import { CodeFrame } from "./code-frame";

export function ModuleCard({
  title,
  description,
  code,
  children,
  reverse = false,
}: {
  title: string;
  description: React.ReactNode;
  code: React.ReactNode;
  children?: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
      <div className={`grid gap-4 ${reverse ? "lg:order-2" : ""}`}>
        <h3 className="font-serif text-3xl md:text-4xl text-[var(--color-text-primary)]">
          {title}
        </h3>
        <div className="text-[var(--color-text-secondary)] leading-relaxed text-xl">
          {description}
        </div>
        {children}
      </div>
      <div className={`${reverse ? "lg:order-1" : ""}`}>
        <CodeFrame>{code}</CodeFrame>
      </div>
    </div>
  );
}
