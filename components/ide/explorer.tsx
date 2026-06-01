"use client";

import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Node =
  | { type: "file"; name: string; href: string }
  | { type: "folder"; name: string; children: Node[] };

const tree: Node[] = [
  {
    type: "folder",
    name: "app",
    children: [
      { type: "file", name: "page.tsx", href: "/" },
      {
        type: "folder",
        name: "about",
        children: [{ type: "file", name: "page.tsx", href: "/about" }],
      },
      {
        type: "folder",
        name: "work",
        children: [{ type: "file", name: "page.tsx", href: "/work" }],
      },
      {
        type: "folder",
        name: "writing",
        children: [{ type: "file", name: "page.tsx", href: "/writing" }],
      },
      {
        type: "folder",
        name: "contact",
        children: [{ type: "file", name: "page.tsx", href: "/contact" }],
      },
      {
        type: "folder",
        name: "resume",
        children: [{ type: "file", name: "page.tsx", href: "/resume" }],
      },
    ],
  },
];

function FileLeaf({ node, active }: { node: Extract<Node, { type: "file" }>; active: boolean }) {
  return (
    <Link
      href={node.href}
      className={`flex items-center gap-2 py-0.5 pl-6 pr-2 text-sm hover:bg-bg-ide-activity ${
        active ? "bg-bg-ide-activity text-fg-ide-default" : "text-fg-ide-comment"
      }`}
    >
      <File className="size-4 text-fg-ide-comment" />
      <span>{node.name}</span>
    </Link>
  );
}

function FolderNode({
  node,
  pathname,
}: {
  node: Extract<Node, { type: "folder" }>;
  pathname: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1 py-0.5 pl-2 pr-2 text-sm text-fg-ide-comment hover:bg-bg-ide-activity"
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        <Folder className="size-4 text-fg-ide-comment" />
        <span>{node.name}</span>
      </button>
      {open && (
        <div className="ml-2">
          {node.children.map((child) =>
            child.type === "file" ? (
              <FileLeaf key={child.href} node={child} active={pathname === child.href} />
            ) : (
              <FolderNode key={child.name} node={child} pathname={pathname} />
            ),
          )}
        </div>
      )}
    </div>
  );
}

export function Explorer() {
  const pathname = usePathname();
  return (
    <aside
      aria-label="Explorer"
      className="hidden w-56 shrink-0 flex-col bg-bg-ide-sidebar pt-2 text-fg-ide-default lg:flex"
    >
      <div className="px-3 pb-2 text-xs uppercase tracking-wide text-fg-ide-comment">Explorer</div>
      <div className="flex-1 overflow-y-auto pb-2">
        {tree.map((node) =>
          node.type === "folder" ? (
            <FolderNode key={node.name} node={node} pathname={pathname} />
          ) : null,
        )}
      </div>
    </aside>
  );
}
