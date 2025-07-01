import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

const ReviewSubmissionPage = () => {
  const navigate = useNavigate()
  const [starRating, setStarRating] = useState(0);

  const [criteriaRatings, setCriteriaRatings] = useState({
    professionalism: 0,
    valueForMoney: 0,
    punctuality: 0,
    qualityOfWork: 0,
  });

  const [reviewText, setReviewText] = useState(
    ""
  );

  const handleStarClick = (value) => {
    setStarRating(value);
  };

  const handleCriteriaClick = (criteria, value) => {
    setCriteriaRatings((prev) => {
      const updated = {
        ...prev,
        [criteria]: value,
      };
  
      const overall = calculateOverallRating(updated);
      setStarRating(Math.round(overall)); 
  
      return updated;
    });
  };

  function calculateOverallRating(ratings) {
    const ratingValues = Object.values(ratings);

    const total = ratingValues.reduce((sum, value) => sum + value, 0);
    const average = total / ratingValues.length;

    const overallRating = Math.round(average * 10) / 10;

    return overallRating;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const overall = calculateOverallRating(criteriaRatings);
    
    const reviewData = JSON.parse(localStorage.getItem("reviewData"))
    
    await axios.post("http://127.0.0.1:5000/servicehub/createReview", {
      booking_id: reviewData.bookingId,
      customer_id: reviewData.customerId,
      provider_id: reviewData.providerId,
      rating: overall,
      comment: reviewText
    })
    navigate("/mybookings")
  };

  const renderStars = () => {
    const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
    return labels.map((label, index) => {
      const value = index + 1;
      return (
        <button
          type="button"
          key={label}
          onClick={() => handleStarClick(value)}
          className="flex flex-col items-center mx-2 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={starRating >= value ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`h-8 w-8 transition-colors ${
              starRating >= value ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={starRating >= value ? 1 : 1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.096c.969 0 1.371 1.24.588 1.81l-3.318 2.38a1 1 0 00-.364 1.118l1.286 3.956c.3.921-.755 1.688-1.54 1.118L12 15.347l-3.345 2.42c-.784.57-1.84-.197-1.54-1.118l1.286-3.956a1 1 0 00-.364-1.118l-3.318-2.38c-.783-.57-.38-1.81.588-1.81h4.096a1 1 0 00.95-.69l1.286-3.957z"
            />
          </svg>
          <span className="text-xs text-gray-600 mt-1">{label}</span>
        </button>
      );
    });
  };

  const renderBulletRating = (criteria) => {
    const bullets = [1, 2, 3, 4, 5];
    return (
      <div className="flex space-x-3">
        {bullets.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleCriteriaClick(criteria, value)}
            className={`h-5 w-5 rounded-full border-2 transition-colors focus:outline-none ${
              criteriaRatings[criteria] >= value
                ? "bg-yellow-400 border-yellow-400"
                : "bg-transparent border-gray-300"
            } hover:cursor-pointer`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <main className="pt-[80px] pb-[80px] container mx-auto px-4 flex-grow overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-10"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Rate Your Experience
          </h1>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              How would you rate this service?
            </h2>
            <div className="flex justify-center">{renderStars()}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-gray-700 font-medium mb-2">Professionalism</p>
              {renderBulletRating("professionalism")}
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-2">Value for Money</p>
              {renderBulletRating("valueForMoney")}
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-2">Punctuality</p>
              {renderBulletRating("punctuality")}
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-2">Quality of Work</p>
              {renderBulletRating("qualityOfWork")}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Write Your Review
            </label>
            <textarea
              rows="5"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Review
            </button>
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </div>
  );
};

export default ReviewSubmissionPage;
