import type { Project } from "@/types/project";

type TileMediaVariant = "flagship" | "standard" | "immersive";

const fallbackByTheme: Record<
  NonNullable<Project["themeKey"]> | "default",
  Record<TileMediaVariant, string>
> = {
  AI: {
    flagship:
      "linear-gradient(140deg, #30343b 0%, #232931 45%, #1b3f49 100%), radial-gradient(circle at 20% 25%, rgba(173, 181, 189, 0.15), transparent 55%), repeating-linear-gradient(45deg, rgba(245,244,237,0.03) 0 2px, transparent 2px 14px)",
    standard:
      "linear-gradient(135deg, #2d333c 0%, #23282f 52%, #2b4e57 100%), radial-gradient(circle at 75% 20%, rgba(245,244,237,0.12), transparent 45%)",
    immersive:
      "linear-gradient(160deg, #32495d 0%, #273542 45%, #1c252e 100%), radial-gradient(circle at 70% 25%, rgba(245,244,237,0.12), transparent 48%)"
  },
  XR: {
    flagship:
      "linear-gradient(155deg, #a9b4c2 0%, #6d7c8d 50%, #3e444d 100%), radial-gradient(circle at 25% 18%, rgba(245,244,237,0.25), transparent 42%)",
    standard:
      "linear-gradient(150deg, #93a6b8 0%, #5f7388 48%, #3f454f 100%), radial-gradient(circle at 70% 22%, rgba(245,244,237,0.2), transparent 44%)",
    immersive:
      "linear-gradient(150deg, #9ab2c7 0%, #607186 42%, #3b3c3f 100%), radial-gradient(circle at 18% 20%, rgba(245,244,237,0.3), transparent 52%)"
  },
  Research: {
    flagship:
      "linear-gradient(145deg, #d2c6b8 0%, #b8aa98 54%, #9e9588 100%), repeating-linear-gradient(0deg, rgba(31,31,31,0.05) 0 1px, transparent 1px 15px)",
    standard:
      "linear-gradient(140deg, #d7cbbe 0%, #c2b4a3 56%, #a79d90 100%), repeating-linear-gradient(0deg, rgba(31,31,31,0.05) 0 1px, transparent 1px 16px)",
    immersive:
      "linear-gradient(140deg, #c7b9aa 0%, #b3a48f 56%, #928a7c 100%), repeating-linear-gradient(0deg, rgba(31,31,31,0.05) 0 1px, transparent 1px 14px)"
  },
  Data: {
    flagship:
      "linear-gradient(145deg, #3f3f45 0%, #2f3239 46%, #2d4b54 100%), repeating-linear-gradient(90deg, rgba(245,244,237,0.04) 0 1px, transparent 1px 12px)",
    standard:
      "linear-gradient(140deg, #3b3d44 0%, #2e3137 52%, #2e4952 100%), repeating-linear-gradient(90deg, rgba(245,244,237,0.04) 0 1px, transparent 1px 10px)",
    immersive:
      "linear-gradient(140deg, #43454b 0%, #32353b 52%, #2f4b54 100%), repeating-linear-gradient(90deg, rgba(245,244,237,0.04) 0 1px, transparent 1px 11px)"
  },
  Web: {
    flagship:
      "linear-gradient(145deg, #cbc0b2 0%, #b3a494 56%, #8f8b84 100%), radial-gradient(circle at 70% 20%, rgba(245,244,237,0.2), transparent 46%)",
    standard:
      "linear-gradient(140deg, #d1c5b8 0%, #b9ab9b 58%, #958f85 100%), radial-gradient(circle at 72% 22%, rgba(245,244,237,0.2), transparent 45%)",
    immersive:
      "linear-gradient(140deg, #cbc1b4 0%, #b7aa9c 58%, #8f887d 100%), radial-gradient(circle at 65% 20%, rgba(245,244,237,0.2), transparent 44%)"
  },
  Mobile: {
    flagship:
      "linear-gradient(145deg, #9aa7b6 0%, #6f7f8f 55%, #4f5963 100%), radial-gradient(circle at 22% 20%, rgba(245,244,237,0.24), transparent 44%)",
    standard:
      "linear-gradient(145deg, #9eabbb 0%, #758495 55%, #525d68 100%), radial-gradient(circle at 22% 20%, rgba(245,244,237,0.24), transparent 44%)",
    immersive:
      "linear-gradient(145deg, #98a8ba 0%, #6f8091 55%, #4e5862 100%), radial-gradient(circle at 22% 20%, rgba(245,244,237,0.24), transparent 44%)"
  },
  Editorial: {
    flagship:
      "linear-gradient(145deg, #c7b9a6 0%, #ad9f8d 55%, #888078 100%), repeating-linear-gradient(45deg, rgba(31,31,31,0.03) 0 2px, transparent 2px 16px)",
    standard:
      "linear-gradient(145deg, #cebfac 0%, #b4a593 55%, #8c8379 100%), repeating-linear-gradient(45deg, rgba(31,31,31,0.03) 0 2px, transparent 2px 16px)",
    immersive:
      "linear-gradient(145deg, #c8bbab 0%, #b0a291 55%, #8a8278 100%), repeating-linear-gradient(45deg, rgba(31,31,31,0.03) 0 2px, transparent 2px 16px)"
  },
  default: {
    flagship:
      "linear-gradient(145deg, #b8b0a5 0%, #958b7f 56%, #746f68 100%), radial-gradient(circle at 20% 18%, rgba(245,244,237,0.25), transparent 42%)",
    standard:
      "linear-gradient(145deg, #bcb4a8 0%, #9b9084 56%, #79736c 100%), radial-gradient(circle at 20% 18%, rgba(245,244,237,0.24), transparent 42%)",
    immersive:
      "linear-gradient(145deg, #b7aea3 0%, #948a7f 56%, #746d66 100%), radial-gradient(circle at 20% 18%, rgba(245,244,237,0.24), transparent 42%)"
  }
};

export function getFallbackCoverImage(project: Project, variant: TileMediaVariant): string {
  const key = project.themeKey ?? "default";
  return fallbackByTheme[key][variant];
}
