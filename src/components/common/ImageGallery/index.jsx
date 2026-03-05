import React, { useRef } from 'react';
import { TMDB_BACKDROP_BASE } from '@/config/constants';
import './styles.css';

const ImageGallery = ({ images }) => {
    const scrollRef = useRef(null);

    if (!images || images.length === 0) return null;

    return (
        <section className="gallery-section">
            <h3 className="section-title">Gallery</h3>
            <div className="gallery-container">
                <div className="gallery-track" ref={scrollRef}>
                    {images.map((img, index) => (
                        <div key={index} className="gallery-card">
                            <img
                                src={`${TMDB_BACKDROP_BASE}${img.file_path}`}
                                alt="Movie backdrop"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImageGallery;
