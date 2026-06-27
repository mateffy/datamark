import * as React from "react";
import { Card } from "./card";

export function CodeFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card markers padding="md" className={className}>
      <pre className="text-sm md:text-base overflow-x-auto font-mono leading-relaxed">
        {children}
      </pre>
    </Card>
  );
}
