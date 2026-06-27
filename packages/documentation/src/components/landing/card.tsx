import * as React from "react";
import { CornerMarker } from "./corner-marker";

export function Card({
  children,
  markers = false,
  padding = "md",
  className = "",
}: {
  children: React.ReactNode;
  markers?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}) {
  const paddingClass =
    padding === "none"
      ? ""
      : padding === "sm"
        ? "px-3 py-2"
        : padding === "md"
          ? "px-5 py-4"
          : "p-6";

  return (
    <div className={`relative min-w-0 border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-elevated)] ${className}`}>
      {markers && (
        <>
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-[var(--color-text-muted)] z-10">
            <CornerMarker />
          </div>
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[var(--color-text-muted)] z-10">
            <CornerMarker />
          </div>
          <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-[var(--color-text-muted)] z-10">
            <CornerMarker />
          </div>
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-[var(--color-text-muted)] z-10">
            <CornerMarker />
          </div>
        </>
      )}
      <div className={paddingClass}>{children}</div>
    </div>
  );
}
