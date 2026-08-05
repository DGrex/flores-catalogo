import FlorGridSkeleton from "@/components/FlorGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 sm:mb-10">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-neutral-200" />
      </div>
      <FlorGridSkeleton />
    </div>
  );
}
