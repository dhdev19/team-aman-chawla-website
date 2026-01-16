"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { videoSchema, type VideoFormData } from "@/lib/validations/video";
import { videoApi, uploadApi } from "@/lib/api-client";
import { getVideoThumbnail } from "@/lib/image";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [autoThumbnail, setAutoThumbnail] = React.useState<string | null>(null);
  const [uploadedThumbnail, setUploadedThumbnail] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [existingThumbnail, setExistingThumbnail] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-video", videoId],
    queryFn: async () => {
      const response = await videoApi.getById(videoId);
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
  });

  const videoLink = watch("videoLink");

  React.useEffect(() => {
    if (data) {
      const videoData = data as any;
      const thumbnail = videoData.thumbnail || "";
      setExistingThumbnail(thumbnail);
      reset({
        title: videoData.title,
        videoLink: videoData.videoLink,
        thumbnail: thumbnail,
        description: videoData.description || "",
        order: videoData.order || 0,
      });
    }
  }, [data, reset]);

  // Auto-generate thumbnail when video link changes (only if no uploaded thumbnail)
  React.useEffect(() => {
    if (videoLink && !uploadedThumbnail) {
      const thumbnail = getVideoThumbnail(videoLink);
      if (thumbnail) {
        setAutoThumbnail(thumbnail);
      } else {
        setAutoThumbnail(null);
      }
    }
  }, [videoLink, uploadedThumbnail]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadApi.uploadImage(file);
      if (response.success && response.data) {
        const imageUrl = response.data.url;
        setUploadedThumbnail(imageUrl);
        setValue("thumbnail", imageUrl);
        setAutoThumbnail(null); // Clear auto-generated thumbnail
      } else {
        alert(response.error || "Failed to upload image");
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveUploadedImage = () => {
    setUploadedThumbnail(null);
    const fallbackThumbnail = existingThumbnail || (videoLink ? getVideoThumbnail(videoLink) : null);
    setValue("thumbnail", fallbackThumbnail || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Re-enable auto-thumbnail if video link exists
    if (videoLink) {
      const thumbnail = getVideoThumbnail(videoLink);
      if (thumbnail) {
        setAutoThumbnail(thumbnail);
        setValue("thumbnail", thumbnail);
      }
    }
  };

  const onSubmit = async (formData: VideoFormData) => {
    setIsSubmitting(true);

    try {
      const response = await videoApi.update(videoId, {
        ...formData,
        thumbnail: uploadedThumbnail || formData.thumbnail || autoThumbnail || null,
      });

      if (response.success) {
        router.push("/admin/videos");
      } else {
        alert(response.error || "Failed to update video");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      alert(error.message || "Failed to update video. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load video</p>
        <Button variant="primary" onClick={() => router.push("/admin/videos")}>
          Back to Videos
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Edit Video
        </h1>
        <p className="text-neutral-600">Update video information</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Video Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Title *
                </label>
                <Input
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                  placeholder="Enter video title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Video Link (YouTube/Vimeo) *
                </label>
                <Input
                  {...register("videoLink")}
                  className={errors.videoLink ? "border-red-500" : ""}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {errors.videoLink && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.videoLink.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500">
                  Enter a valid YouTube or Vimeo URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Thumbnail Image
                </label>
                <label htmlFor="thumbnail-upload-edit" className="sr-only">
                  Upload thumbnail image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="thumbnail-upload-edit"
                  disabled={isUploading}
                  aria-label="Upload thumbnail image"
                />
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    {uploadedThumbnail && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleRemoveUploadedImage}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {uploadedThumbnail && (
                    <div className="mt-2">
                      <p className="text-xs text-neutral-500 mb-2">Uploaded thumbnail:</p>
                      <div className="relative h-32 w-56 rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                        <img
                          src={uploadedThumbnail}
                          alt="Uploaded thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {existingThumbnail && !uploadedThumbnail && (
                    <div className="mt-2">
                      <p className="text-xs text-neutral-500 mb-2">Current thumbnail:</p>
                      <div className="relative h-32 w-56 rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                        <img
                          src={existingThumbnail}
                          alt="Current thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {autoThumbnail && !uploadedThumbnail && !existingThumbnail && (
                    <div className="mt-2">
                      <p className="text-xs text-neutral-500 mb-2">
                        Auto-generated thumbnail (from video link):
                      </p>
                      <div className="relative h-32 w-56 rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                        <img
                          src={autoThumbnail}
                          alt="Auto thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {!uploadedThumbnail && !existingThumbnail && !autoThumbnail && (
                    <p className="text-xs text-neutral-500">
                      Upload an image or enter a video link to auto-generate a thumbnail
                    </p>
                  )}
                </div>
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <Textarea
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                  placeholder="Enter video description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Display Order
                </label>
                <Input
                  type="number"
                  min="0"
                  {...register("order", { valueAsNumber: true })}
                  className={errors.order ? "border-red-500" : ""}
                  placeholder="0"
                />
                {errors.order && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.order.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500">
                  Lower numbers appear first in the gallery
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Video"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
