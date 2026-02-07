"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { formatCurrency } from "@/lib/utils";

export interface PropertyConfiguration {
  id: string;
  configType: string;
  carpetAreaSqft: number | null;
  price: number | null;
  floorPlanImage: string | null;
}

const formatIndianCurrency = (price: number) => {
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `${cr.toFixed(2)} Cr`;
  } else if (price >= 100000) {
    const lac = price / 100000;
    return `${lac.toFixed(2)} Lacs`;
  }
  return formatCurrency(price);
};

export function PropertyConfigCarousel({
  configurations,
}: {
  configurations: PropertyConfiguration[];
}) {
  const shouldLoop = configurations.length > 3;

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={6}
      slidesPerView="auto"
      navigation={false}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      autoplay={
        shouldLoop
          ? {
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
          : false
      }
      loop={shouldLoop}
      className="property-config-swiper"
    >
      {configurations.map((config) => (
        <SwiperSlide key={config.id} className="!w-[320px]">
          <div className="border border-neutral-200 rounded-lg p-2.5 bg-neutral-50 h-full">
            <div className="grid grid-cols-1 gap-2">
              <div className="grid grid-cols-3 gap-1.5 text-[11px] text-neutral-600 leading-snug whitespace-nowrap">
                <div className="text-left">Configuration</div>
                <div className="text-center">Carpet Area</div>
                <div className="text-right">Price</div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[13px] leading-snug whitespace-nowrap">
                <div className="text-left font-semibold text-neutral-900 capitalize">
                  {config.configType}
                </div>
                <div className="text-center font-semibold text-neutral-900">
                  {config.carpetAreaSqft
                    ? `${config.carpetAreaSqft.toLocaleString()} sq ft`
                    : "-"}
                </div>
                <div className="text-right font-semibold text-primary-700 text-base">
                  {config.price === null || config.price === undefined
                    ? "-"
                    : config.price === 0
                    ? "On Request"
                    : formatIndianCurrency(config.price)}*
                </div>
              </div>
              {config.floorPlanImage && (
                <div>
                  <div className="text-sm text-neutral-600">Floor Plan</div>
                  <div className="relative mt-2 h-40 w-full rounded overflow-hidden bg-neutral-200 border border-neutral-300">
                    <Image
                      src={config.floorPlanImage}
                      alt="Floor Plan"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
