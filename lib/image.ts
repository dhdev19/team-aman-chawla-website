/**
 * Image utility functions
 */

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const pathname = urlObj.pathname.toLowerCase();
    return validExtensions.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Get image dimensions from URL (placeholder - in real app, you'd fetch and check)
 */
export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/**
 * Generate thumbnail URL (if using a service like Cloudinary)
 */
export function getThumbnailUrl(
  imageUrl: string,
  width: number = 300,
  height: number = 300
): string {
  // This is a placeholder - implement based on your image service
  // Example for Cloudinary: return imageUrl.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`);
  return imageUrl;
}

/**
 * Extract YouTube video ID from URL
 */
export function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Extract Vimeo video ID from URL
 */
export function getVimeoVideoId(url: string): string | null {
  const regex = /(?:vimeo\.com\/)(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Get YouTube thumbnail URL from video URL
 */
export function getYouTubeThumbnail(videoUrl: string): string | null {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Get Vimeo thumbnail URL from video URL (requires API call in production)
 */
export function getVimeoThumbnail(videoUrl: string): string | null {
  const videoId = getVimeoVideoId(videoUrl);
  if (!videoId) return null;
  // Vimeo requires API call for thumbnails, this is a placeholder
  return null;
}

/**
 * Get video thumbnail (auto-detect YouTube or Vimeo)
 */
export function getVideoThumbnail(videoUrl: string): string | null {
  if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
    return getYouTubeThumbnail(videoUrl);
  }
  if (videoUrl.includes("vimeo.com")) {
    return getVimeoThumbnail(videoUrl);
  }
  return null;
}
