import type { ReactNode } from "react";

/**
 * ממיר טקסט "עשיר" פשוט לרכיבי React: פסקאות מופרדות בשורה ריקה (\n\n),
 * ובלוק שכל שורותיו מתחילות ב-"- " הופך לרשימת תבליטים.
 */
export function formatRichText(text: string): ReactNode[] {
  const blocks = text.trim().split(/\n\s*\n/);

  return blocks.map((block, i) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "));

    if (isList) {
      return (
        <ul key={i} className={`list-disc space-y-1 pr-5 ${i > 0 ? "mt-2" : ""}`}>
          {lines.map((line, j) => (
            <li key={j}>{line.replace(/^- /, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={i} className={i > 0 ? "mt-2" : undefined}>
        {block}
      </p>
    );
  });
}
