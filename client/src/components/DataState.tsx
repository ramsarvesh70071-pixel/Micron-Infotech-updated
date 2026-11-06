import React from "react";
import { Loader2, AlertTriangle } from "lucide-react";

/** Consistent loading / error UI for every data driven section. */
export function SectionLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500" role="status">
      <Loader2 className="w-4 h-4 animate-spin" /> {label}
    </div>
  );
}

export function SectionError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="max-w-xl mx-auto my-8 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700" role="alert">
      <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700">
          Try again
        </button>
      )}
    </div>
  );
}

export function SectionEmpty({ label }: { label: string }) {
  return <p className="py-10 text-center text-sm text-slate-500">{label}</p>;
}

/** Renders loading / error / empty states, otherwise the children. */
export function DataBoundary({
  loading, error, empty, emptyLabel = "Nothing to show yet.", onRetry, children
}: {
  loading: boolean; error: string | null; empty?: boolean; emptyLabel?: string; onRetry?: () => void; children: React.ReactNode;
}) {
  if (loading) return <SectionLoading />;
  if (error) return <SectionError message={error} onRetry={onRetry} />;
  if (empty) return <SectionEmpty label={emptyLabel} />;
  return <>{children}</>;
}
