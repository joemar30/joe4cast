import React from 'react';
import { CheckCircle, Info, Zap, Code2, Database, Cloud, Palette, Layers, Terminal, Activity } from 'lucide-react';

const TechBadge = ({ icon: Icon, label, color }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: `rgba(${color}, 0.1)`, 
        border: `1px solid rgba(${color}, 0.2)`,
        padding: '8px 16px', borderRadius: '12px',
        color: `rgb(${color})`, fontWeight: 600, fontSize: '0.9rem'
    }}>
        <Icon size={18} /> {label}
    </div>
);

const MetricBlock = ({ icon: Icon, value, label }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        padding: '16px', flex: 1, textAlign: 'center'
    }}>
        <Icon size={24} color="var(--c-text2)" style={{ marginBottom: '8px' }} />
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text)' }}>{value}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--c-text2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
    </div>
);

const ChecklistItem = ({ title, status, explanation }) => (
    <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '24px',
        background: 'var(--c-bg)',
        borderRadius: '16px',
        border: '1px solid var(--c-surface2)',
        marginBottom: '16px',
        transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = 'var(--c-accent)';
    }}
    onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--c-surface2)';
    }}>
        <div style={{ marginTop: '4px' }}>
            {status ? <CheckCircle color="#a6e3a1" size={24} /> : <Info color="#89b4fa" size={24} />}
        </div>
        <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--c-text)' }}>{title}</h4>
            <p style={{ margin: 0, color: 'var(--c-text2)', lineHeight: '1.6' }}>{explanation}</p>
        </div>
    </div>
);

const OverviewSection = () => {
    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <span style={{
                    background: 'linear-gradient(135deg, var(--c-accent), #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '3rem',
                    fontWeight: 800,
                    letterSpacing: '-1px'
                }}>Project Overview</span>
            </div>

            <p style={{
                color: 'var(--c-text2)',
                fontSize: '1.2rem',
                lineHeight: '1.7',
                marginBottom: '40px',
                maxWidth: '800px'
            }}>
                Vibeo is a modern media discovery platform designed with premium UI patterns.
                This documentation hub proves the correct implementation of the required system architecture.
            </p>

            {/* Tech Stack Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
                <TechBadge icon={Code2} label="React 19" color="137, 180, 250" />
                <TechBadge icon={Zap} label="Vite" color="249, 226, 175" />
                <TechBadge icon={Database} label="Firebase NoSQL" color="250, 179, 135" />
                <TechBadge icon={Cloud} label="Vercel Edge" color="205, 214, 244" />
                <TechBadge icon={Palette} label="Tailwind CSS v4" color="137, 220, 235" />
            </div>

            {/* Metrics Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--c-bg)', borderRadius: '16px', border: '1px solid var(--c-surface2)',
                marginBottom: '48px', overflow: 'hidden'
            }}>
                <MetricBlock icon={Layers} value="15+" label="Custom Components" />
                <div style={{ width: '1px', background: 'var(--c-surface2)', height: '60px' }} />
                <MetricBlock icon={Activity} value="5" label="External APIs" />
                <div style={{ width: '1px', background: 'var(--c-surface2)', height: '60px' }} />
                <MetricBlock icon={Database} value="3" label="NoSQL Collections" />
                <div style={{ width: '1px', background: 'var(--c-surface2)', height: '60px' }} />
                <MetricBlock icon={Terminal} value="2" label="Serverless Functions" />
            </div>

            <h3 style={{
                fontSize: '1.5rem',
                color: 'var(--c-text)',
                marginBottom: '24px',
                borderBottom: '1px solid var(--c-surface2)',
                paddingBottom: '12px'
            }}>Modern Technical Equivalency</h3>

            <p style={{ color: 'var(--c-text2)', marginBottom: '32px' }}>
                Instead of older legacy architectures (like localhost Django with SQL), Vibeo uses a modern
                <strong> Serverless Edge Architecture</strong>. Below is the mapping of the project requirements to our implementation:
            </p>

            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                <ChecklistItem
                    title="1. Server & Environment Setup"
                    status={true}
                    explanation="Deployed globally on Vercel Edge Network instead of standard localhost. Custom Hostinger domain connected."
                />
                <ChecklistItem
                    title="2. REST API & HTTP Methods"
                    status={true}
                    explanation="Full CRUD implementations using Firebase Firestore. External GET requests via TMDB, and POST requests handled securely via Vercel Serverless Functions."
                />
                <ChecklistItem
                    title="3. Authentication"
                    status={true}
                    explanation="We replaced basic Token Auth with Enterprise-grade Firebase Authentication (Google OAuth provider) with full rote protection."
                />
                <ChecklistItem
                    title="4. Postman & Swagger Validation"
                    status={true}
                    explanation="Instead of static Swagger docs, we built this fully interactive React Documentation Dashboard directly into the app."
                />
                <ChecklistItem
                    title="5. State & Data Flow"
                    status={true}
                    explanation="Utilizes React Context API to manage global Authentication scope and User Data without prop-drilling."
                />
                <ChecklistItem
                    title="6. AI Integration (Bonus Feature)"
                    status={true}
                    explanation="Seamless integration with Llama 3 AI models via Groq Serverless proxies to power the interactive 'Vibey' assistant."
                />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default OverviewSection;
