import React, { useState } from 'react';
import { Palette, Layout, Database, Info } from 'lucide-react';
import AppearanceSection from './sections/Appearance';
import LayoutSection from './sections/Layout';
import DataSection from './sections/Data';
import AboutSection from './sections/About';
import './styles.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('appearance');

    const renderContent = () => {
        switch (activeTab) {
            case 'appearance': return <AppearanceSection />;
            case 'layout': return <LayoutSection />;
            case 'data': return <DataSection />;
            case 'about': return <AboutSection />;
            default: return <AppearanceSection />;
        }
    };

    return (
        <div className="page-wrapper settings-wrapper">
            <div className="settings-page">
                <div className="settings-header-banner">
                    <button className="back-button" onClick={() => window.history.back()}>
                        &larr;
                    </button>
                    <div className="settings-title-group">
                        <h1>Settings</h1>
                        <p>Customize your experience</p>
                    </div>
                </div>

                <div className="settings-container">
                    <aside className="settings-sidebar">
                        <nav>
                            <button
                                className={`nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
                                onClick={() => setActiveTab('appearance')}
                            >
                                <span className="icon"><Palette size={20} /></span>
                                <div className="text-content">
                                    <strong>Appearance</strong>
                                    <span>Theme & visual settings</span>
                                </div>
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'layout' ? 'active' : ''}`}
                                onClick={() => setActiveTab('layout')}
                            >
                                <span className="icon"><Layout size={20} /></span>
                                <div className="text-content">
                                    <strong>Layout</strong>
                                    <span>Grid & card preferences</span>
                                </div>
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'data' ? 'active' : ''}`}
                                onClick={() => setActiveTab('data')}
                            >
                                <span className="icon"><Database size={20} /></span>
                                <div className="text-content">
                                    <strong>Data & Import</strong>
                                    <span>Export, import, cleanup</span>
                                </div>
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
                                onClick={() => setActiveTab('about')}
                            >
                                <span className="icon"><Info size={20} /></span>
                                <div className="text-content">
                                    <strong>About</strong>
                                    <span>Version & developer info</span>
                                </div>
                            </button>
                        </nav>
                    </aside>

                    <main className="settings-main">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Settings;
