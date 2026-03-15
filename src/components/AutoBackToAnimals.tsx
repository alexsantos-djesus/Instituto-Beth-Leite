"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoBackToAnimals({ delay = 120000 }: { delay?: number }) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/animais");
    }, delay);

    return () => clearTimeout(t);
  }, [router, delay]);

  return null;
}
