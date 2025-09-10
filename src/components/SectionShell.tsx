import { ReactNode } from "react";
import Container from "@/components/Container";

export default function SectionShell({
  id,
  tone = "amber",
  children,
  className = "",
}: {
  id?: string;
  tone?: "amber" | "teal" | "indigo";
  children: ReactNode;
  className?: string;
}) {
  const bg =
    tone === "amber"
      ? "from-amber-100 via-amber-50 to-white"
      : tone === "teal"
      ? "from-teal-100 via-teal-50 to-white"
      : "from-indigo-100 via-indigo-50 to-white";

  const ring =
    tone === "amber" ? "ring-amber-200" : tone === "teal" ? "ring-teal-200" : "ring-indigo-200";

  return (
    <section id={id} className={`relative py-12 sm:py-16 ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${bg}`} aria-hidden />
      <div className="absolute inset-0">
        <div className="absolute -top-10 left-1/2 size-64 -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-white" />
      </div>

      <Container>
        <div
          className={`relative rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ${ring} shadow-xl shadow-black/5`}
        >
          <div className="rounded-3xl p-6 sm:p-8">{children}</div>
        </div>
      </Container>
    </section>
  );
}
