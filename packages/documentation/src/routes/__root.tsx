import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import * as React from "react";
import "@/styles/app.css";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import SearchDialog from "@/components/search";
import { Agentation } from "agentation";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "datamark",
      },
      {
        name: "description",
        content:
          "Parse Markdown into typed objects. Serialize them back. Lightweight format system for TypeScript.",
      },
      {
        name: "google-site-verification",
        content: "YOUR_VERIFICATION_CODE_HERE",
      },
      {
        property: "og:title",
        content: "datamark",
      },
      {
        property: "og:description",
        content:
          "Parse Markdown into typed objects. Serialize them back. Lightweight format system for TypeScript.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://datamark.md",
      },
      {
        property: "og:image",
        content: "https://datamark.md/og.webp",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "datamark",
      },
      {
        name: "twitter:description",
        content:
          "Parse Markdown into typed objects. Serialize them back. Lightweight format system for TypeScript.",
      },
      {
        name: "twitter:image",
        content: "https://datamark.md/og.webp",
      },
    ],
    links: [{ rel: "icon", type: "image/svg+xml", href: "/datamark-icon.svg" }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "datamark",
    description:
      "Parse Markdown into typed objects. Serialize them back. Lightweight format system for TypeScript.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Lukas Mateffy",
      url: "https://mateffy.org",
    },
    codeRepository: "https://github.com/mateffy/datamark",
    programmingLanguage: ["TypeScript", "JavaScript"],
    softwareRequirements: "Node.js, Bun, or Deno runtime",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "datamark",
    url: "https://datamark.md",
    logo: "https://datamark.md/datamark-icon.png",
    founder: {
      "@type": "Person",
      name: "Lukas Mateffy",
      url: "https://mateffy.org",
    },
    sameAs: ["https://github.com/mateffy/datamark"],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          defer
          data-domain="datamark.md"
          src="https://plausible.claw.events/js/script.file-downloads.hash.outbound-links.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ SearchDialog }}>{children}</RootProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
        <Scripts />
      </body>
    </html>
  );
}
