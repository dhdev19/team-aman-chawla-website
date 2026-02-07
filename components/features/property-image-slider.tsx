"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PropertyImageSliderProps {
  mainImage: string | null;
  images: string[];
  propertyName: string;
  builderReraNumber?: string | null;
  builderReraQrCode?: string | null;
  bankAccountName?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankIfsc?: string | null;
  bankBranch?: string | null;
}

export function PropertyImageSlider({
  mainImage,
  images,
  propertyName,
  builderReraNumber,
  builderReraQrCode,
  bankAccountName,
  bankName,
  bankAccountNumber,
  bankIfsc,
  bankBranch,
}: PropertyImageSliderProps) {
  // Combine main image and additional images, with main image first
  const allImages = React.useMemo(() => {
    const imageList: string[] = [];
    if (mainImage) {
      imageList.push(mainImage);
    }
    if (images && images.length > 0) {
      imageList.push(...images);
    }
    return imageList;
  }, [mainImage, images]);

  if (allImages.length === 0) {
    return (
      <div className="relative h-96 w-full rounded-lg overflow-hidden bg-neutral-200 flex items-center justify-center">
        <span className="text-neutral-400">No Images Available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 bg-white/90 text-neutral-900 rounded-md px-2 py-1 text-[10px] leading-tight shadow flex gap-2">
        <div className="flex items-center">
          {builderReraQrCode ? (
            <Image
              src={builderReraQrCode}
              alt="RERA QR"
              width={48}
              height={48}
              className="rounded"
            />
          ) : (
            <div className="w-12 h-12 rounded bg-neutral-200 text-neutral-500 flex items-center justify-center text-[9px]">
              RERA QR
            </div>
          )}
        </div>
        <div className="rera-details-text rera-details-text-local text-[9px] normal-case">
          {builderReraNumber && (
            <div className="text-[10px] font-semibold">
              Project RERA: {builderReraNumber}
            </div>
          )}
          <div className="text-[8px]">RERA Website: www.up-rera.in</div>
          <div className="text-[8px]">Authorised Channel Partner: Aman Chawla</div>
          <div className="text-[8px]">RERA Number: UPRERAAGT11258</div>
        </div>
      </div>
      {(bankAccountName ||
        bankName ||
        bankAccountNumber ||
        bankIfsc ||
        bankBranch) && (
        <div className="absolute left-2 right-2 bottom-2 z-10 bg-white/90 text-neutral-900 rounded-md px-2 pt-0.5 pb-1 text-[9px] leading-tight shadow bank-details-text-local normal-case">
          <div>
            {[
              bankAccountName ? `Account Name: ${bankAccountName}` : null,
              bankAccountNumber ? `A/C No.: ${bankAccountNumber}` : null,
              bankName ? `Bank Name: ${bankName}` : null,
              bankIfsc ? `IFSC Code: ${bankIfsc}` : null,
              bankBranch ? `Branch: ${bankBranch}` : null,
            ]
              .filter(Boolean)
              .join(" | ")}
          </div>
          <div className="text-[8px]">
            That Money from customer must be deposited in Collection A/c only.
          </div>
        </div>
      )}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={allImages.length > 1}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={allImages.length > 1}
        className="property-image-swiper"
      >
        {allImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-96 w-full rounded-lg overflow-hidden bg-neutral-200">
              <Image
                src={image}
                alt={`${propertyName} - Image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
