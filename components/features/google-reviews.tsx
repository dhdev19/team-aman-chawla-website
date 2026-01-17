"use client";

import React, { useState, useEffect } from "react";

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
  profile_photo_url?: string;
}

interface GoogleReviewsProps {
  placeId?: string;
  maxReviews?: number;
}

export function GoogleReviews({
  placeId = "ChIJO7EGoAf8mzkR-RdoxxTbV90",
  maxReviews = 3,
}: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Note: Google Reviews API endpoint would need to be implemented in the backend
        // For now, we'll use static fallback reviews
        // If you have a backend endpoint, uncomment and use:
        // const response = await fetch(`/api/google-reviews?place_id=${placeId}`);
        // const data = await response.json();
        // if (data.error) {
        //   setError(data.error);
        //   setReviews([]);
        // } else {
        //   setReviews(data.reviews.slice(0, maxReviews));
        //   setRating(data.rating);
        //   setTotalRatings(data.total_ratings);
        // }
      } catch (err: any) {
        console.error("Error fetching Google reviews:", err);
        setError(err.message || "Failed to load reviews");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [placeId, maxReviews]);

  // Static fallback reviews
  const staticReviews: GoogleReview[] = [
    {
      author_name: "Rachy Shukla",
      rating: 5,
      text: "I would like to thank Team Aman Chawla for working on my refund process quickly, this builds investor trust and assurance that our hard earned money is in safe hands when dealing with builders. Its not only about selling the unit, but also helping out the customer if there is a change of plans.",
      time: Date.now() / 1000 - 1209600, // 2 weeks ago
      relative_time_description: "A month ago",
    },
    {
      author_name: "Abhay Singh",
      rating: 5,
      text: "Such a professional bunch of people, I have a booking through this team and my plot documentation & registration was to be done on Monday (on the day when Team Aman Chawla has an official off), but Mr. Rishab & Mr. Ashutosh not only came to office to support me but made sure everything is going smooth ...",
      time: Date.now() / 1000 - 2592000, // 1 month ago
      relative_time_description: "2 months ago",
    },
    {
      author_name: "Priya Singh",
      rating: 5,
      text: "Professional bunch of people, doing great job in Lucknow. Expect fairness, transparency and customer centric opinion. Mr. Prasad from this house is one of well informed, unbiased with data centric approach. I commend the very guiding force behind this team. Keep up guys.",
      time: Date.now() / 1000 - 1814400, // 3 weeks ago
      relative_time_description: "2 months ago",
    },
  ];

  const formatDate = (relativeTime: string) => {
    return relativeTime || "Recently";
  };

  // Use static reviews if API failed or returned no reviews
  const displayReviews = reviews.length > 0 ? reviews : staticReviews;
  const displayRating = rating > 0 ? rating : 5.0;
  const displayTotalRatings = totalRatings > 0 ? totalRatings : "";

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(maxReviews)].map((_, i) => (
          <div key={i} className="review-card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {displayRating > 0 && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-6 py-3">
            <i className="fa-solid fa-star text-yellow-400 text-xl"></i>
            <span className="text-2xl font-bold text-gray-900">
              {displayRating.toFixed(1)}
            </span>
            <span className="text-gray-600">
              {displayTotalRatings}{" "}
              {displayTotalRatings === 1 ? "Review" : "Reviews"}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayReviews.length > 0 ? (
          displayReviews.slice(0, maxReviews).map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa-solid fa-star ${
                        i < review.rating
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                    ></i>
                  ))}
                </div>
                <p className="review-date">
                  {formatDate(review.relative_time_description)}
                </p>
              </div>
              <p className="review-text">"{review.text}"</p>
              <div className="review-author">
                <div className="review-author-avatar">
                  {review.profile_photo_url ? (
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <i className="fa-solid fa-user text-gray-400 text-xl"></i>
                  )}
                </div>
                <div>
                  <p className="review-author-name">{review.author_name}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No reviews available at this time.</p>
          </div>
        )}
      </div>
    </>
  );
}
