import { createFileRoute } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { LandingPage } from "@/components/landing-page";

const TITLE = "datamark – use markdown as a data format";
const DESCRIPTION =
  "Keep your content human-editable, but make it machine-readable. Use Markdown as a data format for your apps, APIs, and websites. Parse text into typed, validated data using a robust AST.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://datamark.md" },
      { property: "og:image", content: "https://datamark.md/og.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: "https://datamark.md/og.webp" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <HomeLayout {...baseOptions()}>
      <LandingPage />
    </HomeLayout>
  );
}
