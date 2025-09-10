import { ReactNode } from "react";
export default function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="py-12">
      <div className="container max-w-6xl">
        {title ? <h2 className="text-xl font-extrabold mb-6">{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}
