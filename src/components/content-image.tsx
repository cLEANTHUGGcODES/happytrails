import Image, { type ImageProps } from "next/image";
import { getSiteMedia, type MediaSlot } from "@/lib/content";

type Props = Omit<ImageProps, "src" | "alt"> & { slot: MediaSlot };

/** Server-rendered photograph sourced through the shared content adapter. */
export async function ContentImage({ slot, style, ...props }: Props) {
  const media = await getSiteMedia(slot);
  return (
    <Image
      {...props}
      src={media.src}
      alt={media.alt}
      style={{ objectPosition: media.position, ...style }}
    />
  );
}
