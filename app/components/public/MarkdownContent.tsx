import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="text-2xl md:text-3xl font-bold mt-10 mb-4 tracking-tight" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3 tracking-tight" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-lg md:text-xl font-semibold mt-6 mb-2" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }) => (
    <p className="leading-relaxed mb-4 text-[15px] md:text-base" {...props}>{children}</p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 mb-4 space-y-1.5 text-[15px] md:text-base" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-[15px] md:text-base" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>{children}</li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-primary/40 pl-4 py-1 my-6 text-muted-foreground italic" {...props}>{children}</blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>{children}</code>
      );
    }
    return (
      <pre className="bg-muted/50 border border-border rounded-lg p-4 my-6 overflow-x-auto">
        <code className={`${className} text-sm font-mono leading-relaxed`} {...props}>{children}</code>
      </pre>
    );
  },
  pre: ({ children }) => <>{children}</>,
  a: ({ href, children, ...props }) => (
    <a href={href} className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined} {...props}>{children}</a>
  ),
  img: ({ src, alt, ...props }) => (
    <img src={src} alt={alt || ""} className="rounded-lg my-6 w-full" loading="lazy" {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse" {...props}>{children}</table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-border bg-muted/50 px-3 py-2 text-left font-semibold" {...props}>{children}</th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border px-3 py-2" {...props}>{children}</td>
  ),
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none
      prose-headings:scroll-mt-20
      prose-a:text-primary
      prose-code:text-sm
      prose-pre:bg-transparent prose-pre:p-0
      prose-img:rounded-lg
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
