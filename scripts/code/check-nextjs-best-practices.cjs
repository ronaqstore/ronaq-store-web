"use strict";

const fs = require("fs");
const path = require("path");
const traverse = require("@babel/traverse").default;
const { Reporter } = require("./lib/reporter.cjs");
const { walkTree } = require("./lib/walkTree.cjs");
const { parseFile } = require("./lib/parseFile.cjs");

const r = new Reporter("Next.js Built-in Features & Best Practices Audit", { emoji: "▲" });

const rootDir = path.join(__dirname, "../..");
const srcRoot = path.join(rootDir, "src");
const appRoot = path.join(srcRoot, "app");

const REQUIRED_LOADING = [
  "src/app/[locale]/loading.tsx",
  "src/app/[locale]/shop/[slug]/loading.tsx",
  "src/app/[locale]/shop/[slug]/product/[productId]/loading.tsx",
];

const SEARCH_PARAMS_PAGES = [
  "src/app/[locale]/page.tsx",
  "src/app/[locale]/shop/[slug]/page.tsx",
];

function normalizeRel(relPathRaw) {
  return relPathRaw.split(path.sep).join("/");
}

function isUseClient(code) {
  return code.includes("'use client'") || code.includes('"use client"');
}

function isNullOnlyPage(code) {
  const stripped = code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, "")
    .replace(/export\s+async\s+function\s+generateMetadata[\s\S]*?\n}/g, "")
    .replace(/export\s+const\s+metadata[\s\S]*?;/g, "")
    .trim();
  return /return\s+null\s*;?\s*}\s*$/.test(stripped) || /=>\s*null\s*;?\s*$/.test(stripped);
}

REQUIRED_LOADING.forEach((reqPath) => {
  const full = path.join(rootDir, reqPath);
  if (!fs.existsSync(full)) {
    r.addViolation(
      reqPath,
      0,
      `Missing required route loading UI: ${reqPath}`,
      {
        fix: "Add a Server Component loading.tsx skeleton for this segment so navigations stream a fallback.",
      }
    );
  }
});

SEARCH_PARAMS_PAGES.forEach((reqPath) => {
  const full = path.join(rootDir, reqPath);
  if (!fs.existsSync(full)) return;
  const code = fs.readFileSync(full, "utf8");
  if (!/\bsearchParams\b/.test(code)) {
    r.addViolation(
      reqPath,
      1,
      "Public list/filter page must read URL `searchParams` in the RSC page and fetch on the server",
      {
        fix: "Accept `searchParams` on the page, fetch with q/category/inStock, and let the client only `router.replace` the query string.",
      }
    );
  }
  if (isUseClient(code)) {
    r.addViolation(
      reqPath,
      1,
      '"use client" on page — App Router pages must stay Server Components',
      { fix: "Keep the page as an RSC and move interactivity into a thin client island." }
    );
  }
});

const nextConfigPath = path.join(rootDir, "next.config.ts");
if (fs.existsSync(nextConfigPath)) {
  const configCode = fs.readFileSync(nextConfigPath, "utf8");
  if (/hostname\s*:\s*['"]\*\*['"]/.test(configCode)) {
    r.addViolation(
      "next.config.ts",
      1,
      "Forbidden catch-all `images.remotePatterns` hostname `'**'` — scope hosts (e.g. `**.r2.dev`)",
      { fix: "Replace hostname: '**' with explicit CDN hosts such as '**.r2.dev' plus localhost if needed." }
    );
  }
}

const catalogClients = [
  "src/features/stores/components/store-catalog-client.tsx",
  "src/features/stores/components/store-discovery-shell.tsx",
];


catalogClients.forEach((reqPath) => {
  const full = path.join(rootDir, reqPath);
  if (!fs.existsSync(full)) return;
  const code = fs.readFileSync(full, "utf8");
  if (/useEffect\s*\(/.test(code) && /fetch|listStores|listProducts|publicApiRequest/.test(code)) {
    r.addViolation(
      reqPath,
      1,
      "Forbidden client `useEffect` data fetch for catalog/discovery — drive filters via URL searchParams and RSC fetch",
      {
        fix: "Remove effect-based refetch. Update the query string with router.replace; let the server page re-fetch.",
      }
    );
  }
});

if (fs.existsSync(srcRoot)) {
  walkTree(srcRoot, (absPath, relPathRaw) => {
    if (!/\.(ts|tsx|js|jsx)$/.test(absPath)) return;

    const relPath = normalizeRel(relPathRaw);
    if (
      relPath.includes("components/ui/") ||
      relPath.includes("next-env.d.ts") ||
      relPath.startsWith("src/i18n/")
    ) {
      return;
    }

    const code = fs.readFileSync(absPath, "utf8");
    const base = path.basename(absPath);

    if (base === "page.tsx") {
      if (isUseClient(code)) {
        r.addViolation(
          relPath,
          1,
          '"use client" on page — App Router pages must stay Server Components for metadata and RSC data fetching',
          { fix: "Remove 'use client' from the page and extract interactive UI into a client component." }
        );
      }
      if (isNullOnlyPage(code)) {
        r.addViolation(
          relPath,
          1,
          "Stub page returns only `null` — remove dead parallel-route theater or render real content",
          { fix: "Delete unused slot pages or stream real UI from the page." }
        );
      }
    }

    let ast;
    try {
      ast = parseFile(absPath, code);
    } catch (e) {
      r.addParseError(relPath, e.message);
      return;
    }

    traverse(ast, {
      ImportDeclaration(p) {
        const source = p.node.source.value;
        const line = p.node.loc ? p.node.loc.start.line : 0;

        if (source === "next/link") {
          r.addViolation(
            relPath,
            line,
            "Forbidden direct `next/link` import — use localized `{ Link }` from `@/i18n/navigation` to maintain locale routing",
            { fix: "Change import to: import { Link } from '@/i18n/navigation';" }
          );
        }

        if (source === "next/navigation") {
          const forbiddenRoutingHooks = p.node.specifiers
            .filter(
              (spec) =>
                spec.type === "ImportSpecifier" &&
                ["useRouter", "usePathname"].includes(spec.imported.name)
            )
            .map((spec) => spec.imported.name);

          if (forbiddenRoutingHooks.length > 0 && !relPath.startsWith("src/app/not-found.tsx")) {
            r.addViolation(
              relPath,
              line,
              `Forbidden direct \`${forbiddenRoutingHooks.join(", ")}\` from \`next/navigation\` — use localized \`{ ${forbiddenRoutingHooks.join(", ")} }\` from \`@/i18n/navigation\` to maintain locale routing`,
              {
                fix: `Change import to: import { ${forbiddenRoutingHooks.join(", ")} } from '@/i18n/navigation';`,
              }
            );
          }
        }

        if (source === "react") {
          const hasLazy = p.node.specifiers.some(
            (spec) => spec.type === "ImportSpecifier" && spec.imported.name === "lazy"
          );
          if (hasLazy) {
            r.addViolation(
              relPath,
              line,
              "Forbidden `React.lazy` — use Next.js `dynamic()` from `next/dynamic` for SSR-compatible code splitting",
              { fix: "Replace with Next.js dynamic import: import dynamic from 'next/dynamic';" }
            );
          }
        }
      },

      JSXOpeningElement(p) {
        const name = p.node.name && p.node.name.name;
        const line = p.node.loc ? p.node.loc.start.line : 0;

        if (name === "img") {
          r.addViolation(
            relPath,
            line,
            "Forbidden raw `<img>` element — use Next.js `<Image>` from `next/image` for automatic optimization, responsive sizing, and CLS prevention",
            { fix: "Replace with Next.js `<Image>` from `next/image`." }
          );
        }

        if (name === "script" && !relPath.endsWith("src/app/layout.tsx")) {
          r.addViolation(
            relPath,
            line,
            "Forbidden raw `<script>` tag — use Next.js `<Script>` from `next/script` with an explicit loading strategy",
            { fix: "Replace with `<Script>` from `next/script`." }
          );
        }

        if (name === "head" || name === "title") {
          if (!relPath.endsWith("src/app/layout.tsx") && !relPath.includes("components/icons")) {
            r.addViolation(
              relPath,
              line,
              `Forbidden \`<${name}>\` tag in component body — Next.js App Router uses the Metadata API (\`export const metadata\` or \`generateMetadata\`)`,
              { fix: "Remove the tag and define page metadata using Next.js Metadata API." }
            );
          }
        }
      },
    });
  });
}

if (fs.existsSync(appRoot)) {
  const productPage = path.join(appRoot, "[locale]/shop/[slug]/product/[productId]/page.tsx");
  if (fs.existsSync(productPage)) {
    const code = fs.readFileSync(productPage, "utf8");
    if (
      !/next\/image/.test(code) &&
      !/ProductImageGallery/.test(code) &&
      !/ProductDetailView/.test(code) &&
      !/<Image\b/.test(code)
    ) {
      r.addViolation(
        "src/app/[locale]/shop/[slug]/product/[productId]/page.tsx",
        1,
        "Product detail RSC page should render optimized images (`next/image` or shared gallery)",
        { fix: "Render product photos with next/image (and placeholders) on the server page." }
      );
    }
  }
}

r.finish({
  fixTip:
    "Next.js Best Practices: RSC pages + searchParams fetching, loading.tsx skeletons, `@/i18n/navigation`, and `<Image>` from `next/image`.",
});
