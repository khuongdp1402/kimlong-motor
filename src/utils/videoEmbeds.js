// Small parsers to turn a pasted YouTube/TikTok URL into what each platform's
// embed needs (a plain video ID for YouTube, a numeric video ID for TikTok's
// official embed script).
export const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/
    );
    return match ? match[1] : null;
};

export const getTiktokVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
};
