import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ThemeSelector from '@/components/common/ThemeSelector';
import './styles.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, loginWithGoogle, logout } = useAuth();
    const [search, setSearch] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isOnboardingPage = location.pathname === '/onboarding';

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            setIsMobileMenuOpen(false); // Make sure mobile menu closes on search submit
        }
    };

    const renderActions = (className) => (
        <div className={className}>
            <ThemeSelector />

            {/* Authentication Section */}
            {currentUser ? (
                <div className="topbar__user-container">
                    <img
                        src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.email}&background=random`}
                        alt={currentUser.displayName || 'User Profile'}
                        className="topbar__user-avatar"
                    />

                    <div className="topbar__user-dropdown">
                        <div className="dropdown-header">
                            <div className="dropdown-name">{currentUser.displayName || 'User'}</div>
                            <div className="dropdown-email">{currentUser.email}</div>
                        </div>

                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Profile
                            </button>
                            <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Continue Watching
                            </button>
                            <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                Watch List
                            </button>
                        </div>

                        <div className="dropdown-actions">
                            <button className="dropdown-logout" onClick={logout}>
                                Logout
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    className="topbar__login-btn"
                    onClick={loginWithGoogle}
                >
                    Login
                </button>
            )}
        </div>
    );

    return (
        <header className="topbar" role="banner">
            <div className="topbar__inner">

                {/* ── Logo ── */}
                <button className="topbar__logo" onClick={() => navigate('/')} aria-label="Vibeo Home">
                    <img src="/vibeo.png" alt="Vibeo" className="topbar__logo-img" />
                    <span className="topbar__logo-text">
                        <span className="topbar__logo-vibe">Vibe</span>
                        <span className="topbar__logo-reel">o</span>
                    </span>
                </button>

                {/* ── Nav links & Mobile Drawer ── */}
                {!isOnboardingPage && (
                    <>
                        <nav className={`topbar__nav ${isMobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Site Navigation">
                            <div className="topbar__nav-links">
                                {[
                                    { label: 'Home', hash: '' },
                                    { label: 'Trending', hash: 'trending' },
                                    { label: 'Top Rated', hash: 'top-rated' },
                                    { label: 'Mood Match', hash: 'mood-match' },
                                    { label: 'Action & Adventure', hash: 'action' },
                                    { label: 'Drama', hash: 'drama' },
                                    { label: 'New Release', hash: 'new-release' },
                                ].map(link => {
                                    const isHomeActive = location.pathname === '/' && !location.hash && !link.hash;
                                    const isHashActive = location.pathname === '/' && location.hash === `#${link.hash}`;
                                    const isActive = isHomeActive || isHashActive;

                                    return (
                                        <button
                                            key={link.label}
                                            className={`topbar__nav-link ${isActive ? 'active' : ''}`}
                                            onClick={() => {
                                                if (location.pathname !== '/') {
                                                    navigate(link.hash ? `/#${link.hash}` : '/');
                                                } else {
                                                    if (!link.hash) {
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        navigate('/');
                                                    } else {
                                                        const element = document.getElementById(link.hash);
                                                        if (element) {
                                                            const y = element.getBoundingClientRect().top + window.scrollY - 80;
                                                            window.scrollTo({ top: y, behavior: 'smooth' });
                                                        }
                                                        navigate(`/#${link.hash}`);
                                                    }
                                                }
                                                setIsMobileMenuOpen(false); // Close menu on click
                                            }}
                                        >
                                            {link.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Mobile Drawer Actions (Theme & Auth) */}
                            {renderActions("topbar__mobile-actions")}
                        </nav>

                        {/* ── Right side: search + actions + toggle ── */}
                        <div className="topbar__right">
                            {/* Search box */}
                            {!isOnboardingPage && (
                                <form className="topbar__search" onSubmit={handleSearch} onClick={() => document.getElementById('mobile-search-input')?.focus()}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input
                                        id="mobile-search-input"
                                        type="text"
                                        placeholder="Search titles…"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        aria-label="Search movies"
                                    />
                                </form>
                            )}

                            {/* Desktop Actions (Theme & Auth) */}
                            {renderActions("topbar__desktop-actions")}

                            <button
                                className={`topbar__mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle mobile menu"
                            >
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
