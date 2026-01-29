"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GoogleReviews } from "@/components/features/google-reviews";
import { propertyApi, enquiryApi, videoApi, blogApi } from "@/lib/api-client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { PropertyCard } from "@/components/features/property-card";
import { ROUTES } from "@/constants";

interface Property {
  id: string;
  name: string;
  slug: string | null;
  type: string;
  builder: string;
  description: string | null;
  price: number | null;
  location: string | null;
  status: string;
  mainImage: string | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface Video {
  id: string;
  title: string;
  videoLink: string;
  thumbnail: string | null;
  description: string | null;
  order: number;
}

export function OldHomepage() {
  const router = useRouter();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryForm, setQueryForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [queryFeedback, setQueryFeedback] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [videos, setVideos] = useState<Video[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch new launch properties for featured section
        const propertiesResponse = await propertyApi.getAll({
          page: "1",
          limit: "6",
          status: "NEW_LAUNCH",
        });
        if (propertiesResponse.success && propertiesResponse.data && typeof propertiesResponse.data === "object" && "data" in propertiesResponse.data) {
          const data = propertiesResponse.data as { data: Property[] };
          setFeaturedProperties(data.data);
        }

        // Fetch videos
        const videosResponse = await videoApi.getAll();
        if (videosResponse.success && videosResponse.data && Array.isArray(videosResponse.data)) {
          setVideos(videosResponse.data as Video[]);
        }

        // Fetch blogs
        const blogsResponse = await blogApi.getAll({
          page: "1",
          limit: "10",
          published: "true",
        });
        if (blogsResponse.success && blogsResponse.data && typeof blogsResponse.data === "object" && "data" in blogsResponse.data) {
          const data = blogsResponse.data as { data: any[] };
          setBlogs(data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { icon: "fa-users", label: "Happy Clients", value: "500+" },
    { icon: "fa-award", label: "Properties Sold", value: "1000+" },
    { icon: "fa-shield", label: "Years Experience", value: "10+" },
  ];

  // Use videos from database, fallback to hardcoded IDs if none
  const videoIds =
    videos.length > 0
      ? videos.map((v) => {
          // Extract YouTube video ID from URL
          const match = v.videoLink.match(
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
          );
          return match ? match[1] : null;
        }).filter(Boolean) as string[]
      : ["uHFX-d-zP0g", "J0ZNXWAaCgA", "Ytl7v7Lti3Q", "4K0kTyyx22s", "ag9bWnJIbIU"];

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/teamamanchawla/",
      className: "facebook",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/team_aman_chawla",
      className: "instagram",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@TeamAmanChawla",
      className: "youtube",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/team-aman-chawla/",
      className: "linkedin",
    },
  ];

  const preHeroHighlights = [
    {
      image: "/projectimg-hero.jpg",
      title: "Oro Group",
      description: "UPRERAPRJ629194",
    },
    {
      image: "/projectimg-hero2.jpg",
      title: "Shalimar Corp",
      description: "UPRERAPRJ460592/05/2024",
    },
    {
      image: "/projectimg-hero3.jpg",
      title: "Omaxe Group",
      description: "UPRERAPRJ1350",
    },
    {
      image: "/projectimg-hero4.jpg",
      title: "Sahu Group",
      description: "UPRERAPRJ391104/02/2024",
    },
    {
      image: "/projectimg-hero5.jpg",
      title: "Eldeco Group",
      description: "UPRERAPRJ859279/04/2025",
    },
  ];

  const preHeroFeaturePoints = [
    "Dedicated Relationship Manager",
    // "Exclusive Offers & Special Deals",
    "End-to-End Assistance",
    "Expert Market Guidance",
  ];

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setQueryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (queryFeedback !== "idle") {
      setQueryFeedback("idle");
    }
  };

  const handleQuerySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingQuery) {
      return;
    }

    const trimmedName = queryForm.name.trim();
    const trimmedEmail = queryForm.email.trim();
    const trimmedPhone = queryForm.phone.trim();

    if (!trimmedName || !trimmedEmail) {
      setQueryFeedback("error");
      return;
    }

    try {
      setIsSubmittingQuery(true);
      await enquiryApi.create({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || undefined,
        message: "Homepage quick query form submission",
        type: "contact",
      });
      router.push("/thank-you?form=contact");
    } catch (error) {
      console.error("Error submitting query form:", error);
      setQueryFeedback("error");
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  const CountUp: React.FC<{
    end: number;
    durationMs?: number;
    suffix?: string;
  }> = ({ end, durationMs = 1500, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const elRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
      const node = elRef.current;
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !started) {
              setStarted(true);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(node);
      return () => {
        observer.disconnect();
      };
    }, [started]);

    useEffect(() => {
      if (!started) return;

      let start: number | null = null;
      const startValue = 0;
      const diff = end - startValue;
      let rafId = 0;

      const step = (timestamp: number) => {
        if (start === null) start = timestamp;
        const progress = Math.min((timestamp - start) / durationMs, 1);
        const current = Math.floor(startValue + diff * progress);
        setCount(current);
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      };

      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }, [end, durationMs, started]);

    return (
      <span ref={elRef}>
        {count}
        {suffix}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919118388999"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-floating-button"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp" aria-hidden="true" />
      </a>

      {/* Social Media Fixed Bar */}
      <div className="social-fixed-bar" aria-label="Social media links">
        <ul>
          {socialLinks.map(({ name, url, className }) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className={`social-icon ${className}`}
              >
                <i className={`fa-brands fa-${className === 'facebook' ? 'facebook' : className === 'instagram' ? 'instagram' : className === 'youtube' ? 'youtube' : 'linkedin'}`}></i>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Pre-Hero Section */}
      <section className="pre-hero-section">
        <div className="bnrimagewrapper">
          <img src="/pre-hero-banner.jpg" alt="Property" className="" />
        </div>
        <div className="content font-montserrat">
          <h3>
            Homes & Investments That Fit{" "}
            <span className="highlight-rotating-words">
              <span className="highlight-rotating-word">You!</span>
              <span className="highlight-rotating-word">Your Family!</span>
              <span className="highlight-rotating-word">Your Friends!</span>
              <span className="highlight-rotating-word">Your Lifestyle!</span>
            </span>
          </h3>
          <p>
            Explore prime city homes and high-growth investment options, curated
            for long-term value.
          </p>
          <ul className="space-y-2 text-white list-none">
            {preHeroFeaturePoints.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <i
                  className="fa-solid fa-circle text-white text-sm"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <h4 className="googlerev">
            5.0
            <i
              className="fa-solid fa-star text-white text-sm"
              aria-hidden="true"
            />
            <i
              className="fa-solid fa-star text-white text-sm"
              aria-hidden="true"
            />
            <i
              className="fa-solid fa-star text-white text-sm"
              aria-hidden="true"
            />
            <i
              className="fa-solid fa-star text-white text-sm"
              aria-hidden="true"
            />
            <i
              className="fa-solid fa-star text-white text-sm"
              aria-hidden="true"
            />
            Google reviews
          </h4>
        </div>
      </section>

      {/* Home Query Form Section */}
      <section className="py-4 bg-white homequeryform">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-2xl px-4 py-6 sm:px-6 sm:py-8 border border-gray-100">
            <form
              onSubmit={handleQuerySubmit}
              className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6"
            >
              <div className="flex-1">
                <label htmlFor="query-name" className="sr-only">
                  Name
                </label>
                <input
                  id="query-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={queryForm.name}
                  onChange={handleQueryChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="query-email" className="sr-only">
                  Email
                </label>
                <input
                  id="query-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={queryForm.email}
                  onChange={handleQueryChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="query-phone" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="query-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={queryForm.phone}
                  onChange={handleQueryChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                  placeholder="Phone Number"
                />
              </div>
              <div className="flex flex-col gap-2 md:w-auto">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmittingQuery}
                  className="w-full md:w-auto"
                >
                  {isSubmittingQuery ? "Submitting..." : "Submit"}
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </Button>
                {queryFeedback === "success" && (
                  <span className="text-sm font-medium text-green-600">
                    Thank you! We will get in touch shortly.
                  </span>
                )}
                {queryFeedback === "error" && (
                  <span className="text-sm font-medium text-red-600">
                    Please check your details and try again.
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Properties - New launch */}
      <section className="py-4 prpertysec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-uppercase">
              Newly Launched Properties
            </h2>
            <p className="text-xl text-gray-600 description-text">
              Explore our new launch properties that are currently under construction and will be completed in the near future.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                navigation={{
                  prevEl: '.swiper-prev',
                  nextEl: '.swiper-next',
                }}
                pagination={{
                  clickable: true,
                  el: '.swiper-pagination',
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                className="new-launch-swiper"
              >
                {featuredProperties.map((property) => {
                // Convert API property to PropertyCard expected format
                const cardProperty = {
                  ...property,
                  type: property.type as any,
                  status: property.status as any,
                  createdAt: property.createdAt ? new Date(property.createdAt) : new Date(),
                  updatedAt: property.updatedAt ? new Date(property.updatedAt) : new Date(),
                };
                return (
                  <SwiperSlide key={property.id}>
                    <PropertyCard property={cardProperty} />
                  </SwiperSlide>
                );
              })}
              </Swiper>
              
              {/* Custom Navigation Buttons */}
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button className="swiper-prev bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md">
                  <i className="fa-solid fa-chevron-left text-gray-700"></i>
                </button>
                <div className="swiper-pagination flex space-x-2"></div>
                <button className="swiper-next bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md">
                  <i className="fa-solid fa-chevron-right text-gray-700"></i>
                </button>
              </div>
            </>
          )}

          <div className="text-center mt-12">
            <Link href={ROUTES.NEW_LAUNCH}>
              <Button size="lg">
                View All New Launches
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* Box Property Section */}
      <section className="box-propetysec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-uppercase">Get Genuine Buyers for Your Property—Effortlessly</h3>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="box-section">
              <div className="iconbox">
                <img src="/guidances-icon.png" alt="icon" />
              </div>
              <h4>Personalized & Honest Guidance</h4>
              <p>
                You'll receive transparent, buyer-friendly advice at every step.
              </p>
            </div>
            <div className="box-section">
              <div className="iconbox">
                <img src="/trusted-clients.png" alt="icon" />
              </div>
              <h4>Trusted by Many Clients</h4>
              <p>
                A proven track record of successful bookings and satisfied clients
                makes us a reliable partner in your journey.
              </p>
            </div>
            <div className="box-section">
              <div className="iconbox">
                <img src="/investment.png" alt="icon" />
              </div>
              <h4>Investment-Focused Insights</h4>
              <p>
                You will Get expert breakdowns, project reviews, and strategic
                investment recommendations.
              </p>
            </div>
            <div className="box-section">
              <div className="iconbox">
                <img src="/seamless-process.png" alt="icon" />
              </div>
              <h4>Seamless, Stress-Free Process</h4>
              <p>
                Clarity, transparency, and genuine support — every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-8 bg-white video-sec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="videoControl flex items-center justify-between">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-uppercase">
                  Latest Videos
                </h2>
                <p className="text-gray-600">
                  Watch our latest property tours and insights
                </p>
              </div>
            </div>

            <div className="video-swiper-nav-wrapper">
            <button
              type="button"
              className="video-swiper-nav video-swiper-nav-prev"
              aria-label="Previous video"
            >
              <i className="fa-solid fa-chevron-left icon"></i>
            </button>
            <button
              type="button"
              className="video-swiper-nav video-swiper-nav-next"
              aria-label="Next video"
            >
              <i className="fa-solid fa-chevron-right icon"></i>
            </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              prevEl: ".video-swiper-nav-prev",
              nextEl: ".video-swiper-nav-next",
            }}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="video-swiper"
          >
            {videoIds.map((id) => (
              <SwiperSlide key={id}>
                <div className="video-wrapper rounded-xl overflow-hidden shadow-md">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title={`YouTube video ${id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Projects We Deal In Section
      <section className="py-16 bg-white wedeal-sec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Projects we deal in
          </h2>
          <div className="lg:col-span-7 relative z-10 pre-hero-carousel">
            <button
              type="button"
              className="pre-hero-nav pre-hero-nav-prev pre-hero-nav-secondary-prev"
              aria-label="Previous developer highlight"
            >
              <i className="fa-solid fa-chevron-left icon"></i>
            </button>
            <button
              type="button"
              className="pre-hero-nav pre-hero-nav-next pre-hero-nav-secondary-next"
              aria-label="Next developer highlight"
            >
              <i className="fa-solid fa-chevron-right icon"></i>
            </button>
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop
              slidesPerView={1.25}
              spaceBetween={16}
              navigation={{
                prevEl: ".pre-hero-nav-secondary-prev",
                nextEl: ".pre-hero-nav-secondary-next",
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pre-hero-swiper"
            >
              {preHeroHighlights.map((highlight) => (
                <SwiperSlide key={highlight.title}>
                  <div className="pre-hero-card">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="pre-hero-card-image"
                    />
                    <div className="pre-hero-card-overlay">
                      <h3>{highlight.title}</h3>
                      <h4>RERA: {highlight.description}</h4>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section> */}


      {/* Explore by Category */}
      <section className="py-16 propertycategorysec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-uppercase">
              Explore by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl description-text">
              Browse properties by popular categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Apartments */}
            <Link
              href="/properties?type=RESIDENTIAL"
              className="category-card"
            >
              <div className="category-image-wrapper">
                <Image
                  src="/category-apartments.jpeg"
                  alt="Apartments"
                  width={300}
                  height={220}
                  className="category-image"
                />
              </div>
              <div className="category-content">
                <h3>Apartments</h3>
                <span className="category-cta">Explore</span>
              </div>
            </Link>

            {/* Villas */}
            <Link
              href="/properties?type=RESIDENTIAL"
              className="category-card"
            >
              <div className="category-image-wrapper">
                <Image
                  src="/category-villas.jpeg"
                  alt="Villas"
                  width={300}
                  height={220}
                  className="category-image"
                />
              </div>
              <div className="category-content">
                <h3>Villas</h3>
                <span className="category-cta">Explore</span>
              </div>
            </Link>

            {/* Commercial */}
            <Link
              href="/properties?type=COMMERCIAL"
              className="category-card"
            >
              <div className="category-image-wrapper">
                <Image
                  src="/category-commercial-img.jpeg"
                  alt="Commercial"
                  width={300}
                  height={220}
                  className="category-image"
                />
              </div>
              <div className="category-content">
                <h3>Commercial</h3>
                <span className="category-cta">Explore</span>
              </div>
            </Link>

            {/* Plots */}
            <Link
              href="/properties?type=PLOT"
              className="category-card"
            >
              <div className="category-image-wrapper">
                <Image
                  src="/category-plot.jpeg"
                  alt="Plots"
                  width={300}
                  height={220}
                  className="category-image"
                />
              </div>
              <div className="category-content">
                <h3>Plots</h3>
                <span className="category-cta">Explore</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Services Section */}
      <section className="py-16 bg-gray-50 why-choose-us-services-sec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-uppercase">
              Why Choose Team Aman Chawla
            </h2>
            <p className="text-xl text-gray-600 description-text">
              Your trusted partner in finding the perfect property in Lucknow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden why-choose-us-card-homepage">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                  <i className="fa-solid fa-handshake text-4xl text-primary-600"></i>
                </div>
                <h6 className="text-base font-bold text-gray-900 mb-4">
                Your Hassle-Free Journey to Finding the Perfect Home in Lucknow
                </h6>
                <p className="text-gray-600 leading-relaxed text-base text-sm">
                  We know that the purchase of a property in Lucknow is going to be a huge step for you. Making your needs to choosing the right homes and site visits, we will be the one to take you through the entire process without hassle and stress.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden why-choose-us-card-homepage">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                  <i className="fa-solid fa-shield-halved text-4xl text-primary-600"></i>
                </div>
                <h6 className="text-base font-bold text-gray-900 mb-4">
                Trusted Properties, Transparent Prices – Your Smart Investment in Lucknow Starts Here
                </h6>
                <p className="text-gray-600 leading-relaxed text-base text-sm">
                  A house or an investment in Lucknow is what you are looking for? We provide you with 100% trusted properties, clear prices, and professional and friendly local advice so that you can take assured and knowledgeable decisions.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden why-choose-us-card-homepage">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                  <i className="fa-solid fa-user-tie text-4xl text-primary-600"></i>
                </div>
                <h6 className="text-base font-bold text-gray-900 mb-4">
                From First Look to Final Deal – Expert Guidance for Every Buyer and Investor in Lucknow
                </h6>
                <p className="text-gray-600 leading-relaxed text-base text-sm">
                  It doesn't matter in case you are a newbie purchaser or would-be professional investor, we will help you spot out the ideal property situated in a marvelous location. Our staff is always there for you. From look-up to signing the deal so nothing feels too much.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 choose-us-counter-sec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const numeric =
                parseInt((stat.value || "").toString().replace(/[^0-9]/g, "")) ||
                0;
              const suffix = (stat.value || "")
                .toString()
                .replace(/[0-9]/g, "");
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <i className={`fa-solid ${stat.icon} text-2xl text-primary-600`}></i>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    <CountUp end={numeric} suffix={suffix} />
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Sell Property Section */}
      <section className="sell-propetysec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <h3 className="text-uppercase">Have a property to sell?</h3> */}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="#">
            <img
              src="/buy-property-banner.jpg"
              alt="Property"
              className="rounded-xl"
            />
          </a>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white review-sec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-uppercase">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto description-text">
              Read what our satisfied clients have to say about their experience
              with Team Aman Chawla
            </p>
          </div>

          <GoogleReviews placeId="ChIJO7EGoAf8mzkR-RdoxxTbV90" maxReviews={3} />

          <div className="text-center">
            <a
              href="https://www.google.com/search?sca_esv=a7a7f7107bf5a5bb&rlz=1C1CHBF_enIN972IN974&sxsrf=AE3TifNmfAfEgIEVznDyZ8Hsh0vWHm6kCA:1762409209181&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E65QvRCDQDIF9L4cx39JzL0Y5M7hV99XtWQpHy4gzH1ARbd0AISUa3BH2s_fpfQszglPQK-qqfm1RuvlUwq3Mc5D46HfahsuXmrHNJyJE8cGBB2h7SXkGgN30Ti3EYOxqeKORISxobILk1dGku8Bq2SlLeESKvUrlCb-Iewiyggk8wxPKA%3D%3D&q=Team+Aman+Chawla+-+Best+Property+Advisor+in+Lucknow+%E0%B2%B5%E0%B2%BF%E0%B2%AE%E0%B2%B0%E0%B3%8D%E0%B2%B6%E0%B3%86%E0%B2%97%E0%B2%B3%E0%B3%81&sa=X&ved=2ahUKEwjxyvL27dyQAxXuzTgGHaphM7cQ0bkNegQIKhAE&biw=1536&bih=747&dpr=1.25"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 testimonial-anchor"
            >
              View All Google Reviews
              <i className="fa-solid fa-external-link ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Our Associations Section */}
      <section className="py-16 bg-gray-50 our-associations-sec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-uppercase">
              Our Association
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto description-text">
              Partnering with leading real estate developers
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            slidesPerView={2}
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="associations-swiper"
          >
            {[
              { name: "Eldeco", imgSrc: "/associations/builder-logo1.png" },
              { name: "Shalimar", imgSrc: "/associations/builder-logo2.png" },
              { name: "Omaxe", imgSrc: "/associations/builder-logo3.png" },
              { name: "Rishita", imgSrc: "/associations/builder-logo4.png" },
              { name: "ORO", imgSrc: "/associations/builder-logo5.png" },
              { name: "Jashn Realty", imgSrc: "/associations/builder-logo6.png" },
              { name: "Skyom City", imgSrc: "/associations/builder-logo8.png" },
              { name: "Amrawati", imgSrc: "/associations/builder-logo9.png" },
              { name: "Migsun", imgSrc: "/associations/builder-logo10.png" },
              { name: "Emaar Group", imgSrc: "/associations/builder-logo11.png" },
              { name: "BBD Group", imgSrc: "/associations/builder-logo12.png" },
              { name: "Ansal API", imgSrc: "/associations/builder-logo13.png" },
              { name: "DLF Group", imgSrc: "/associations/builder-logo14.png" },
              { name: "Sobha Realty", imgSrc: "/associations/builder-logo15.png" },
              { name: "Damac", imgSrc: "/associations/builder-logo16.png" },
            ].map((assoc, index) => (
              <SwiperSlide key={assoc.name}>
                <div
                  className={`association-logo-wrapper ${index % 2 === 0 ? "rotate-right" : "rotate-left"}`}
                >
                  <div className="association-logo">
                    <img
                      src={assoc.imgSrc}
                      alt={assoc.name}
                      className="association-img"
                      onError={(e) => {
                        // Fallback to placeholder if image not found
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='100'%3E%3Crect fill='%23e5e7eb' width='150' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='14'%3E" +
                          encodeURIComponent(assoc.name) +
                          "%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Blogs Carousel Section */}
      {blogs.length > 0 && (
        <section className="py-16 bg-white homepage-blogs-sec">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-uppercase">
                Latest Blogs
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto description-text">
                Stay updated with the latest real estate insights and news
              </p>
            </div>

            <Swiper
              modules={[Autoplay, Navigation]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={blogs.length > 3}
              slidesPerView={1}
              spaceBetween={20}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 3 },
              }}
              navigation={true}
              className="blogs-swiper"
            >
              {blogs.map((blog: any) => (
                <SwiperSlide key={blog.id}>
                  <Link href={`/blogs/${blog.slug}`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full cursor-pointer blog-card-homepage">
                      {blog.type === "TEXT" && blog.image && (
                        <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {blog.type === "VIDEO" && blog.videoUrl && (
                        blog.videoThumbnail ? (
                          <div className="relative h-48 w-full overflow-hidden bg-neutral-200 group">
                            <Image
                              src={blog.videoThumbnail}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                            
                            <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              VIDEO
                            </div>
                          </div>
                        ) : (
                          <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                              <i className="fa-solid fa-play-circle text-white text-6xl"></i>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              VIDEO
                            </div>
                          </div>
                        )
                      )}
                      <div className="p-6">
                        <div className="text-sm text-neutral-500 mb-2">
                          {new Date(blog.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-3 line-clamp-2">
                          {blog.title}
                        </h3>
                        {blog.excerpt && (
                          <p className="text-neutral-600 mb-4 line-clamp-3">
                            {blog.excerpt}
                          </p>
                        )}
                        <span className="text-primary-700 font-medium hover:underline inline-flex items-center">
                          {blog.type === "VIDEO" ? "Watch Video" : "Read More"}
                          <i className="fa-solid fa-arrow-right ml-2"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="text-center mt-8">
              <Link href={ROUTES.BLOGS}>
                <Button size="lg">
                  View All Blogs
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Query Form with Mobile Mockup */}
      <section className="bg-white grey footer-contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 querywrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="formsec">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-uppercase">
                We're here to Assist — Submit Your Query
              </h2>
              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <div>
                  <label htmlFor="query-name-secondary" className="sr-only">
                    Name
                  </label>
                  <input
                    id="query-name-secondary"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={queryForm.name}
                    onChange={handleQueryChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="query-email-secondary" className="sr-only">
                    Email
                  </label>
                  <input
                    id="query-email-secondary"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={queryForm.email}
                    onChange={handleQueryChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="query-phone-secondary" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    id="query-phone-secondary"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={queryForm.phone}
                    onChange={handleQueryChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                    placeholder="Phone Number"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmittingQuery}
                  className="w-full md:w-auto"
                >
                  {isSubmittingQuery ? "Submitting..." : "Submit"}
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </Button>
                {queryFeedback === "success" && (
                  <span className="block text-sm font-medium text-green-600">
                    Thank you! We will get in touch shortly.
                  </span>
                )}
                {queryFeedback === "error" && (
                  <span className="block text-sm font-medium text-red-600">
                    Please check your details and try again.
                  </span>
                )}
              </form>
            </div>
            <div className="amanchawlascreen">
              <img
                src="/mobile-mockup.png"
                alt="Property"
                className="rounded-xl max-w-xs w-full"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
