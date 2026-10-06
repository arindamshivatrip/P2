"use client";

import { QRCodeSVG } from "qrcode.react";

// Shown from the owner's phone so someone without NFC can scan it.
export function CardQr({ value }: { value: string }) {
  return (
    <QRCodeSVG
      value={value}
      size={208}
      bgColor="#ffffff"
      fgColor="#1f1f1f"
      level="M"
      marginSize={2}
      aria-label="QR code linking to this card"
      className="h-auto w-full max-w-[13rem]"
    />
  );
}
