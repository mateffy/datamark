import * as React from "react";

interface SchemaViewerProps {
  schema?: unknown;
  children?: React.ReactNode;
}

export function SchemaViewer({ children }: SchemaViewerProps) {
  return (
    <div className="rounded-lg border bg-card p-4 text-sm text-card-foreground">
      {children ?? <pre>Schema viewer placeholder</pre>}
    </div>
  );
}
