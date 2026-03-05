import React from 'react';
import './styles.css';

const ReviewSection = ({ reviews }) => {
    if (!reviews || reviews.length === 0) return null;

    // Helper to truncate long reviews
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <section className="reviews-section">
            <h3 className="section-title">Featured Reviews</h3>
            <div className="reviews-grid">
                {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="reviewer-avatar">
                                {review.author_details?.avatar_path ? (
                                    <img
                                        src={review.author_details.avatar_path.startsWith('/https')
                                            ? review.author_details.avatar_path.substring(1)
                                            : `https://image.tmdb.org/t/p/w185${review.author_details.avatar_path}`
                                        }
                                        alt={review.author}
                                        loading="lazy"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <span>{review.author.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="reviewer-meta">
                                <h4 className="reviewer-name">{review.author}</h4>
                                {review.author_details?.rating && (
                                    <span className="reviewer-rating">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
                                        </svg>
                                        {review.author_details.rating}/10
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="review-content">
                            <p>{truncateText(review.content, 400)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ReviewSection;
