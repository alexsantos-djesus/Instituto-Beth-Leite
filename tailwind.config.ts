import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        brand: {
          primary: "#F2C94C",
          primaryHover: "#E5B93F",
          secondary: "#2F855A",
          secondaryHover: "#276749",
          accent: "#F2994A",
          soft: "#FFF8E1",
        },
        neutral: {
          900: "#1F2937",
          800: "#374151",
          700: "#4B5563",
          600: "#6B7280",
          500: "#9CA3AF",
          200: "#E5E7EB",
          100: "#F3F4F6",
          50: "#FAFAFA"
        },
        success: "#16A34A",
        danger: "#DC2626",
        info: "#2563EB"
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
        pill: "999px"
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.08)"
      },
      fontSize: {
        "hero-title": ["clamp(28px, 4vw, 48px)", { lineHeight: "1.1", fontWeight: "800" }],
        "hero-sub": ["clamp(16px, 2vw, 20px)", { lineHeight: "1.5" }]
      }
    }
  },
  plugins: [],
} satisfies Config;
