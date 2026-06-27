import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";

interface PageActionsProps {
  markdownUrl: string;
  githubUrl?: string;
}

export function LLMCopyButton({ markdownUrl }: PageActionsProps) {
  return (
    <Button variant="outline" size="sm" asChild>
      <a href={markdownUrl} target="_blank" rel="noreferrer">
        <Copy className="w-4 h-4 mr-1" />
        Copy as Markdown
      </a>
    </Button>
  );
}

export function ViewOptions({ markdownUrl, githubUrl }: PageActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" asChild>
        <a href={markdownUrl} target="_blank" rel="noreferrer">
          <Copy className="w-4 h-4 mr-1" />
          Markdown
        </a>
      </Button>
      {githubUrl && (
        <Button variant="outline" size="sm" asChild>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="w-4 h-4 mr-1" />
            Edit
          </a>
        </Button>
      )}
    </div>
  );
}
