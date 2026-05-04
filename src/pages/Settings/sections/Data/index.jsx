import React from 'react';
import { Database, Download, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLayout } from '@/context/LayoutContext';
import { useUserMovies } from '@/hooks/useUserMovies';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import './styles.css';

const DataSection = () => {
    const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);
    const [isWatchlistModalOpen, setIsWatchlistModalOpen] = React.useState(false);

    const { theme, backgroundPattern, resetTheme } = useTheme();
    const { cardSize, glassLevel, showMetadata, resetLayout } = useLayout();
    const { clearWatchHistory, clearWatchlist } = useUserMovies();

    const handleExport = () => {
        const settings = {
            appearance: { theme, backgroundPattern },
            layout: { cardSize, glassLevel, showMetadata },
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `joe4cast-settings-${new Date().toLocaleDateString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all settings to default? This will revert your theme and layout preferences.')) {
            resetTheme();
            resetLayout();
        }
    };

    const confirmClearHistory = async () => {
        const success = await clearWatchHistory();
        if (success) {
            // Success ui could go here
        }
    };

    const confirmClearWatchlist = async () => {
        const success = await clearWatchlist();
        if (success) {
            // Success ui could go here
        }
    };

    return (
        <div className="settings-section animate-fade-in data-section">
            <h2><span className="icon"><Database size={20} /></span> Data & Insights</h2>

            <div className="data-grid">
                {/* Backup / Export */}
                <div className="data-card">
                    <div className="data-card-info">
                        <h3><Download size={18} /> Export Settings</h3>
                        <p>Download your current preferences as a JSON file.</p>
                    </div>
                    <button className="btn-data btn-export" onClick={handleExport}>
                        <Download size={16} /> Export
                    </button>
                </div>

                {/* Import Placeholder */}
                <div className="data-card opacity-60">
                    <div className="data-card-info">
                        <h3><ShieldCheck size={18} /> Import Settings</h3>
                        <p>Restore settings from a backup file (Coming Soon).</p>
                    </div>
                    <button className="btn-data bg-surface3 cursor-not-allowed" disabled>
                        Locked
                    </button>
                </div>

                {/* Reset Section - Danger Zone */}
                <div className="data-card danger-zone">
                    <div className="data-card-info">
                        <h3 className="text-red-500"><AlertTriangle size={18} /> Factory Reset</h3>
                        <p>Reset all theme and layout settings to their original state.</p>
                    </div>
                    <button className="btn-data btn-reset" onClick={handleReset}>
                        <RefreshCw size={16} /> Reset All
                    </button>
                </div>

                {/* Account Data Deletion - Danger Zone */}
                <div className="data-card danger-zone">
                    <div className="data-card-info">
                        <h3 className="text-red-500"><AlertTriangle size={18} /> Clear Watch History</h3>
                        <p>Wipe your entire Continue Watching list. Requires confirmation.</p>
                    </div>
                    <button className="btn-data btn-reset" onClick={() => setIsHistoryModalOpen(true)}>
                        <RefreshCw size={16} /> Clear History
                    </button>
                </div>

                <div className="data-card danger-zone">
                    <div className="data-card-info">
                        <h3 className="text-red-500"><AlertTriangle size={18} /> Delete Watchlist</h3>
                        <p>Permanently empty your saved My Watchlist items.</p>
                    </div>
                    <button className="btn-data btn-reset" onClick={() => setIsWatchlistModalOpen(true)}>
                        <RefreshCw size={16} /> Empty Watchlist
                    </button>
                </div>
            </div>

            {/* Custom Premium Modals */}
            <ConfirmationModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                onConfirm={confirmClearHistory}
                title="Clear Watch History"
                message="Are you sure you want to wipe your entire 'Continue Watching' history? This action cannot be undone and your place in all media will be lost."
                requireInput="DELETE"
                confirmText="Yes, Wipe History"
            />

            <ConfirmationModal
                isOpen={isWatchlistModalOpen}
                onClose={() => setIsWatchlistModalOpen(false)}
                onConfirm={confirmClearWatchlist}
                title="Delete Watchlist"
                message="Are you sure you want to completely empty your saved Watchlist? All saved movies will be removed permanently."
                confirmText="Yes, Empty Watchlist"
            />
        </div>
    );
};

export default DataSection;
