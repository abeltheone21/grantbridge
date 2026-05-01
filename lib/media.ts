import { supabase } from "@/lib/supabase/client";

type MediaLike = {
  filename?: string | null;
  url?: string | null;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

function getMediaBaseUrl() {
  if (process.env.NEXT_PUBLIC_MEDIA_BASE_URL) {
    return process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  }

  if (process.env.NEXT_PUBLIC_PAYLOAD_URL) {
    return process.env.NEXT_PUBLIC_PAYLOAD_URL;
  }

  if (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ) {
    return "http://localhost:3001";
  }

  return "";
}

export function getMediaUrl(media?: MediaLike | null): string {
  if (!media) return "";

  if (media.url?.startsWith("http")) {
    return media.url;
  }

  const mediaBaseUrl = getMediaBaseUrl();

  if (media.url?.startsWith("/") && mediaBaseUrl) {
    return `${trimTrailingSlash(mediaBaseUrl)}${media.url}`;
  }

  if (media.filename && mediaBaseUrl) {
    return `${trimTrailingSlash(mediaBaseUrl)}/api/media/file/${encodeURIComponent(media.filename)}`;
  }

  if (media.filename) {
    const { data } = supabase.storage
      .from("media")
      .getPublicUrl(media.filename);

    return data.publicUrl;
  }

  return "";
}
