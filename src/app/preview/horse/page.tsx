import type { Metadata } from "next";
import { InquiryAnimationPreview } from "@/components/inquiry-animation-preview";

export const metadata: Metadata = {
  title: "Trail Animation Preview",
  description: "A preview of the Happy Trails inquiry animation. No messages are sent.",
  robots: { index: false, follow: false },
};

export default function HorsePreviewPage() {
  return <InquiryAnimationPreview />;
}
