import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownNode = {
  type: string;
  value?: string;
  children?: MarkdownNode[];
};

function remarkSpacedBold() {
  return (tree: MarkdownNode) => {
    const visit = (node: MarkdownNode) => {
      if (!node.children) return;
      node.children = node.children.flatMap((child) => {
        if (child.type !== "text" || !child.value) return [child];
        const parts: MarkdownNode[] = [];
        const pattern = /\*\*[ \t]+([^*\r\n]+?)[ \t]+\*\*/g;
        let start = 0;
        for (const match of child.value.matchAll(pattern)) {
          const index = match.index ?? 0;
          if (index > start) parts.push({ type: "text", value: child.value.slice(start, index) });
          parts.push({ type: "strong", children: [{ type: "text", value: match[1] }] });
          start = index + match[0].length;
        }
        if (start === 0) return [child];
        if (start < child.value.length) parts.push({ type: "text", value: child.value.slice(start) });
        return parts;
      });
      node.children.forEach(visit);
    };
    visit(tree);
  };
}

export function ReadingMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-4 overflow-x-auto text-sm leading-7 text-slate-700
      [&_h1]:text-2xl [&_h1]:font-black [&_h2]:text-xl [&_h2]:font-black [&_h3]:text-lg [&_h3]:font-black
      [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
      [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4
      [&_a]:text-primary [&_a]:underline
      [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-100
      [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse
      [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:font-black [&_th]:text-slate-800
      [&_td]:border [&_td]:border-slate-300 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkSpacedBold]}>{content}</ReactMarkdown>
    </div>
  );
}
