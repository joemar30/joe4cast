import React, { useState } from 'react';
import { Layers, MousePointer2, PaintBucket, Loader, BellRing, Search, SlidersHorizontal, Image, Box, Users, Star, Flame, AlertCircle, MessageCircle, Palette, ChevronDown } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';
import { triggerError } from '../../../components/common/ErrorToast';

const ComponentShower = ({ title, description, code, children, icon: Icon = Layers }) => (
    <div style={{
        background: 'var(--c-bg)',
        borderRadius: '16px',
        border: '1px solid var(--c-surface2)',
        overflow: 'hidden',
        marginBottom: '40px'
    }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--c-surface2)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(203, 166, 247, 0.1)', padding: '12px', borderRadius: '12px', color: '#cba6f7', flexShrink: 0 }}>
                <Icon size={24} />
            </div>
            <div>
                <h3 style={{ margin: '0 0 4px 0', color: 'var(--c-text)', fontSize: '1.2rem' }}>{title}</h3>
                <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.85rem' }}>{description}</p>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="component-shower-split" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', minHeight: '200px' }}>
                {/* Live Preview Pane */}
                <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '32px',
                    borderRight: '1px solid var(--c-surface2)',
                    borderBottom: '1px solid var(--c-surface2)',
                    overflow: 'hidden',
                    minHeight: '250px'
                }}>
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--c-text2)', fontWeight: 600 }}>
                        <MousePointer2 size={12} /> Live Render
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        {children}
                    </div>
                </div>

                {/* Code Implementation Pane */}
                <div style={{ background: '#1e1e2e', overflow: 'hidden' }}>
                    <div style={{ padding: '0 20px', fontSize: '0.9rem' }}>
                        <CodeBlock code={code} language="jsx" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Mocks for rendering inside the showcase
const ColorSwatch = ({ name, varName }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: `var(${varName})`, border: '2px solid var(--c-surface2)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--c-text2)' }}>{name}</span>
    </div>
);

const CinematicLoaderPreview = () => (
    <div style={{ position: 'relative', height: '120px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', filter: 'drop-shadow(0 0 10px var(--c-accent-glow))' }}>
            <span style={{ background: 'var(--c-accent)', color: 'white', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontWeight: '800', marginRight: '8px', fontSize: '1.2rem' }}>V</span>
            <span style={{ color: 'var(--c-text)', fontWeight: '700', letterSpacing: '-1px', fontSize: '1.5rem' }}>ibeo</span>
        </div>
        <div style={{ width: '120px', height: '2px', background: 'var(--c-surface2)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '40%', background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)', animation: 'loading-bar 1.5s infinite ease-in-out' }} />
        </div>
        <style>{`
            @keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
        `}</style>
    </div>
);

const DemoInput = () => (
    <div style={{ width: '100%', maxWidth: '200px' }}>
        <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--c-text2)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
                type="text" 
                placeholder="Search..." 
                disabled
                style={{ width: '100%', background: 'var(--c-bg)', border: '1px solid var(--c-surface2)', padding: '10px 10px 10px 36px', borderRadius: '8px', color: 'var(--c-text)' }} 
            />
        </div>
    </div>
);

// --- NEW MOCKS ---
const DemoMovieCard = () => (
    <div style={{
        width: '160px', height: '240px', borderRadius: '12px', overflow: 'hidden',
        position: 'relative', cursor: 'pointer', background: 'var(--c-surface)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'transform 0.3s, box-shadow 0.3s'
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(203, 166, 247, 0.2)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
    >
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #1e1e2e, #313244)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-text2)' }}>
            <Image size={40} opacity={0.5} />
        </div>
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: '#f9e2af', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)' }}>
            <Star size={10} fill="currentColor" /> 8.5
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '20px 12px 12px 12px' }}>
            <h4 style={{ margin: 0, color: 'white', fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Interstellar</h4>
            <p style={{ margin: 0, color: 'var(--c-text2)', fontSize: '0.75rem' }}>2014</p>
        </div>
    </div>
);

const DemoSkeleton = () => (
    <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
        {[1, 2, 3].map(i => (
            <div key={i} style={{ width: '100%', flex: 1, height: '180px', borderRadius: '12px', background: 'var(--c-surface)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: '-100%', height: '100%', width: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)', animation: 'shimmer 1.5s infinite' }} />
            </div>
        ))}
        <style>{`@keyframes shimmer { 100% { left: 100%; } }`}</style>
    </div>
);

const DemoCastScroller = () => (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', width: '100%', paddingBottom: '8px' }} className="no-scrollbar">
        {['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'].map((name, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--c-surface2)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-text2)' }}>
                    <Users size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--c-text)', textAlign: 'center', lineHeight: '1.2' }}>{name}</span>
            </div>
        ))}
    </div>
);

const DemoStarRating = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
                {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.8)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1.1)'}>
                        <Star size={28} color={star <= (hover || rating) ? '#f9e2af' : 'var(--c-surface2)'} fill={star <= (hover || rating) ? '#f9e2af' : 'transparent'} style={{ filter: star <= (hover || rating) ? 'drop-shadow(0 0 8px rgba(249, 226, 175, 0.4))' : 'none', transition: 'all 0.2s' }} />
                    </button>
                ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--c-text2)', fontWeight: 600 }}>{rating > 0 ? `You rated this ${rating} stars` : 'Rate this title'}</span>
        </div>
    );
};

const DemoStreakCounter = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(250, 179, 135, 0.1)', border: '1px solid rgba(250, 179, 135, 0.3)', borderRadius: '20px', color: '#fab387', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 0 15px rgba(250, 179, 135, 0.1)', cursor: 'default' }}>
        <Flame size={16} fill="currentColor" /> 5 Day Streak
    </div>
);

const DemoConfirmationModal = () => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => setOpen(true)} style={{ background: 'var(--c-surface)', color: 'var(--c-text)', border: '1px solid var(--c-surface2)', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Trigger Modal</button>
            {open && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, animation: 'fadeIn 0.2s ease-out' }}>
                    <div style={{ background: 'var(--c-bg)', border: '1px solid var(--c-surface2)', borderRadius: '16px', padding: '24px', width: '300px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f38ba8', marginBottom: '16px' }}>
                            <AlertCircle size={24} /> <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Remove Item</h4>
                        </div>
                        <p style={{ color: 'var(--c-text2)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>Are you sure you want to remove this from your watchlist?</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setOpen(false)} style={{ background: 'transparent', color: 'var(--c-text2)', border: 'none', fontWeight: 600, cursor: 'pointer', padding: '8px 16px' }}>Cancel</button>
                            <button onClick={() => setOpen(false)} style={{ background: '#f38ba8', color: '#11111b', border: 'none', fontWeight: 700, borderRadius: '8px', cursor: 'pointer', padding: '8px 16px' }}>Remove</button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        </div>
    );
};

const DemoVibeyChat = () => (
    <div style={{ position: 'relative', width: '100%', height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '20px' }}>
        <button style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--c-accent), #8b5cf6)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 25px rgba(203, 166, 247, 0.4)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <MessageCircle size={24} />
        </button>
        <div style={{ position: 'absolute', bottom: '80px', right: '20px', background: 'var(--c-surface)', padding: '8px 16px', borderRadius: '12px 12px 0 12px', fontSize: '0.8rem', color: 'var(--c-text)', border: '1px solid var(--c-surface2)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            AI Ready! ✨
        </div>
    </div>
);

const DemoThemeSelector = () => (
    <div style={{ display: 'flex', gap: '8px', background: 'var(--c-surface)', padding: '6px', borderRadius: '12px', border: '1px solid var(--c-surface2)' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-accent)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            <Palette size={14} color="var(--c-accent)" /> Dark
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'transparent', color: 'var(--c-text2)', border: '1px solid transparent', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--c-surface2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            Light
        </button>
    </div>
);

const DemoWatchlistDropdown = () => (
    <div style={{ position: 'relative' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--c-surface)', color: 'var(--c-text)', border: '1px solid var(--c-surface2)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Watching <ChevronDown size={16} color="var(--c-text2)" />
        </button>
    </div>
);
// --- END MOCKS ---

const ComponentsSection = () => {
    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ marginBottom: '40px' }}>
                <h2 className="docs-heading">Design System</h2>
                <p className="docs-subheading">
                    Vibeo utilizes a custom, scalable <strong>React Design System</strong>. Instead of writing inline styles
                    repeatedly, we built modular, reusable UI components mapped to our custom CSS design tokens.
                </p>
            </div>

            <ComponentShower
                title="Design Tokens (Variables)"
                icon={PaintBucket}
                description="Core color mapping extracted from index.css. Changing these values universally skins the entire app."
                code={`/* Global Theme Tokens inside index.css */
:root {
  --c-bg: #11111b;        /* App Background */
  --c-surface: #1e1e2e;   /* Card Background */
  --c-accent: #cba6f7;    /* Primary Brand */
  --c-text: #cdd6f4;      /* Primary Text */
  --c-text2: #a6adc8;     /* Muted Text */
}`}
            >
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <ColorSwatch name="Background" varName="--c-bg" />
                    <ColorSwatch name="Surface" varName="--c-surface" />
                    <ColorSwatch name="Accent" varName="--c-accent" />
                    <ColorSwatch name="Text" varName="--c-text" />
                </div>
            </ComponentShower>

            <ComponentShower
                title="Cinematic Loader"
                icon={Loader}
                description="A specialized suspense-fallback animation used during route transitions or heavy API calls."
                code={`<Suspense fallback={<LoadingScreen />}>
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
    </Routes>
</Suspense>`}
            >
                <CinematicLoaderPreview />
            </ComponentShower>

            <ComponentShower
                title="Global Event Toast Notifications"
                icon={BellRing}
                description="Click the button to dispatch a CustomEvent. The globally mounted ErrorToast component will catch it."
                code={`import { triggerError } from '@/components/common/ErrorToast';

// Call from ANYWHERE in the app without prop-drilling
const handleFetch = () => {
    try {
        await brokenApiCall();
    } catch {
        triggerError("Failed to fetch movie data!", "error");
    }
};`}
            >
                <button 
                    onClick={() => triggerError("Demo error triggered from Docs Playground!", "error")}
                    style={{ background: 'var(--c-accent)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'filter 0.2s', filter: 'brightness(1)' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                >
                    Trigger Demo Toast
                </button>
            </ComponentShower>

            <ComponentShower
                title="Form Controls"
                icon={SlidersHorizontal}
                description="Standardized inputs ensuring border-radius, padding, and pseudo-class styling remain consistent."
                code={`<div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-text2)]" size={16} />
    <input 
        type="text" 
        className="w-full bg-[var(--c-bg)] border border-[var(--c-surface2)] rounded-lg py-2 pl-9 pr-3 text-[var(--c-text)]"
        placeholder="Search..."
    />
</div>`}
            >
                <DemoInput />
            </ComponentShower>

            <ComponentShower
                title="Interactive Movie Card"
                icon={Image}
                description="The standard interactive hover card with posters, rating pills, and data overlay."
                code={`<MovieCard movie={{ id: 1, title: 'Interstellar', vote_average: 8.5 }} />`}
            >
                <DemoMovieCard />
            </ComponentShower>

            <ComponentShower
                title="Glassmorphic Skeleton Loaders"
                icon={Box}
                description="Data placeholders highlighting loading states elegantly with shimmering pulse gradients."
                code={`<Skeleton count={3} type="grid" />`}
            >
                <DemoSkeleton />
            </ComponentShower>

            <ComponentShower
                title="Actor / Cast Scroller"
                icon={Users}
                description="A horizontally scrolling list of circular avatars with name plates below."
                code={`<CastScroller items={movie.credits.cast} />`}
            >
                <DemoCastScroller />
            </ComponentShower>

            <ComponentShower
                title="Interactive Star Rating"
                icon={Star}
                description="The visual interface for users to rate media with hover feedback."
                code={`<StarRating initial={0} onRate={(val) => submitRating(val)} />`}
            >
                <DemoStarRating />
            </ComponentShower>

            <ComponentShower
                title="User Streak Counter"
                icon={Flame}
                description="Gamification pill showing login streaks with glowing border implementations."
                code={`<ProfileStreak days={user.streak.currentCount} />`}
            >
                <DemoStreakCounter />
            </ComponentShower>

            <ComponentShower
                title="Confirmation Modal"
                icon={AlertCircle}
                description="Blurred-background dialog box demonstrating absolute positioning for user destruction flows."
                code={`<ConfirmationModal isOpen={showDelete} title="Remove Item" onConfirm={handleDelete} />`}
            >
                <DemoConfirmationModal />
            </ComponentShower>

            <ComponentShower
                title="Vibey AI Chat Trigger"
                icon={MessageCircle}
                description="Floating action button rendering the AI widget."
                code={`<VibeyChat sessionID={user.uid} context="dashboard" />`}
            >
                <DemoVibeyChat />
            </ComponentShower>

            <ComponentShower
                title="Theme Selector Controls"
                icon={Palette}
                description="Buttons to select predefined themes or UI color mappings."
                code={`<ThemeSelector current={userTheme} onChange={setTheme} />`}
            >
                <DemoThemeSelector />
            </ComponentShower>

            <ComponentShower
                title="Watchlist Action Dropdown"
                icon={ChevronDown}
                description="Custom styled dropdown menus substituting native elements for watchlist lists."
                code={`<WatchlistDropdown currentList="Watching" options={['Plan to Watch', 'Watching']} />`}
            >
                <DemoWatchlistDropdown />
            </ComponentShower>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ComponentsSection;
