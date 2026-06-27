import * as React from "react";

const cssVars: Record<string, string> = {
  keyword: "var(--syntax-keyword)",
  function: "var(--syntax-function)",
  string: "var(--syntax-string)",
  number: "var(--syntax-number)",
  comment: "var(--syntax-comment)",
  property: "var(--syntax-property)",
  tag: "var(--syntax-tag)",
  plain: "var(--syntax-plain)",
  punctuation: "var(--syntax-punctuation)",
};

type TokenType = keyof typeof cssVars;

export function T({
  type,
  children,
}: {
  type: TokenType;
  children?: React.ReactNode;
}) {
  return <span style={{ color: cssVars[type] }}>{children}</span>;
}

export function Line({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[1.6em]">{children}</div>;
}
