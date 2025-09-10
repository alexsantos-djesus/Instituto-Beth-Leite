import { ButtonHTMLAttributes } from "react";

export default function Button({
  children,
  loading,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center rounded-pill px-5 py-2.5 font-medium transition";
  const style =
    variant === "secondary"
      ? "bg-brand-secondary text-white hover:bg-brand-secondaryHover"
      : variant === "ghost"
        ? "bg-white border border-neutral-200 hover:bg-neutral-100"
        : "bg-brand-primary text-neutral-900 hover:bg-brand-primaryHover";
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`${base} ${style} ${props.className ?? ""}`}
    >
      {loading ? "Enviando..." : children}
    </button>
  );
}
