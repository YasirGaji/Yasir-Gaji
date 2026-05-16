import { type PortableTextComponents, PortableText as PTReact } from "@portabletext/react";
import Image from "next/image";
import { codeToHtml } from "shiki";
import { urlForImage } from "@/sanity/lib/image";

type CodeBlock = { _type: "codeBlock"; language?: string; code: string };

async function CodeBlock({ block }: { block: CodeBlock }) {
  const html = await codeToHtml(block.code, {
    lang: block.language || "ts",
    theme: "github-dark-dimmed",
  });
  return (
    <div
      className="my-6 overflow-x-auto rounded-md font-mono text-sm"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki escapes input
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1200).url();
      return (
        <figure className="my-8">
          <Image src={url} alt={value.alt ?? ""} width={1200} height={800} className="rounded-md" />
        </figure>
      );
    },
    codeBlock: ({ value }) => <CodeBlock block={value as CodeBlock} />,
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 font-display text-2xl font-medium">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-display text-xl font-medium">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-accent-editorial pl-4 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="underline underline-offset-2 hover:text-accent-editorial"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.92em] dark-editorial:bg-white/10">
        {children}
      </code>
    ),
  },
};

export function PortableText({ value }: { value: unknown }) {
  if (!value) return null;
  return <PTReact value={value} components={components} />;
}
