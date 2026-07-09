type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Renders a JSON-LD structured-data script. Server component — no client JS.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static, derived from site data — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
