export function getYouTubeId(url: string) {
  const value = url.trim();
  if (/^[a-zA-Z0-9_-]{6,}$/.test(value) && !value.includes(".") && !value.includes("/")) {
    return value;
  }
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, "");
    const parts = parsed.pathname.split("/").filter(Boolean);

    if (host === "youtu.be") {
      return parts[0] || null;
    }

    if (host === "img.youtube.com" && parts[0] === "vi") {
      return parts[1] || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.searchParams.get("v")) {
        return parsed.searchParams.get("v");
      }
      if (["embed", "shorts", "live"].includes(parts[0])) {
        return parts[1] || null;
      }
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

export function isValidYouTubeUrl(url: string) {
  const id = getYouTubeId(url);
  return Boolean(id && /^[a-zA-Z0-9_-]{6,}$/.test(id));
}

export function toYouTubeEmbedUrl(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

export function toYouTubeThumbnailUrl(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}
