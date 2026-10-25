interface ArticleYoutubeVideoProps {
  url: string;
  title?: string;
  className?: string;
}

export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export function ArticleYoutubeVideo({
  url,
  title = "MedLex Video",
  className = "",
}: ArticleYoutubeVideoProps) {
  const videoId = extractYoutubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return (
    <figure className={`my-8 ${className}`}>
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#d6b03f]/30 shadow-2xl bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </figure>
  );
}
