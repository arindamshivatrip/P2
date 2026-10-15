import { getNoteImage } from "@/lib/messages/store";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// A drawing never changes once posted, so browsers keep it for a year. The CDN
// keeps it for a day, so a note hidden by the admin drops out of the cache too.
const CACHE = "public, max-age=31536000, s-maxage=86400, immutable";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return new Response("Not found.", { status: 404 });

  let dataUrl: string | null;
  try {
    dataUrl = await getNoteImage(id);
  } catch (error) {
    console.error("[messages] failed to read drawing", error);
    return new Response("Unavailable.", { status: 503 });
  }

  const match = dataUrl && /^data:(image\/(?:png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) return new Response("Not found.", { status: 404 });

  return new Response(Buffer.from(match[2], "base64"), {
    headers: {
      "Content-Type": match[1],
      "Cache-Control": CACHE,
      "X-Content-Type-Options": "nosniff"
    }
  });
}
