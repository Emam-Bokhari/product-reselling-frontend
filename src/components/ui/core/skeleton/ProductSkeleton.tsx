import { Skeleton } from "../../skeleton";

export default function ProductSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
      <Skeleton className="h-56 w-full rounded-xl bg-slate-100" />
      <div className="mt-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded bg-slate-100" />
          <Skeleton className="h-4 w-14 rounded bg-slate-100" />
        </div>
        <Skeleton className="h-5 w-4/5 rounded bg-slate-100" />
        <Skeleton className="h-3.5 w-1/2 rounded bg-slate-100" />
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Skeleton className="h-6 w-24 rounded bg-slate-100" />
          <Skeleton className="h-8 w-20 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
