import React from 'react';
import './styles.css';

/**
 * A reusable visual star rating component based on a 1-10 scale.
 * Converts the 10-point score to a 5-star visual representation.
 */
const StarRating = ({ rating, count = 5 }) => {
    // Normalize rating from 10 to a 5-scale
    const normalizedRating = rating / 2;

    const renderStar = (index) => {
        const fillPercentage = Math.max(0, Math.min(100, (normalizedRating - index) * 100));

        return (
            <div className="star-wrapper" key={index}>
                {/* Empty Star Background */}
                <svg className="star-svg star-empty" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>

                {/* Filled Star Overlay (clipped by percentage) */}
                <svg className="star-svg star-filled" viewBox="0 0 24 24" style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>
        );
    };

    return (
        <div className="star-rating-container" aria-label={`Rating: ${rating} out of 10`}>
            <div className="stars">
                {[...Array(count)].map((_, i) => renderStar(i))}
            </div>
            <span className="rating-text">{Number(rating).toFixed(1)}</span>
        </div>
    );
};

export default StarRating;
