import React from "react";

/** Inline server error for forms + the hidden honeypot field that catches bots. */
export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
      {message}
    </p>
  );
}

export function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/** Reads the honeypot value from a submitted form event. */
export const honeypotValue = (e: React.FormEvent): string => {
  const el = (e.target as HTMLFormElement).elements.namedItem("website") as HTMLInputElement | null;
  return el?.value || "";
};
