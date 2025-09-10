export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-pill bg-brand-accent/15 text-brand-accent px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}
