"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print this guide" }: { label?: string }) {
  return <button type="button" className="button button-outline print-control" onClick={() => window.print()}>
    <Printer size={17} aria-hidden="true" />{label}
  </button>;
}
