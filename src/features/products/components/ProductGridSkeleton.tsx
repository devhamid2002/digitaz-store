import { Skeleton } from "@/components/ui/skeleton";

export default function ProductGridSkeleton() {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4">
            <Skeleton className="mb-3 h-36 w-full" />
            <Skeleton className="mb-2 h-3 w-1/3" />
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }