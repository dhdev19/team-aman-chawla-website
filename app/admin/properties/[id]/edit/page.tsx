"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, type PropertyFormData } from "@/lib/validations/property";
import { propertyApi, uploadApi } from "@/lib/api-client";
import { PropertyType, PropertyStatus, PropertyFormat } from "@prisma/client";
import { generateSlug } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";

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

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [images, setImages] = React.useState<string[]>([]);
  const [mainImage, setMainImage] = React.useState<string | null>(null);
  const [isUploadingMain, setIsUploadingMain] = React.useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = React.useState(false);
  const [amenities, setAmenities] = React.useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = React.useState("");
  const [locationAdvantages, setLocationAdvantages] = React.useState<string[]>([]);
  const [newLocationAdvantage, setNewLocationAdvantage] = React.useState("");
  const [mapImage, setMapImage] = React.useState<string | null>(null);
  const [builderReraQrCode, setBuilderReraQrCode] = React.useState<string | null>(null);
  const [isUploadingMap, setIsUploadingMap] = React.useState(false);
  const [isUploadingQr, setIsUploadingQr] = React.useState(false);
  const [autoSlug, setAutoSlug] = React.useState("");
  const [isUploadingFloorPlan, setIsUploadingFloorPlan] = React.useState<boolean[]>([]);
  const mainImageInputRef = React.useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = React.useRef<HTMLInputElement>(null);
  const mapImageInputRef = React.useRef<HTMLInputElement>(null);
  const qrCodeInputRef = React.useRef<HTMLInputElement>(null);
  const floorPlanInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-property", propertyId],
    queryFn: async () => {
      const response = await propertyApi.getById(propertyId);
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const { fields: configFields, append: appendConfig, remove: removeConfig } = useFieldArray({
    control,
    name: "configurations",
  });

  const propertyName = watch("name");
  const propertySlug = watch("slug") || autoSlug;

  // Auto-generate slug when property name changes
  React.useEffect(() => {
    if (propertyName) {
      const slug = generateSlug(propertyName);
      setAutoSlug(slug);
      // Only set slug if it's not already set
      if (!watch("slug")) {
        setValue("slug", slug);
      }
    }
  }, [propertyName, setValue, watch]);

  React.useEffect(() => {
    if (data) {
      const propertyData = data as any;
      const slug = propertyData.slug || "";
      setAutoSlug(slug ? "" : generateSlug(propertyData.name || ""));
      reset({
        name: propertyData.name,
        slug: slug,
        type: propertyData.type,
        format: propertyData.format || null,
        builder: propertyData.builder,
        builderReraNumber: propertyData.builderReraNumber || "",
        description: propertyData.description || "",
        price: propertyData.price || null,
        location: propertyData.location || "",
        locationAdvantages: propertyData.locationAdvantages || [],
        status: propertyData.status,
        mainImage: propertyData.mainImage || "",
        images: propertyData.images || [],
        amenities: propertyData.amenities || [],
        mapImage: propertyData.mapImage || null,
        projectLaunchDate: propertyData.projectLaunchDate ? new Date(propertyData.projectLaunchDate).toISOString().slice(0, 16) : null,
        builderReraQrCode: propertyData.builderReraQrCode || null,
        possession: propertyData.possession || "",
        configurations: propertyData.configurations || [],
        metaTitle: propertyData.metaTitle || "",
        metaKeywords: propertyData.metaKeywords || "",
        metaDescription: propertyData.metaDescription || "",
        bankAccountName: propertyData.bankAccountName || "",
        bankName: propertyData.bankName || "",
        bankAccountNumber: propertyData.bankAccountNumber || "",
        bankIfsc: propertyData.bankIfsc || "",
        bankBranch: propertyData.bankBranch || "",
      });
      setImages(propertyData.images || []);
      setMainImage(propertyData.mainImage || null);
      setAmenities(propertyData.amenities || []);
      setLocationAdvantages(propertyData.locationAdvantages || []);
      setMapImage(propertyData.mapImage || null);
      setBuilderReraQrCode(propertyData.builderReraQrCode || null);
    }
  }, [data, reset, setValue, watch]);

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

  const handleMapImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    setIsUploadingMap(true);
    try {
      const slug = propertySlug || autoSlug;
      const response = await uploadApi.uploadImage(file, {
        slug: slug || undefined,
        imageType: "map",
      });
      if (response.success && response.data) {
        const imageUrl = response.data.url;
        setMapImage(imageUrl);
        setValue("mapImage", imageUrl);
      } else {
        alert(response.error || "Failed to upload map image");
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload map image. Please try again.");
    } finally {
      setIsUploadingMap(false);
    }
  };

  const handleQrCodeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    setIsUploadingQr(true);
    try {
      const slug = propertySlug || autoSlug;
      const response = await uploadApi.uploadImage(file, {
        slug: slug || undefined,
        imageType: "qrcode",
      });
      if (response.success && response.data) {
        const imageUrl = response.data.url;
        setBuilderReraQrCode(imageUrl);
        setValue("builderReraQrCode", imageUrl);
      } else {
        alert(response.error || "Failed to upload QR code");
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload QR code. Please try again.");
    } finally {
      setIsUploadingQr(false);
    }
  };

  const removeMapImage = () => {
    setMapImage(null);
    setValue("mapImage", null);
    if (mapImageInputRef.current) {
      mapImageInputRef.current.value = "";
    }
  };

  const removeQrCode = () => {
    setBuilderReraQrCode(null);
    setValue("builderReraQrCode", null);
    if (qrCodeInputRef.current) {
      qrCodeInputRef.current.value = "";
    }
  };

  const handleFloorPlanUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    const newUploadingState = [...isUploadingFloorPlan];
    newUploadingState[index] = true;
    setIsUploadingFloorPlan(newUploadingState);

    try {
      const slug = propertySlug || autoSlug;
      const response = await uploadApi.uploadImage(file, {
        slug: slug || undefined,
        imageType: "floorplan",
      });
      if (response.success && response.data) {
        const imageUrl = response.data.url;
        setValue(`configurations.${index}.floorPlanImage`, imageUrl);
      } else {
        alert(response.error || "Failed to upload floor plan");
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload floor plan. Please try again.");
    } finally {
      newUploadingState[index] = false;
      setIsUploadingFloorPlan(newUploadingState);
    }
  };

  const onSubmit = async (formData: PropertyFormData) => {
    setIsSubmitting(true);

    try {
      const response = await propertyApi.update(propertyId, {
        ...formData,
        images,
        amenities,
        locationAdvantages: locationAdvantages || [],
        mainImage: mainImage || formData.mainImage || null,
        mapImage: mapImage || formData.mapImage || null,
        builderReraQrCode: builderReraQrCode || formData.builderReraQrCode || null,
      });

      if (response.success) {
        router.push("/admin/properties");
      } else {
        alert(response.error || "Failed to update property");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      alert(error.message || "Failed to update property. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load property</p>
        <Button variant="primary" onClick={() => router.push("/admin/properties")}>
          Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Edit Property
        </h1>
        <p className="text-neutral-600">
          Update property information
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
                {autoSlug && !watch("slug") && (
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
                  Property Format
                </label>
                <Select
                  {...register("format")}
                  className={errors.format ? "border-red-500" : ""}
                >
                  <option value="">Select Format</option>
                  <option value={PropertyFormat.APARTMENT}>Apartment</option>
                  <option value={PropertyFormat.VILLA}>Villa</option>
                  <option value={PropertyFormat.PLOT}>Plot</option>
                  <option value={PropertyFormat.SHOP}>Shop</option>
                  <option value={PropertyFormat.OFFICE}>Office</option>
                  <option value={PropertyFormat.PENTHOUSE}>Penthouse</option>
                </Select>
                {errors.format && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.format.message}
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
                  <option value={PropertyStatus.FOR_SALE}>For Sale</option>
                  <option value={PropertyStatus.FOR_RENT}>For Rent</option>
                  <option value={PropertyStatus.UNDER_CONSTRUCTION}>Under Construction</option>
                  <option value={PropertyStatus.NEW_LAUNCH}>New Launch</option>
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
              <label htmlFor="main-image-upload-edit" className="sr-only">
                Upload main image
              </label>
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleMainImageUpload}
                className="hidden"
                id="main-image-upload-edit"
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
              <label htmlFor="additional-images-upload-edit" className="sr-only">
                Upload additional images
              </label>
              <input
                ref={additionalImagesInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleAdditionalImagesUpload}
                className="hidden"
                id="additional-images-upload-edit"
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

          {/* Pricing & Configurations */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Pricing & Configurations
            </h2>
            <div className="space-y-4">
              <Button
                type="button"
                variant="primary"
                onClick={() => appendConfig({ configType: "", carpetAreaSqft: undefined, price: undefined, floorPlanImage: null })}
              >
                Add Configuration
              </Button>

              {configFields.length > 0 && (
                <div className="space-y-6 mt-4">
                  {configFields.map((field, index) => (
                    <div key={field.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-neutral-900">
                          Configuration {index + 1}
                        </h3>
                        {configFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeConfig(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {/* Config Type Radio Buttons */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-3">
                            Configuration Type
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {["1BHK", "2BHK", "2.5BHK", "3BHK", "Other"].map((type) => (
                              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  value={type.toLowerCase()}
                                  {...register(`configurations.${index}.configType`)}
                                  className="w-4 h-4 text-primary-600 border-neutral-300"
                                />
                                <span className="text-sm text-neutral-700">{type}</span>
                              </label>
                            ))}
                          </div>
                          {watch(`configurations.${index}.configType`) === "other" && (
                            <div className="mt-3">
                              <Input
                                placeholder="Enter custom configuration type"
                                {...register(`configurations.${index}.customConfigType`)}
                                className="text-sm"
                              />
                            </div>
                          )}
                          {errors.configurations?.[index]?.configType && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.configurations[index]?.configType?.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Carpet Area (sqft)
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              {...register(`configurations.${index}.carpetAreaSqft`, { valueAsNumber: true })}
                              className={errors.configurations?.[index]?.carpetAreaSqft ? "border-red-500" : ""}
                              placeholder="Enter carpet area"
                            />
                            {errors.configurations?.[index]?.carpetAreaSqft && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.configurations[index]?.carpetAreaSqft?.message}
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
                              {...register(`configurations.${index}.price`, { valueAsNumber: true })}
                              className={errors.configurations?.[index]?.price ? "border-red-500" : ""}
                              placeholder="Enter price"
                            />
                            {errors.configurations?.[index]?.price && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.configurations[index]?.price?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Floor Plan Image
                          </label>
                          <label
                            htmlFor={`floor-plan-upload-edit-${index}`}
                            className="sr-only"
                          >
                            Upload floor plan
                          </label>
                          <input
                            ref={(el) => {
                              if (el) floorPlanInputRefs.current[index] = el;
                            }}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={(e) => handleFloorPlanUpload(e, index)}
                            className="hidden"
                            id={`floor-plan-upload-edit-${index}`}
                            disabled={isUploadingFloorPlan[index]}
                            aria-label="Upload floor plan"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => floorPlanInputRefs.current[index]?.click()}
                            disabled={isUploadingFloorPlan[index]}
                          >
                            {isUploadingFloorPlan[index] ? "Uploading..." : "Upload Floor Plan"}
                          </Button>
                          {watch(`configurations.${index}.floorPlanImage`) && (
                            <div className="mt-2 relative h-32 w-full rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                              <img
                                src={watch(`configurations.${index}.floorPlanImage`)}
                                alt="Floor plan"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Images & Map */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Additional Images & Map
            </h2>
            <div className="space-y-6">
              {/* Map Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Map Image
                </label>
                <label htmlFor="map-image-upload-edit" className="sr-only">
                  Upload map image
                </label>
                <input
                  ref={mapImageInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleMapImageUpload}
                  className="hidden"
                  id="map-image-upload-edit"
                  disabled={isUploadingMap}
                  aria-label="Upload map image"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => mapImageInputRef.current?.click()}
                    disabled={isUploadingMap}
                  >
                    {isUploadingMap ? "Uploading..." : "Upload Map Image"}
                  </Button>
                  {mapImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={removeMapImage}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {mapImage && (
                  <div className="relative h-48 w-full max-w-md rounded overflow-hidden bg-neutral-200 border border-neutral-300 mt-3">
                    <img
                      src={mapImage}
                      alt="Property map"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Builder RERA QR Code Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Builder RERA QR Code
                </label>
                <label htmlFor="qr-code-upload-edit" className="sr-only">
                  Upload QR code
                </label>
                <input
                  ref={qrCodeInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleQrCodeUpload}
                  className="hidden"
                  id="qr-code-upload-edit"
                  disabled={isUploadingQr}
                  aria-label="Upload QR code"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => qrCodeInputRef.current?.click()}
                    disabled={isUploadingQr}
                  >
                    {isUploadingQr ? "Uploading..." : "Upload QR Code"}
                  </Button>
                  {builderReraQrCode && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={removeQrCode}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {builderReraQrCode && (
                  <div className="relative h-48 w-48 rounded overflow-hidden bg-neutral-200 border border-neutral-300 mt-3">
                    <img
                      src={builderReraQrCode}
                      alt="RERA QR code"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
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

          {/* Project Details */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Project Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Project Launch Date
                </label>
                <Input
                  type="datetime-local"
                  {...register("projectLaunchDate")}
                  className={errors.projectLaunchDate ? "border-red-500" : ""}
                />
                {errors.projectLaunchDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.projectLaunchDate.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Possession Details
                </label>
                <Textarea
                  rows={3}
                  {...register("possession")}
                  className={errors.possession ? "border-red-500" : ""}
                  placeholder="Enter possession details (e.g., Ready to Move, Oct 2026, etc.)"
                />
                {errors.possession && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.possession.message}
                  </p>
                )}
              </div>
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
              {isSubmitting ? "Updating..." : "Update Property"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
