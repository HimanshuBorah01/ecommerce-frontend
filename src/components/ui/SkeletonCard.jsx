export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-1/3 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
