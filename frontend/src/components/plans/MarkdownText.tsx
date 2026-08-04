"use client";

function inlineMarkdown(text: string) {
  const pieces = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return pieces.map((piece, index) => {
    if (piece.startsWith("**") && piece.endsWith("**")) {
      return <strong key={index}>{piece.slice(2, -2)}</strong>;
    }
    if (piece.startsWith("`") && piece.endsWith("`")) {
      return <code key={index} className="rounded bg-slate-100 px-1 py-0.5 text-xs">{piece.slice(1, -1)}</code>;
    }
    return <span key={index}>{piece}</span>;
  });
}

export function MarkdownText({ value }: { value: string }) {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "));

  if (isList) {
    return (
      <ul className="space-y-1.5 text-sm leading-6 text-slate-700">
        {lines.map((line, index) => (
          <li key={`${line}-${index}`} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
            <span>{inlineMarkdown(line.slice(2))}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-2 text-sm leading-6 text-slate-700">
      {lines.map((line, index) => (
        <p key={`${line}-${index}`}>{inlineMarkdown(line)}</p>
      ))}
    </div>
  );
}
