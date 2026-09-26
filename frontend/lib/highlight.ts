/**
 * Tiny highlighter for the docs code blocks (Rust, JSON, shell).
 * Colour roles (design.md §5C.3): keyword/key .k · string .s ·
 * type, fn name, numeric value .nm · comment .c · plain ink-2.
 */
export type Lang = "rust" | "json" | "shell";
export type Token = { t: string; c?: "k" | "s" | "nm" | "c" };

const KEYWORDS: Record<Lang, string[]> = {
  rust: ["pub", "fn", "struct", "enum", "if", "return", "let", "mut", "impl", "use", "match", "Ok", "Err"],
  json: ["true", "false", "null"],
  shell: ["curl"],
};

export function highlight(code: string, lang: Lang): Token[] {
  const comment = lang === "shell" ? String.raw`#[^\n]*` : String.raw`//[^\n]*`;
  const re = new RegExp(
    [
      `(?<c>${comment})`,
      String.raw`(?<key>"[^"\n]*"(?=\s*:))`,
      String.raw`(?<s>"[^"\n]*")`,
      String.raw`(?<flag>(?<=\s)-{1,2}[A-Za-z][\w-]*)`,
      String.raw`(?<num>\b\d[\d_]*(?:\.\d+)?(?:e\d+)?\b)`,
      String.raw`(?<word>[A-Za-z_][\w]*)`,
    ].join("|"),
    "g",
  );
  const out: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(re)) {
    if (m.index! > last) out.push({ t: code.slice(last, m.index) });
    const g = m.groups!;
    const text = m[0];
    if (g.c) out.push({ t: text, c: "c" });
    else if (g.key) out.push({ t: text, c: "k" });
    else if (g.s) out.push({ t: text, c: "s" });
    else if (g.flag) out.push({ t: text, c: "k" });
    else if (g.num) out.push({ t: text, c: "nm" });
    else {
      const after = code.slice(m.index! + text.length);
      const isKw = KEYWORDS[lang].includes(text);
      const isType = lang === "rust" && (/^[A-Z]/.test(text) || text === "f64" || text === "bool");
      const isFn = lang === "rust" && /^\s*\(/.test(after);
      out.push({ t: text, c: isKw ? "k" : isType || isFn ? "nm" : undefined });
    }
    last = m.index! + text.length;
  }
  if (last < code.length) out.push({ t: code.slice(last) });
  return out;
}
