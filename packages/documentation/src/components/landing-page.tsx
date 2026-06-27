import * as React from "react";
import { SectionHeading } from "./landing/section-heading";
import { CodeFrame } from "./landing/code-frame";
import { ModuleCard } from "./landing/module-card";
import { Card } from "./landing/card";
import { T, Line } from "./landing/syntax";

function ButtonPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--color-accent)] text-white dark:text-black font-medium text-sm hover:opacity-90 transition-opacity"
    >
      {children}
    </a>
  );
}

function ButtonSecondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] font-medium text-sm hover:border-[var(--color-text-muted)] transition-colors"
    >
      {children}
    </a>
  );
}

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center pt-20 md:pt-32 pb-16 md:pb-24 px-6">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[var(--color-text-primary)] leading-[1.05] tracking-tight ">
          <span className="block">
            Use <span className="mx-2 italic text-[var(--color-accent)]">Markdown</span> as a{" "}
            <span className="mx-2 italic text-[var(--color-accent)]">Data Format</span>
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl lg:text-2xl text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
          Keep your content human-editable, but make it machine-readable. <br />
          Use Markdown as a data format for your apps, APIs, and websites. <br />
          Parse text into typed, validated data using a robust AST.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ButtonPrimary href="/docs">Get Started</ButtonPrimary>
          <ButtonSecondary href="https://github.com/mateffy/datamark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </ButtonSecondary>
        </div>

        {/* Round-trip demo embedded in hero */}
        <div className="mt-16 w-full max-w-3xl text-left">
          <CodeFrame>
            <Line>
              <T type="keyword">import</T>
              <T type="plain"> </T>
              <T type="plain">{"{ datamark }"}</T>
              <T type="plain"> </T>
              <T type="keyword">from</T>
              <T type="string"> "datamark"</T>
            </Line>
            <Line>{''}</Line>
            <Line>
              <T type="keyword">const</T>
              <T type="plain"> Blog = </T>
              <T type="function">datamark</T>
              <T type="punctuation">{"({"}</T>
              <T type="plain"> schema, parse, stringify </T>
              <T type="punctuation">{"});"}</T>
            </Line>
            <Line>
              <T type="plain" />
            </Line>
            <Line>
              <T type="keyword">const</T>
              <T type="plain"> markdown = </T>
              <T type="string">`# Hello World</T>
            </Line>
            <Line>
              <T type="string">This is a blog post with a [link](...).</T>
            </Line>
            <Line>
              <T type="plain" />
            </Line>
            <Line>
              <T type="string">## A Section</T>
            </Line>
            <Line>
              <T type="plain" />
            </Line>
            <Line>
              <T type="string">More content [here](...)...`</T>
            </Line>
            <Line>
              <T type="plain" />
            </Line>
            <Line>
              <T type="keyword">let</T>
              <T type="plain"> data = Blog.</T>
              <T type="function">parse</T>
              <T type="punctuation">{"("}</T>
              <T type="plain">markdown</T>
              <T type="punctuation">{");"}</T>
            </Line>
            <Line>
              <T type="comment">{'// {'}</T>
            </Line>
            <Line>
              <T type="comment">{'//   title: "Hello World",'}</T>
              </Line>
            <Line>
              <T type="comment">{'//   snippet: "This is a blog post with a link.",'}</T>
            </Line>
            <Line>
              <T type="comment">{'//   sections: [{ heading: "A Section", content: "More content here..." }]'}</T>
            </Line>
            <Line>
              <T type="comment">{'//   links: [{ href: "...", text: "link" }, { href: "...", text: "here" }]'}</T>
            </Line>
            <Line>
              <T type="comment">{'// }'}</T>
            </Line>
            <Line>
              <T type="plain" />
            </Line>
            <Line>
              <T type="plain">data.title =</T>
              <T type="string"> "Hello from datamark!"</T>
            </Line>
            <Line>
              <T type="plain" />
            </Line>
            <Line>
              <T type="keyword">const</T>
              <T type="plain"> out = Blog.</T>
              <T type="function">stringify</T>
              <T type="punctuation">{"("}</T>
              <T type="plain">data</T>
              <T type="punctuation">{");"}</T>
            </Line>
            <Line>
              <T type="comment">{'// → # Hello from datamark!\\n\\nThis is a blog post with...'}</T>
            </Line>
          </CodeFrame>
        </div>
      </section>

      {/* ── Modules ──────────────────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-28">
          {/* Parse */}
          <ModuleCard
            title="Parse"
            description={
              <>
                datamark parses Markdown into a typed AST with sections, paragraphs, code blocks,
                lists, and tables. The result is a <code>Document</code> you can traverse, query,
                and transform.
              </>
            }
            code={
              <>
                <Line>
                  <T type="keyword">import</T>
                  <T type="plain"> </T>
                  <T type="plain">{"{ parse }"}</T>
                  <T type="plain"> </T>
                  <T type="keyword">from</T>
                  <T type="string"> "datamark"</T>
                </Line>
                <Line>
                  <T type="plain" />
                </Line>
                <Line>
                  <T type="keyword">const</T>
                  <T type="plain"> doc = </T>
                  <T type="function">parse</T>
                  <T type="punctuation">{"("}</T>
                  <T type="string">"# Hello"</T>
                  <T type="punctuation">{");"}</T>
                </Line>
                <Line>
                  <T type="plain" />
                </Line>
                <Line>
                  <T type="plain">doc.root.children</T>
                  <T type="punctuation">[</T>
                  <T type="number">0</T>
                  <T type="punctuation">]</T>
                  <T type="plain">.heading.children</T>
                </Line>
                <Line>
                  <T type="comment">{'// → [{ type: "text", value: "Hello" }]'}</T>
                </Line>
              </>
            }
          />

          {/* Format */}
          <ModuleCard
            title="Format"
            description={
              <>
                A format is a typed contract. Define a schema, a <code>parse</code>{" "}
                function that walks the AST, and a <code>stringify</code> function for round-trip
                serialization. Add inline examples and your format becomes self-testing.
              </>
            }
            code={
              <>
                <Line>
                  <T type="keyword">import</T>
                  <T type="plain"> </T>
                  <T type="plain">{"{ datamark }"}</T>
                  <T type="plain"> </T>
                  <T type="keyword">from</T>
                  <T type="string"> "datamark"</T>
                </Line>
                <Line>
                  <T type="keyword">import</T>
                  <T type="plain"> </T>
                  <T type="plain">{"{ heading, paragraph }"}</T>
                  <T type="plain"> </T>
                  <T type="keyword">from</T>
                  <T type="string"> "datamark/stringify"</T>
                </Line>
                <Line>
                  <T type="keyword">import</T>
                  <T type="plain"> z </T>
                  <T type="keyword">from</T>
                  <T type="string"> "zod"</T>
                </Line>
                <Line>
                  <T type="plain" />
                </Line>
                <Line>
                  <T type="keyword">const</T>
                  <T type="plain"> Blog = </T>
                  <T type="function">datamark</T>
                  <T type="punctuation">{"({"}</T>
                </Line>
                <Line>
                  <T type="plain">{"  "}schema: z.</T>
                  <T type="function">object</T>
                  <T type="punctuation">{"({"}</T>
                </Line>
                <Line>
                  <T type="plain">{"    "}title: z.</T>
                  <T type="function">string</T>
                  <T type="punctuation">{"(),"}</T>
                </Line>
                <Line>
                  <T type="plain">{"    "}body: z.</T>
                  <T type="function">string</T>
                  <T type="punctuation">{"(),"}</T>
                </Line>
                <Line>
                  <T type="plain">{"  "}</T>
                  <T type="punctuation">{"}),"}</T>
                </Line>
                <Line>
                  <T type="function">{"  "}parse</T>
                  <T type="punctuation">{"("}</T>
                  <T type="plain">doc</T>
                  <T type="punctuation">{") {"}</T>
                </Line>
                <Line>
                  <T type="keyword">{"    "}return</T>
                  <T type="plain">{" {"}</T>
                </Line>
                <Line>
                  <T type="plain">
                    {"      "}title: doc.root.children[0].heading.children[0].value
                  </T>
                  <T type="punctuation">,</T>
                </Line>
                <Line>
                  <T type="plain">
                    {"      "}body: doc.root.children[1].paragraph.children[0].value
                  </T>
                </Line>
                <Line>
                  <T type="plain">{"    };"}</T>
                </Line>
                <Line>
                  <T type="plain">
                    {"  "}
                    {"},"}
                  </T>
                </Line>
                <Line>
                  <T type="function">{"  "}stringify</T>
                  <T type="punctuation">{"("}</T>
                  <T type="plain">data</T>
                  <T type="punctuation">{") {"}</T>
                </Line>
                <Line>
                  <T type="keyword">{"    "}return</T>
                  <T type="plain">{" ["}</T>
                </Line>
                <Line>
                  <T type="function">{"      "}heading</T>
                  <T type="plain">(data.title),</T>
                </Line>
                <Line>
                  <T type="function">{"      "}paragraph</T>
                  <T type="plain">(data.body),</T>
                </Line>
                <Line>
                  <T type="plain">{"    ]."}</T>
                  <T type="function">join</T>
                  <T type="punctuation">{"("}</T>
                  <T type="string">"\\n\\n"</T>
                  <T type="punctuation">{");"}</T>
                </Line>
                <Line>
                  <T type="punctuation">{"  }"}</T>
                </Line>
                <Line>
                  <T type="punctuation">{"})"}</T>
                </Line>
              </>
            }
            reverse
          />

          {/* Extract */}
          <ModuleCard
            title="Extract"
            description={
              <>
                The AST SDK gives you primitives to query the tree: <code>findAll</code> for
                filtering, <code>textContent</code> for extracting text,{" "}
                <code>extractTodoItems</code> for checkbox lists. Navigate sections by heading,
                split by depth, or flatten back to blocks.
              </>
            }
            code={
              <>
                <Line>
                  <T type="keyword">import</T>
                  <T type="plain"> </T>
                  <T type="plain">{"{ findAll, isCodeBlock, textContent }"}</T>
                  <T type="plain"> </T>
                  <T type="keyword">from</T>
                  <T type="string"> "datamark"</T>
                </Line>
                <Line>
                  <T type="plain" />
                </Line>
                <Line>
                  <T type="comment">{"// Find all TypeScript code blocks"}</T>
                </Line>
                <Line>
                  <T type="keyword">const</T>
                  <T type="plain"> blocks = </T>
                  <T type="function">findAll</T>
                  <T type="punctuation">{"("}</T>
                </Line>
                <Line>
                  <T type="plain">{"  "}doc.root,</T>
                </Line>
                <Line>
                  <T type="plain">{"  "}n =&gt; </T>
                  <T type="function">isCodeBlock</T>
                  <T type="punctuation">{"("}</T>
                  <T type="plain">n, </T>
                  <T type="string">"typescript"</T>
                  <T type="punctuation">{"),"}</T>
                </Line>
                <Line>
                  <T type="punctuation">{");"}</T>
                </Line>
                <Line>
                  <T type="plain" />
                </Line>
                <Line>
                  <T type="comment">{"// Extract all text from a section"}</T>
                </Line>
                <Line>
                  <T type="keyword">const</T>
                  <T type="plain"> body = </T>
                  <T type="function">textContent</T>
                  <T type="punctuation">{"("}</T>
                  <T type="plain">doc.root</T>
                  <T type="punctuation">{")."}</T>
                  <T type="function">trim</T>
                  <T type="punctuation">{"();"}</T>
                </Line>
              </>
            }
          />

          {/* Validate */}
          <ModuleCard
            title="Validate"
            description={
              <>
                Bring your own validator. datamark speaks Standard Schema v1, so Zod, Valibot,
                ArkType, and TypeBox all work out of the box. Schemas are validated automatically —
                bad data throws <code>ValidationError</code> with a clear message, not an undefined
                panic.
              </>
            }
            code={
              <>
                <Line>
                  <T type="keyword">import</T>
                  <T type="plain"> v </T>
                  <T type="keyword">from</T>
                  <T type="string"> "valibot"</T>
                </Line>
                <Line>
                  <T type="plain" />
                </Line>
                <Line>
                  <T type="keyword">const</T>
                  <T type="plain"> Recipe = </T>
                  <T type="function">datamark</T>
                  <T type="punctuation">{"({"}</T>
                </Line>
                <Line>
                  <T type="plain">{"  "}frontmatterSchema: v.</T>
                  <T type="function">object</T>
                  <T type="punctuation">{"({"}</T>
                </Line>
                <Line>
                  <T type="plain">{"    "}prepTime: v.</T>
                  <T type="function">string</T>
                  <T type="punctuation">{"(),"}</T>
                </Line>
                <Line>
                  <T type="plain">{"    "}servings: v.</T>
                  <T type="function">number</T>
                  <T type="punctuation">{"(),"}</T>
                </Line>
                <Line>
                  <T type="plain">{"  "}</T>
                  <T type="punctuation">{"}),"}</T>
                </Line>
                <Line>
                  <T type="plain">{"  "}schema: v.</T>
                  <T type="function">object</T>
                  <T type="punctuation">{"({"}</T>
                </Line>
                <Line>
                  <T type="plain">{"    "}title: v.</T>
                  <T type="function">string</T>
                  <T type="punctuation">{"(),"}</T>
                </Line>
                <Line>
                  <T type="plain">{"    "}ingredients: v.</T>
                  <T type="function">array</T>
                  <T type="punctuation">{"("}</T>
                  <T type="plain">v.string</T>
                  <T type="punctuation">{"()),"}</T>
                </Line>
                <Line>
                  <T type="plain">{"  "}</T>
                  <T type="punctuation">{"}),"}</T>
                </Line>
                <Line>
                  <T type="plain">
                    {"  "}parse(doc) {"{"}
                  </T>
                </Line>
                <Line>
                  <T type="comment">{"    // frontmatter is typed — no `as any`"}</T>
                </Line>
                <Line>
                  <T type="plain">
                    {"    "}const {"{"} prepTime, servings {"}"} = doc.frontmatter
                  </T>
                </Line>
                <Line>
                  <T type="plain">{"    "}...</T>
                </Line>
                <Line>
                  <T type="plain">
                    {"  "}
                    {"},"}
                  </T>
                </Line>
                <Line>
                  <T type="punctuation">{"})"}</T>
                </Line>
              </>
            }
            reverse
          />
        </div>
      </section>

      {/* ── Why datamark? ──────────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div>
          <SectionHeading className="mb-10 md:mb-16 text-center">Why datamark?</SectionHeading>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card padding="lg">
              <div className="text-[var(--color-accent)] mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Fully type-safe</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Schemas drive the types. Your parse function receives typed frontmatter and returns
                a typed object. No manual type definitions, no <code>as any</code> escapes.
              </p>
            </Card>

            <Card padding="lg">
              <div className="text-[var(--color-accent)] mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-2">
                Self-documenting formats
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                A format is a schema + parse + stringify + examples. The inline examples are
                validated by <code>.test()</code> automatically — your documentation stays correct.
              </p>
            </Card>

            <Card padding="lg">
              <div className="text-[var(--color-accent)] mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 014-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>
              </div>
              <h3 className="font-medium text-[var(--color-text-primary)] mb-2">
                Round-trip fidelity
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Parse Markdown into typed objects, then stringify them back. The builder primitives
                handle escaping and indentation so you never write brittle string templates again.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <SectionHeading className="mb-8">
            Get started in <span className="italic">30 seconds.</span>
          </SectionHeading>

          <div className="inline-block mb-8">
            <Card markers padding="sm">
              <span className="font-mono text-sm text-[var(--color-text-secondary)]">
                npm install datamark
              </span>
            </Card>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <ButtonPrimary href="/docs/quickstart">Read the Docs</ButtonPrimary>
            <ButtonSecondary href="https://github.com/mateffy/datamark">
              View on GitHub
            </ButtonSecondary>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-muted)]">
          <p>
            datamark — Made by{" "}
            <a
              href="https://mateffy.org"
              className="hover:text-[var(--color-text-secondary)] transition-colors underline underline-offset-2"
            >
              Mátéffy Software Research
            </a>
            . © 2026{" "}
            <a
              href="https://mateffy.me"
              className="hover:text-[var(--color-text-secondary)] transition-colors underline underline-offset-2"
            >
              Lukas Mateffy
            </a>
          </p>
          <div className="flex gap-6">
            <a href="/docs" className="hover:text-[var(--color-text-secondary)] transition-colors">
              Documentation
            </a>
            <a
              href="/docs/examples"
              className="hover:text-[var(--color-text-secondary)] transition-colors"
            >
              Examples
            </a>
            <a
              href="https://github.com/mateffy/datamark"
              className="hover:text-[var(--color-text-secondary)] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://mateffy.org/legal"
              className="hover:text-[var(--color-text-secondary)] transition-colors"
            >
              Imprint
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
