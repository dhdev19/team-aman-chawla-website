"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, type BlogFormData } from "@/lib/validations/blog";
import { blogApi, uploadApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
// BlogType enum from Prisma
const BlogType = {
  TEXT: "TEXT" as const,
  VIDEO: "VIDEO" as const,
} as const;

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [existingImage, setExistingImage] = React.useState<string | null>(null);
  const [uploadedVideoThumbnail, setUploadedVideoThumbnail] = React.useState<string | null>(null);
  const [existingVideoThumbnail, setExistingVideoThumbnail] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = React.useState(false);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoThumbnailInputRef = React.useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-blog", blogId],
    queryFn: async () => {
      const response = await blogApi.getById(blogId);
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  React.useEffect(() => {
    if (data) {
      const blogData = data as any;
      const image = blogData.image || null;
      const videoThumbnail = blogData.videoThumbnail || null;
      setExistingImage(image);
      setExistingVideoThumbnail(videoThumbnail);
      reset({
        title: blogData.title,
        slug: blogData.slug,
        type: blogData.type || BlogType.TEXT,
        content: blogData.content,
        excerpt: blogData.excerpt || "",
        image: image || "",
        videoUrl: blogData.videoUrl || "",
        videoThumbnail: videoThumbnail || "",
        published: blogData.published || false,
      });
    }
  }, [data, reset]);

  const blogType = watch("type");

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
        setUploadedImage(imageUrl);
        setValue("image", imageUrl);
      } else {
        alert(response.error || "Failed to upload image");
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    const fallbackImage = existingImage;
    setValue("image", fallbackImage || null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleVideoThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploadingThumbnail(true);
    try {
      const response = await uploadApi.uploadImage(file);
      if (response.success && response.data) {
        const imageUrl = response.data.url;
        setUploadedVideoThumbnail(imageUrl);
        setValue("videoThumbnail", imageUrl);
      } else {
        alert(response.error || "Failed to upload thumbnail");
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload thumbnail. Please try again.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleRemoveVideoThumbnail = () => {
    setUploadedVideoThumbnail(null);
    const fallbackThumbnail = existingVideoThumbnail;
    setValue("videoThumbnail", fallbackThumbnail || null);
    if (videoThumbnailInputRef.current) {
      videoThumbnailInputRef.current.value = "";
    }
  };

  const onSubmit = async (formData: BlogFormData) => {
    setIsSubmitting(true);

    try {
      const response = await blogApi.update(blogId, {
        ...formData,
        image: blogType === BlogType.TEXT ? (uploadedImage || formData.image || null) : null,
        videoUrl: blogType === BlogType.VIDEO ? formData.videoUrl : null,
        videoThumbnail: blogType === BlogType.VIDEO ? (uploadedVideoThumbnail || formData.videoThumbnail || null) : null,
      });

      if (response.success) {
        router.push("/admin/blogs");
      } else {
        alert(response.error || "Failed to update blog post");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      alert(error.message || "Failed to update blog post. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load blog post</p>
        <Button variant="primary" onClick={() => router.push("/admin/blogs")}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Edit Blog Post
        </h1>
        <p className="text-neutral-600">Update blog post information</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Blog Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Title *
                </label>
                <Input
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                  placeholder="Enter blog post title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Slug *
                </label>
                <Input
                  {...register("slug")}
                  className={errors.slug ? "border-red-500" : ""}
                  placeholder="url-friendly-slug"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.slug.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500">
                  URL-friendly slug (lowercase, hyphens only)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Blog Type *
                </label>
                <Select
                  {...register("type")}
                  className={errors.type ? "border-red-500" : ""}
                >
                  <option value={BlogType.TEXT}>Text Blog</option>
                  <option value={BlogType.VIDEO}>Video Blog</option>
                </Select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Excerpt
                </label>
                <Textarea
                  rows={3}
                  {...register("excerpt")}
                  className={errors.excerpt ? "border-red-500" : ""}
                  placeholder="Brief description of the blog post"
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>

              {blogType === BlogType.TEXT && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Featured Image
                  </label>
                <label htmlFor="featured-image-upload-edit" className="sr-only">
                  Upload featured image
                </label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="featured-image-upload-edit"
                  disabled={isUploading}
                  aria-label="Upload featured image"
                />
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    {uploadedImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleRemoveImage}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {uploadedImage && (
                    <div className="relative h-48 w-full max-w-md rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                      <img
                        src={uploadedImage}
                        alt="Uploaded featured image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {existingImage && !uploadedImage && (
                    <div className="relative h-48 w-full max-w-md rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                      <img
                        src={existingImage}
                        alt="Current featured image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image.message}
                  </p>
                )}
                </div>
              )}

              {blogType === BlogType.VIDEO && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      YouTube Video URL *
                    </label>
                    <Input
                      {...register("videoUrl")}
                      className={errors.videoUrl ? "border-red-500" : ""}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {errors.videoUrl && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.videoUrl.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">
                      Enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Video Thumbnail (Optional)
                    </label>
                    <label htmlFor="video-thumbnail-upload-edit" className="sr-only">
                      Upload video thumbnail
                    </label>
                    <input
                      ref={videoThumbnailInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleVideoThumbnailUpload}
                      className="hidden"
                      id="video-thumbnail-upload-edit"
                      disabled={isUploadingThumbnail}
                      aria-label="Upload video thumbnail"
                    />
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => videoThumbnailInputRef.current?.click()}
                          disabled={isUploadingThumbnail}
                        >
                          {isUploadingThumbnail ? "Uploading..." : "Upload Thumbnail"}
                        </Button>
                        {uploadedVideoThumbnail && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleRemoveVideoThumbnail}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      {uploadedVideoThumbnail && (
                        <div className="relative h-48 w-full max-w-md rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                          <img
                            src={uploadedVideoThumbnail}
                            alt="Uploaded video thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {existingVideoThumbnail && !uploadedVideoThumbnail && (
                        <div className="relative h-48 w-full max-w-md rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                          <img
                            src={existingVideoThumbnail}
                            alt="Current video thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {errors.videoThumbnail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.videoThumbnail.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">
                      Upload a custom thumbnail for the video. If not provided, YouTube thumbnail will be used.
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Content *
                </label>
                <RichTextEditor
                  value={watch("content") || ""}
                  onChange={(value) => setValue("content", value)}
                  placeholder="Write your blog post content here... You can use the toolbar to format text with headings, bold, italic, lists, and more."
                  error={errors.content?.message}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Minimum 100 characters required. Use the toolbar above to format your content with HTML (headings, bold, italic, lists, etc.)
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  {...register("published")}
                  className="h-4 w-4 text-primary-700 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="published"
                  className="ml-2 block text-sm text-neutral-700"
                >
                  Publish immediately
                </label>
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
              {isSubmitting ? "Updating..." : "Update Blog Post"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
