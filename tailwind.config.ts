import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        serif: ["var(--font-serif)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      fontSize: {
        // one voice for uppercase metadata/labels
        "label-xs": ["0.6rem", { lineHeight: "1.4", letterSpacing: "0.13em" }],
        label: ["0.68rem", { lineHeight: "1.4", letterSpacing: "0.13em" }],
        "label-lg": ["0.78rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
        // body ladder
        caption: ["0.82rem", { lineHeight: "1.55" }],
        "body-sm": ["0.9rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-lg": ["1.08rem", { lineHeight: "1.6" }],
        // display ladder — clamp replaces per-page vw/breakpoint stacks
        "display-xs": ["clamp(1.55rem, 2.4vw, 2.1rem)", { lineHeight: "1.15" }],
        "display-sm": ["clamp(2rem, 3.2vw, 3.15rem)", { lineHeight: "1.08" }],
        "display-md": ["clamp(2.4rem, 4.4vw, 4.2rem)", { lineHeight: "1.02" }],
        "display-lg": ["clamp(2.6rem, 7.5vw, 6.5rem)", { lineHeight: "0.95" }],
        "display-xl": ["clamp(2.6rem, 8.8vw, 7.75rem)", { lineHeight: "0.98" }]
      },
      spacing: {
        section: "var(--space-section)",
        container: "var(--space-container)"
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)"
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)"
      }
    }
  },
  plugins: []
};

export default config;
