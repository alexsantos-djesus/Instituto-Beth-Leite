import { ReactNode } from "react";
export default function FormField({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {children}
      {error ? <span className="text-danger text-sm">{error}</span> : null}
    </label>
  );
}
