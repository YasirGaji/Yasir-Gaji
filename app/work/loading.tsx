export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="h-10 w-48 animate-pulse rounded bg-black/5 dark-editorial:bg-white/10" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-md bg-black/5 dark-editorial:bg-white/10"
          />
        ))}
      </div>
    </div>
  );
}
