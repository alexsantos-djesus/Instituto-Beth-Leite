"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoBackToAnimals({ delay = 120000 }: { delay?: number }) {
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        router.push("/animais");
      }, delay);
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [router, delay]);

  return null;
}
