import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-wide text-accent-editorial">404</p>
      <h1 className="mt-3 font-display text-4xl font-medium">Page not found</h1>
      <p className="mt-3 text-muted-editorial-light dark-editorial:text-muted-editorial-dark">
        That URL doesn't match anything Yasir has published.
      </p>
      <p className="mt-6">
        <Link href="/" className="underline underline-offset-4">
          Back to home →
        </Link>
      </p>
    </div>
  );
}
