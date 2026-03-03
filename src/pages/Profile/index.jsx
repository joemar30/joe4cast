import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MovieCard from '@/components/common/MovieCard';
import { useUserMovies } from '@/hooks/useUserMovies';
import { useNavigate } from 'react-router-dom';
import { formatWatchTime } from '@/utils/timeUtils';
import './styles.css';

const Profile = () => {
    const { currentUser } = useAuth();
    const { watchlist, continueWatching, totalWatchTime } = useUserMovies();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="profile-details-card fade-in-up">
                        <div className="profile-card-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <h2>Profile Details</h2>
                        </div>

                        <div className="profile-card-body">
                            <div className="profile-avatar-wrapper">
                                <img
                                    src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.email}&background=random`}
                                    alt="Profile"
                                    className="profile-large-avatar"
                                />
                                <button className="profile-edit-btn" aria-label="Edit Profile">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="profile-info-content">
                                <div className="profile-info-item">
                                    <span className="profile-info-label">DISPLAY NAME</span>
                                    <span className="profile-info-value">{currentUser?.displayName || 'User'}</span>
                                </div>
                                <div className="profile-info-item">
                                    <span className="profile-info-label">EMAIL ADDRESS</span>
                                    <span className="profile-info-value">{currentUser?.email}</span>
                                </div>
                                <div className="profile-info-item">
                                    <span className="profile-info-label">JOINED ON</span>
                                    <span className="profile-info-value">{currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'January 18, 2026'}</span>
                                </div>
                                <div className="profile-info-item">
                                    <span className="profile-info-label">TIME SPENT WATCHING</span>
                                    <span className="profile-info-value">{formatWatchTime((totalWatchTime || 0) / 60)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'watching':
                if (continueWatching.length === 0) {
                    return (
                        <div className="profile-empty-state fade-in-up">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <h3>No Active Shows</h3>
                            <p>You haven't started watching any movies yet.</p>
                        </div>
                    );
                }
                return (
                    <div className="profile-grid fade-in-up">
                        {continueWatching.map((movie, index) => (
                            <div className="browse-card-wrap" key={`cw-${movie.id}`}>
                                <MovieCard
                                    movie={movie}
                                    onClick={(m) => navigate(`/watch/${m.id}`)}
                                    animationDelay={`${index * 40}ms`}
                                />
                            </div>
                        ))}
                    </div>
                );
            case 'watchlist':
                if (watchlist.length === 0) {
                    return (
                        <div className="profile-empty-state fade-in-up">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <h3>Your Watchlist is Empty</h3>
                            <p>Discover movies based on your mood and add them here!</p>
                        </div>
                    );
                }
                return (
                    <div className="profile-grid fade-in-up">
                        {watchlist.map((movie, index) => (
                            <div className="browse-card-wrap" key={`wl-${movie.id}`}>
                                <MovieCard
                                    movie={movie}
                                    onClick={(m) => navigate(`/watch/${m.id}`)}
                                    animationDelay={`${index * 40}ms`}
                                />
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-wrapper">
            <Header />

            <main className="profile-main">
                {/* Hero section */}
                <div className="profile-hero">
                    <div className="profile-hero-bg"></div>
                    <div className="profile-hero-content">
                        <h1 className="profile-greeting">
                            Hi, <span className="profile-name-highlight">{currentUser?.displayName?.split(' ')[0] || 'User'}</span>
                        </h1>
                        <p className="profile-subtitle">Welcome back to your personal hub</p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="profile-tabs-container">
                        <div className="profile-tabs">
                            <button
                                className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Profile
                            </button>
                            <button
                                className={`profile-tab ${activeTab === 'watching' ? 'active' : ''}`}
                                onClick={() => setActiveTab('watching')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Continue Watching
                            </button>
                            <button
                                className={`profile-tab ${activeTab === 'watchlist' ? 'active' : ''}`}
                                onClick={() => setActiveTab('watchlist')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                Watch List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="profile-content-area">
                    {renderTabContent()}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
