"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, type PropertyFormData } from "@/lib/validations/property";
import { propertyApi, uploadApi } from "@/lib/api-client";
import { PropertyType, PropertyStatus } from "@prisma/client";
import { generateSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

// Common amenities
const COMMON_AMENITIES = [
  "Swimming Pool",
  "Gymnasium",
  "Parking",
  "Security",
  "Lift",
  "Power Backup",
  "Clubhouse",
  "Landscaped Gardens",
  "Children's Play Area",
  "Shopping Mall",
  "Hospital",
  "School",
  "Metro Connectivity",
];

export default function AddPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [images, setImages] = React.useState<string[]>([]);
  const [mainImage, setMainImage] = React.useState<string | null>(null);
  const [isUploadingMain, setIsUploadingMain] = React.useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = React.useState(false);
  const [amenities, setAmenities] = React.useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = React.useState("");
  const [locationAdvantages, setLocationAdvantages] = React.useState<string[]>([]);
  const [newLocationAdvantage, setNewLocationAdvantage] = React.useState("");
  const mainImageInputRef = React.useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = React.useRef<HTMLInputElement>(null);

  const [autoSlug, setAutoSlug] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: PropertyStatus.AVAILABLE,
      images: [],
      amenities: [],
      locationAdvantages: [],
    },
  });

  const propertyName = watch("name");
  const propertySlug = watch("slug") || autoSlug;

  // Auto-generate slug when property name changes
  React.useEffect(() => {
    if (propertyName) {
      const slug = generateSlug(propertyName);
      setAutoSlug(slug);
      setValue("slug", slug);
    }
  }, [propertyName, setValue]);

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    setIsUploadingMain(true);
    try {
      const slug = propertySlug || autoSlug;
      const response = await uploadApi.uploadImage(file, {
        slug: slug || undefined,
        imageType: "main",
      });
      if (response.success && response.data) {
        const imageUrl = response.data.url;
        setMainImage(imageUrl);
        setValue("mainImage", imageUrl);
      } else {
        alert(response.error || "Failed to upload image");
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingMain(false);
    }
  };

  const handleAdditionalImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingAdditional(true);
    try {
      const slug = propertySlug || autoSlug;
      const startIndex = images.length + 1; // Start from the next index after existing images
      
      const uploadPromises = Array.from(files).map(async (file, fileIndex) => {
        if (!validateImageFile(file)) return null;
        const response = await uploadApi.uploadImage(file, {
          slug: slug || undefined,
          imageType: "slider",
          index: startIndex + fileIndex,
        });
        return response.success && response.data ? response.data.url : null;
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(
        (url): url is string => url !== null
      );

      const updatedImages = [...images, ...uploadedUrls];
      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error: any) {
      alert(error.message || "Failed to upload images. Please try again.");
    } finally {
      setIsUploadingAdditional(false);
      if (additionalImagesInputRef.current) {
        additionalImagesInputRef.current.value = "";
      }
    }
  };

  const validateImageFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload an image file (JPEG, PNG, WebP, or GIF).");
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds 5MB limit. Please choose a smaller image.");
      return false;
    }

    return true;
  };

  const removeMainImage = () => {
    setMainImage(null);
    setValue("mainImage", null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue("images", updatedImages);
  };

  const toggleAmenity = (amenity: string) => {
    const updatedAmenities = amenities.includes(amenity)
      ? amenities.filter((a) => a !== amenity)
      : [...amenities, amenity];
    setAmenities(updatedAmenities);
    setValue("amenities", updatedAmenities);
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      const updatedAmenities = [...amenities, customAmenity.trim()];
      setAmenities(updatedAmenities);
      setValue("amenities", updatedAmenities);
      setCustomAmenity("");
    }
  };

  const removeCustomAmenity = (amenity: string) => {
    const updatedAmenities = amenities.filter((a) => a !== amenity);
    setAmenities(updatedAmenities);
    setValue("amenities", updatedAmenities);
  };

  const addLocationAdvantage = () => {
    if (newLocationAdvantage.trim() && !locationAdvantages.includes(newLocationAdvantage.trim())) {
      const updatedAdvantages = [...locationAdvantages, newLocationAdvantage.trim()];
      setLocationAdvantages(updatedAdvantages);
      setValue("locationAdvantages", updatedAdvantages);
      setNewLocationAdvantage("");
    }
  };

  const removeLocationAdvantage = (advantage: string) => {
    const updatedAdvantages = locationAdvantages.filter((a) => a !== advantage);
    setLocationAdvantages(updatedAdvantages);
    setValue("locationAdvantages", updatedAdvantages);
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    try {
      const response = await propertyApi.create({
        ...data,
        images,
        amenities: amenities || [],
        locationAdvantages: locationAdvantages || [],
        mainImage: mainImage || data.mainImage || null,
      });

      if (response.success) {
        router.push("/admin/properties");
      } else {
        alert(response.error || "Failed to create property");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      alert(error.message || "Failed to create property. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Add New Property
        </h1>
        <p className="text-neutral-600">
          Create a new property listing
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property Name *
                </label>
                <Input
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Slug
                </label>
                <Input
                  {...register("slug")}
                  className={errors.slug ? "border-red-500" : ""}
                  placeholder="url-friendly-slug"
                />
                {autoSlug && (
                  <p className="mt-1 text-xs text-neutral-500">
                    Auto-generated: {autoSlug}
                  </p>
                )}
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
                  Builder *
                </label>
                <Input
                  {...register("builder")}
                  className={errors.builder ? "border-red-500" : ""}
                />
                {errors.builder && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.builder.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Builder RERA Number
                </label>
                <Input
                  {...register("builderReraNumber")}
                  className={errors.builderReraNumber ? "border-red-500" : ""}
                  placeholder="Enter RERA registration number"
                />
                {errors.builderReraNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.builderReraNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property Type *
                </label>
                <Select
                  {...register("type")}
                  className={errors.type ? "border-red-500" : ""}
                >
                  <option value="">Select Type</option>
                  <option value={PropertyType.RESIDENTIAL}>Residential</option>
                  <option value={PropertyType.PLOT}>Plot</option>
                  <option value={PropertyType.COMMERCIAL}>Commercial</option>
                  <option value={PropertyType.OFFICES}>Offices</option>
                </Select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Status *
                </label>
                <Select
                  {...register("status")}
                  className={errors.status ? "border-red-500" : ""}
                >
                  <option value={PropertyStatus.AVAILABLE}>Available</option>
                  <option value={PropertyStatus.SOLD}>Sold</option>
                  <option value={PropertyStatus.RESERVED}>Reserved</option>
                </Select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  className={errors.price ? "border-red-500" : ""}
                  placeholder="Enter price"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location
                </label>
                <Input
                  {...register("location")}
                  className={errors.location ? "border-red-500" : ""}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <Textarea
                rows={5}
                {...register("description")}
                className={errors.description ? "border-red-500" : ""}
                placeholder="Enter property description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Location Advantages
              </label>
              <div className="flex gap-2">
                <Input
                  value={newLocationAdvantage}
                  onChange={(e) => setNewLocationAdvantage(e.target.value)}
                  placeholder="Enter location advantage (e.g., Near Metro Station)"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLocationAdvantage();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addLocationAdvantage}>
                  Add More
                </Button>
              </div>
              {errors.locationAdvantages && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.locationAdvantages.message}
                </p>
              )}
              {locationAdvantages.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {locationAdvantages.map((advantage, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {advantage}
                        <button
                          type="button"
                          onClick={() => removeLocationAdvantage(advantage)}
                          className="text-primary-600 hover:text-primary-800"
                          aria-label={`Remove ${advantage}`}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Images
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Main Image
              </label>
              <label htmlFor="main-image-upload" className="sr-only">
                Upload main image
              </label>
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleMainImageUpload}
                className="hidden"
                id="main-image-upload"
                disabled={isUploadingMain}
                aria-label="Upload main image"
              />
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => mainImageInputRef.current?.click()}
                    disabled={isUploadingMain}
                  >
                    {isUploadingMain ? "Uploading..." : "Upload Main Image"}
                  </Button>
                  {mainImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={removeMainImage}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {mainImage && (
                  <div className="relative h-48 w-full max-w-md rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                    <img
                      src={mainImage}
                      alt="Main property image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              {errors.mainImage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mainImage.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Additional Images
              </label>
              <label htmlFor="additional-images-upload" className="sr-only">
                Upload additional images
              </label>
              <input
                ref={additionalImagesInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleAdditionalImagesUpload}
                className="hidden"
                id="additional-images-upload"
                disabled={isUploadingAdditional}
                multiple
                aria-label="Upload additional images"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => additionalImagesInputRef.current?.click()}
                disabled={isUploadingAdditional}
              >
                {isUploadingAdditional ? "Uploading..." : "Upload Images (Multiple)"}
              </Button>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-24 w-full rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Amenities
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Select Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {COMMON_AMENITIES.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Add Custom Amenity
                </label>
                <div className="flex gap-2">
                  <Input
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    placeholder="Enter custom amenity"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomAmenity();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={addCustomAmenity}>
                    Add
                  </Button>
                </div>
              </div>

              {amenities.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-2">
                    Selected Amenities ({amenities.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeCustomAmenity(amenity)}
                          className="text-primary-600 hover:text-primary-800"
                          aria-label={`Remove ${amenity}`}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO Information */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              SEO Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Meta Title
                </label>
                <Input
                  {...register("metaTitle")}
                  className={errors.metaTitle ? "border-red-500" : ""}
                  placeholder="Enter meta title for SEO"
                  maxLength={200}
                />
                {errors.metaTitle && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.metaTitle.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500">
                  Recommended: 50-60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Meta Keywords
                </label>
                <Input
                  {...register("metaKeywords")}
                  className={errors.metaKeywords ? "border-red-500" : ""}
                  placeholder="Enter meta keywords (comma-separated)"
                  maxLength={500}
                />
                {errors.metaKeywords && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.metaKeywords.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500">
                  Separate keywords with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Meta Description
                </label>
                <Textarea
                  rows={3}
                  {...register("metaDescription")}
                  className={errors.metaDescription ? "border-red-500" : ""}
                  placeholder="Enter meta description for SEO"
                  maxLength={500}
                />
                {errors.metaDescription && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.metaDescription.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500">
                  Recommended: 150-160 characters
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Bank Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bank Account Name
                </label>
                <Input
                  {...register("bankAccountName")}
                  className={errors.bankAccountName ? "border-red-500" : ""}
                  placeholder="Enter account holder name"
                />
                {errors.bankAccountName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bankAccountName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bank Name
                </label>
                <Input
                  {...register("bankName")}
                  className={errors.bankName ? "border-red-500" : ""}
                  placeholder="Enter bank name"
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Account Number
                </label>
                <Input
                  {...register("bankAccountNumber")}
                  className={errors.bankAccountNumber ? "border-red-500" : ""}
                  placeholder="Enter account number"
                />
                {errors.bankAccountNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bankAccountNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  IFSC Code
                </label>
                <Input
                  {...register("bankIfsc")}
                  className={errors.bankIfsc ? "border-red-500" : ""}
                  placeholder="Enter IFSC code"
                  style={{ textTransform: "uppercase" }}
                />
                {errors.bankIfsc && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bankIfsc.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bank Branch
                </label>
                <Input
                  {...register("bankBranch")}
                  className={errors.bankBranch ? "border-red-500" : ""}
                  placeholder="Enter bank branch name and address"
                />
                {errors.bankBranch && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bankBranch.message}
                  </p>
                )}
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
              {isSubmitting ? "Creating..." : "Create Property"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
