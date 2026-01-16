"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { videoApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { formatDate } from "@/lib/utils";
import { getVideoThumbnail } from "@/lib/image";
import Image from "next/image";
import Link from "next/link";

export default function VideoViewPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;

  const { data: video, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-video", videoId],
    queryFn: async () => {
      const response = await videoApi.getById(videoId);
      return response.data;
    },
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      return;
    }

    try {
      await videoApi.delete(videoId);
      router.push("/admin/videos");
    } catch (error) {
      alert("Failed to delete video. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !video) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load video</p>
        <Button variant="primary" onClick={() => router.push("/admin/videos")}>
          Back to Videos
        </Button>
      </div>
    );
  }

  const videoData = video as any;
  const thumbnail = videoData.thumbnail || getVideoThumbnail(videoData.videoLink);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {videoData.title}
          </h1>
          <p className="text-neutral-600">View video details</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/videos/${videoData.id}/edit`}>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Preview */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Video Preview
            </h2>
            {thumbnail ? (
              <div className="relative h-96 w-full rounded-lg overflow-hidden bg-neutral-200 mb-4">
                <Image
                  src={thumbnail}
                  alt={videoData.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <a
                    href={videoData.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Play video"
                  >
                    <svg
                      className="w-10 h-10 text-primary-700 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-96 w-full rounded-lg bg-neutral-200 flex items-center justify-center text-neutral-400 mb-4">
                No Thumbnail Available
              </div>
            )}

            <div>
              <a
                href={videoData.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-700 hover:underline font-medium"
              >
                Open Video Link →
              </a>
            </div>
          </Card>

          {/* Video Details */}
          {videoData.description && (
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Description
              </h2>
              <p className="text-neutral-700 whitespace-pre-line">
                {videoData.description}
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Title
                </label>
                <p className="mt-1 text-neutral-900">{videoData.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Video Link
                </label>
                <a
                  href={videoData.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-primary-700 hover:underline block break-all"
                >
                  {videoData.videoLink}
                </a>
              </div>

              {videoData.thumbnail && (
                <div>
                  <label className="text-sm font-medium text-neutral-600">
                    Thumbnail URL
                  </label>
                  <a
                    href={videoData.thumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-primary-700 hover:underline block break-all"
                  >
                    {videoData.thumbnail}
                  </a>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Display Order
                </label>
                <p className="mt-1 text-neutral-900">{videoData.order}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Created At
                </label>
                <p className="mt-1 text-neutral-900">
                  {formatDate(videoData.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">
                  Updated At
                </label>
                <p className="mt-1 text-neutral-900">
                  {formatDate(videoData.updatedAt)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              <Link href={`/admin/videos/${videoData.id}/edit`} className="block">
                <Button variant="primary" className="w-full">
                  Edit Video
                </Button>
              </Link>
              <Button
                variant="danger"
                className="w-full"
                onClick={handleDelete}
              >
                Delete Video
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
