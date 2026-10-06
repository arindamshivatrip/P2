import { readFile } from "node:fs/promises";
import path from "node:path";
import { cardContact, cardIdentity } from "@/data/card";

export const dynamic = "force-static";

// vCard lines must be CRLF-terminated and folded at 75 octets.
function fold(line: string): string {
  const chunks: string[] = [];
  for (let i = 0; i < line.length; i += 74) {
    chunks.push(line.slice(i, i + 74));
  }
  return chunks.join("\r\n ");
}

// Kept ASCII so the character-based folding above stays within the octet limit.
function escapeText(value: string): string {
  return value
    .replace(/·/g, "-")
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export async function GET() {
  const photo = await readFile(path.join(process.cwd(), "public", cardIdentity.avatar));
  const [first, middle, last] = cardIdentity.formalName.split(" ");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${last};${first};${middle};;`,
    `FN:${escapeText(cardIdentity.name)}`,
    "ORG:University of Maryland",
    `TITLE:${escapeText("MS HCI · Android XR Google Trusted Developer")}`,
    `EMAIL;TYPE=INTERNET,PREF:${cardContact.email}`,
    `EMAIL;TYPE=INTERNET:${cardContact.backupEmail}`,
    `URL:${cardContact.site}`,
    `URL;TYPE=LinkedIn:${cardContact.linkedin}`,
    `URL;TYPE=GitHub:${cardContact.github}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${cardContact.linkedin}`,
    `NOTE:${escapeText(`${cardIdentity.badge}. ${cardIdentity.line}.`)}`,
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo.toString("base64")}`,
    "END:VCARD"
  ];

  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="arindam-tripathi.vcf"'
    }
  });
}
