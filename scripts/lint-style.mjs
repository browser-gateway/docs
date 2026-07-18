#!/usr/bin/env node
/**
 * Lint MDX pages under content/docs/ for style violations.
 *
 * Rules:
 *   - No em-dash (—) anywhere in prose (code fences and inline code are ignored).
 *   - No marketing fluff words (just, simply, awesome, ...).
 *   - No casual narrator phrases (Don't worry, Let's dive in, ...).
 *
 * Usage:
 *   node scripts/lint-style.mjs        # scan all mdx, exit non-zero on any hit
 *   node scripts/lint-style.mjs FILE   # scan one file
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../content/docs");

const BANNED_CHARS = [
  { char: "—", label: "em-dash", hint: "Use a period, colon, comma, or rewrite." },
];

const EMPTY_WORDS = [
  "\\bjust\\b",
  "\\bsimply\\b",
  "\\beasily\\b",
  "\\bsuper easy\\b",
  "\\bawesome\\b",
  "\\bamazing\\b",
  "\\bpowerful\\b",
  "\\bblazing fast\\b",
  "\\brobust\\b",
  "\\benterprise-grade\\b",
  "\\bproduction-ready\\b",
  "\\bgame-changer\\b",
  "\\brevolutionary\\b",
  "\\bmagical\\b",
  "\\bseamless(ly)?\\b",
  "\\beffortless(ly)?\\b",
];

const NARRATOR_PHRASES = [
  "don't worry",
  "you'll love",
  "we think",
  "let's dive in",
  "\\bawesome!\\b",
  "\\bgreat!\\b",
  "\\bperfect!\\b",
  "we're excited to",
  "our amazing",
  "we love",
];

function walkMdx(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkMdx(full));
    else if (entry.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function maskCode(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, (m) => " ".repeat(m.length))
    .replace(/`[^`]*`/g, (m) => " ".repeat(m.length));
}

function findHits(text, pattern, flags = "gi") {
  const hits = [];
  const rx = new RegExp(pattern, flags);
  let m;
  while ((m = rx.exec(text)) !== null) {
    hits.push({ index: m.index, match: m[0] });
  }
  return hits;
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function lintFile(path) {
  const raw = readFileSync(path, "utf8");
  const masked = maskCode(raw);
  const findings = [];

  for (const { char, label, hint } of BANNED_CHARS) {
    const hits = findHits(masked, char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    for (const h of hits) {
      findings.push({ line: lineOf(raw, h.index), kind: label, snippet: h.match, hint });
    }
  }

  for (const pattern of EMPTY_WORDS) {
    for (const h of findHits(masked, pattern, "gi")) {
      findings.push({
        line: lineOf(raw, h.index),
        kind: "marketing-fluff",
        snippet: h.match,
        hint: "Drop the qualifier or rewrite without it.",
      });
    }
  }

  for (const pattern of NARRATOR_PHRASES) {
    for (const h of findHits(masked, pattern, "gi")) {
      findings.push({
        line: lineOf(raw, h.index),
        kind: "narrator-voice",
        snippet: h.match,
        hint: "Speak about the product, not to the reader.",
      });
    }
  }

  return findings;
}

function main() {
  const argFile = process.argv[2];
  const files = argFile ? [resolve(argFile)] : walkMdx(ROOT);
  let total = 0;
  for (const path of files) {
    const findings = lintFile(path);
    if (findings.length === 0) continue;
    total += findings.length;
    const rel = relative(process.cwd(), path);
    console.log(`\n${rel}`);
    for (const f of findings) {
      console.log(`  L${f.line}  [${f.kind}]  "${f.snippet}"  ${f.hint}`);
    }
  }
  if (total === 0) {
    console.log(`✓ ${files.length} files clean`);
    return;
  }
  console.log(`\n${total} finding(s) across ${files.length} file(s). Fix and re-run.`);
  process.exit(1);
}

main();
