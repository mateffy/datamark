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
        {/* Polyfill crypto.subtle for environments where Web Crypto isn't available */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof crypto!=='undefined'&&crypto.subtle)return;function sha1(d){var m=new Uint8Array(d),w=[];for(var i=0;i<m.length;i++)w[i>>>2]|=m[i]<<(24-(i%4)*8);w[(m.length>>>2)]|=0x80<<(24-(m.length%4)*8);w[(((m.length+64)>>>9)<<4)+15]=m.length*8;var H=[0x67452301,0xEFCDAB89,0x98BADCFE,0x10325476,0xC3D2E1F0];for(var i=0;i<w.length;i+=16){var W=new Array(80);for(var t=0;t<16;t++)W[t]=w[i+t]||0;for(var t=16;t<80;t++)W[t]=((W[t-3]^W[t-8]^W[t-14]^W[t-16])<<1)|((W[t-3]^W[t-8]^W[t-14]^W[t-16])>>>31);var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4];for(var t=0;t<80;t++){var f,k;if(t<20){f=(b&c)|(~b&d);k=0x5A827999}else if(t<40){f=b^c^d;k=0x6ED9EBA1}else if(t<60){f=(b&c)|(b&d)|(c&d);k=0x8F1BBCDC}else{f=b^c^d;k=0xCA62C1D6}var temp=(((a<<5)|(a>>>27))+f+e+k+W[t])|0;e=d;d=c;c=(b<<30)|(b>>>2);b=a;a=temp}H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0}var r=new ArrayBuffer(20);var v=new DataView(r);for(var i=0;i<5;i++)v.setInt32(i*4,H[i],false);return r}var s={digest:function(a,d){if(a!=='SHA-1'&&a!=='sha1')return Promise.reject(new Error('Unsupported: '+a));return Promise.resolve(sha1(d))}};if(typeof crypto==='undefined')globalThis.crypto={subtle:s,getRandomValues:function(b){return b}};else if(!crypto.subtle)crypto.subtle=s})()`,
          }}
        />
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
        {typeof process !== "undefined" && process.env?.NODE_ENV === "development" && <Agentation />}
        <Scripts />
      </body>
    </html>
  );
}
