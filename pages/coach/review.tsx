// pages/coach/reviews.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ReviewCalls = () => {
  const [pastReviews, setPastReviews] = useState([]);
  const router = useRouter();
  const { coachId } = router.query; 

  useEffect(() => {
    fetchPastReviews();
  }, [coachId]);

  const fetchPastReviews = async () => {
    if (!coachId) return;
    try {
      const response = await axios.get(`/api/reviews/past?coachId=${coachId}`);
      setPastReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch past reviews:', error);
    }
  };

  return (
    <div>
      <h1>Call Reviews</h1>
      <ul>
        {pastReviews.map(review => (
          <li key={review.id}>
            Date: {new Date(review.booking.availabilitySlot.startTime).toLocaleDateString()},
            Time: {new Date(review.booking.availabilitySlot.startTime).toLocaleTimeString()} to {new Date(review.booking.availabilitySlot.endTime).toLocaleTimeString()},
            Student: {review.booking.student.name},
            Student Number: {review.booking.student.phoneNumber},
            Satisfaction: {review.satisfaction},
            Notes: {review.notes}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewCalls;

