import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessage } from "../services/api";

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Runs an API call on mount (and when `deps` change). `select` maps the API response to what the component needs.
 * The latest request wins, so fast filter changes can never show stale data.
 */
export function useFetch<T, R = any>(
  call: () => Promise<{ data?: R } & Record<string, any>>,
  select: (res: { data?: R } & Record<string, any>) => T,
  deps: unknown[] = []
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const reqId = useRef(0);

  useEffect(() => {
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    call()
      .then((res) => {
        if (id === reqId.current) setData(select(res));
      })
      .catch((e) => {
        if (id === reqId.current) setError(errorMessage(e));
      })
      .finally(() => {
        if (id === reqId.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, reload };
}

/** Shortcut for list endpoints: `data` is always an array. */
export function useList<T = any>(call: () => Promise<any>, deps: unknown[] = []) {
  const s = useFetch<T[]>(call, (r) => (r.data as T[]) || [], deps);
  return { ...s, items: s.data || [] };
}
