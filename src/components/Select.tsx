import { forwardRef, SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string };

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, className, children, ...props }, ref) => {
    const base =
      "w-full rounded-xl px-3 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary";
    const state = error ? "border-rose-400 focus:ring-rose-300" : "border-neutral-300";
    const disabledCls = props.disabled ? "opacity-60 cursor-not-allowed" : "";
    const errorId = props.id ? `${props.id}-error` : undefined;

    return (
      <label className="block">
        {label ? <span className="block text-sm font-medium mb-1">{label}</span> : null}
        <select
          ref={ref}
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${base} ${state} ${disabledCls} ${className ?? ""}`}
        >
          {children}
        </select>
        {error ? (
          <span id={errorId} className="text-rose-600 text-sm mt-1 inline-block">
            {error}
          </span>
        ) : null}
      </label>
    );
  }
);
Select.displayName = "Select";
export default Select;
