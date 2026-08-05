export default function FlorGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Cargando catálogo"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-xl2 bg-white ring-1 ring-black/5">
          <div className="aspect-square bg-neutral-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded bg-neutral-200" />
            <div className="h-3 w-full rounded bg-neutral-200" />
            <div className="h-3 w-1/2 rounded bg-neutral-200" />
            <div className="h-9 w-full rounded-xl bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
