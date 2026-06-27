import * as React from "react";
import rawSvg from "../../public/datamark-logo.svg?raw";

const themedSvg = rawSvg.replace(/fill="black"/g, 'fill="currentColor"');

export function DatamarkLogo({ className }: { className?: string }) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: themedSvg }}
    />
  );
}
