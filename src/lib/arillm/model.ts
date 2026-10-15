import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { wrapLanguageModel, type LanguageModel } from "ai";

// Switch providers with env vars alone:
//   AI_PROVIDER=google|anthropic, AI_MODEL (optional override)
//   AI_FALLBACK_PROVIDER / AI_FALLBACK_MODEL (optional second model)
// Each provider reads its own API key env var.
type ProviderName = "google" | "anthropic";

const defaultModels: Record<ProviderName, string> = {
  google: "gemini-flash-latest",
  anthropic: "claude-haiku-5-5"
};

function parseProvider(value: string | undefined): ProviderName | null {
  return value === "google" || value === "anthropic" ? value : null;
}

function createModel(provider: ProviderName, modelId: string | undefined) {
  const id = modelId || defaultModels[provider];
  return provider === "anthropic" ? anthropic(id) : google(id);
}

export function hasFallback(): boolean {
  return parseProvider(process.env.AI_FALLBACK_PROVIDER) !== null;
}

export function getModel(): LanguageModel {
  const primary = createModel(
    parseProvider(process.env.AI_PROVIDER) ?? "google",
    process.env.AI_MODEL
  );

  const fallbackProvider = parseProvider(process.env.AI_FALLBACK_PROVIDER);
  if (!fallbackProvider) return primary;
  const fallback = createModel(fallbackProvider, process.env.AI_FALLBACK_MODEL);

  // If the primary call fails before streaming starts (bad key, outage, rate
  // limit), send the same request to the fallback instead. Non-streamed calls
  // (Messages moderation) get the same treatment.
  return wrapLanguageModel({
    model: primary,
    middleware: {
      specificationVersion: "v4",
      wrapStream: async ({ doStream, params }) => {
        try {
          return await doStream();
        } catch (error) {
          console.error("[arillm] primary model failed, using fallback", error);
          return fallback.doStream(params);
        }
      },
      wrapGenerate: async ({ doGenerate, params }) => {
        try {
          return await doGenerate();
        } catch (error) {
          console.error("[arillm] primary model failed, using fallback", error);
          return fallback.doGenerate(params);
        }
      }
    }
  });
}
