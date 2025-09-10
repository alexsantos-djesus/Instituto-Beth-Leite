import { Cinzel, Great_Vibes } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });
const script = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

export default function Brand({ variant = "header" }: { variant?: "header" | "hero" }) {
  const institutoSize = variant === "hero" ? "text-[30px] md:text-[56px]" : "text-lg";
  const bethSize = variant === "hero" ? "text-[34px] md:text-[60px]" : "text-xl";

  return (
    <span className="inline-flex items-baseline gap-1">
      <span
        className={`${cinzel.className} ${institutoSize} font-extrabold tracking-wide text-neutral-900`}
      >
        Instituto
      </span>
      <span className={`${script.className} ${bethSize} leading-none text-brand-secondary`}>
        Beth Leite
      </span>
    </span>
  );
}
