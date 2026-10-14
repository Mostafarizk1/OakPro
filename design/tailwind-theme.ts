// Tailwind theme extension — maps 1:1 to design/tokens.css. Use logical utilities (ms-/me-/ps-/pe-) only.
import type { Config } from "tailwindcss";

export const oakTheme: Config["theme"] = {
  extend: {
    colors: {
      primary: { DEFAULT: "var(--brand-primary)", hover: "var(--brand-primary-hover)", 50: "var(--brand-primary-50)" },
      accent: "var(--brand-accent)",
      secondary: "var(--brand-secondary)",
      ink: "var(--ink)",
      surface: { DEFAULT: "var(--surface)", muted: "var(--surface-muted)" },
      border: "var(--border)",
      muted: { foreground: "var(--muted-foreground)" },
    },
    fontFamily: { sans: ["var(--font-sans)"] },
    borderRadius: { sm: "2px", md: "4px", lg: "6px" },
    boxShadow: { 1: "var(--shadow-1)", 2: "var(--shadow-2)" },
    transitionTimingFunction: { out: "var(--ease-out)" },
  },
};
