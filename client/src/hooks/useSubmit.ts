import { useCallback, useState } from "react";
import { errorMessage } from "../services/api";

/**
 * Wraps a form submission: tracks "submitting", surfaces the real server error and only reports success
 * when the API call really succeeded (the old code showed a fake success even when the request failed).
 */
export function useSubmit<R = any>() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<R | null>(null);

  const submit = useCallback(async (call: () => Promise<R>): Promise<R | null> => {
    if (submitting) return null;
    setSubmitting(true);
    setError("");
    try {
      const res = await call();
      setResult(res);
      return res;
    } catch (e) {
      setError(errorMessage(e));
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [submitting]);

  const reset = useCallback(() => {
    setError("");
    setResult(null);
  }, []);

  return { submit, submitting, error, result, done: result !== null, reset };
}
