import Image from "next/image";
import { getVideoThumbnail } from "@/lib/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  videoLink: string;
  thumbnail: string | null;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoCardProps {
  video: Video;
  className?: string;
  onPlay?: (video: Video) => void;
}

export function VideoCard({ video, className, onPlay }: VideoCardProps) {
  const thumbnail = video.thumbnail || getVideoThumbnail(video.videoLink);

  return (
    <Card
      variant="elevated"
      className={cn(
        "group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300",
        className
      )}
      onClick={() => onPlay?.(video)}
    >
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            No Thumbnail
          </div>
        )}
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg
              className="w-8 h-8 text-primary-700 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-neutral-600 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </Card>
  );
}
