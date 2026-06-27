import { createFileRoute } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-col justify-center flex-1 text-center items-center gap-4">
        <h1 className="text-4xl font-bold">datamark</h1>
        <p className="text-fd-muted-foreground max-w-md">
          Parse Markdown into typed objects. Serialize them back. Declarative generator-based format
          system for TypeScript.
        </p>
        <a
          href="/docs"
          className="mt-4 px-4 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Get Started
        </a>
      </div>
    </HomeLayout>
  );
}
