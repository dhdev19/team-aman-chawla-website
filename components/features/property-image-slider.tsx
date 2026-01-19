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
}

export function PropertyImageSlider({
  mainImage,
  images,
  propertyName,
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
