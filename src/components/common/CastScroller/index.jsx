import React, { useRef } from 'react';
import { TMDB_IMAGE_BASE } from '@/config/constants';
import './styles.css';

const CastScroller = ({ cast }) => {
    const scrollRef = useRef(null);

    if (!cast || cast.length === 0) return null;

    return (
        <section className="cast-scroller-section">
            <h3 className="section-title">Top Cast</h3>
            <div className="scroller-container">
                <div className="scroller-track" ref={scrollRef}>
                    {cast.map(actor => (
                        <div key={actor.id} className="actor-card">
                            <div className="actor-photo">
                                {actor.profile_path ? (
                                    <img
                                        src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                                        alt={actor.name}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="actor-photo-placeholder">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="actor-info">
                                <span className="actor-name">{actor.name}</span>
                                <span className="actor-character">{actor.character}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CastScroller;
