import React, { useMemo, useRef, useEffect } from 'react';
import { useUserMoviesContext } from '@/context/UserMoviesContext';
import './styles.css';

const CinephileGrid = ({ className = "" }) => {
    const { activityPoints, loading } = useUserMoviesContext();
    const scrollRef = useRef(null);

    // Generate days for the last 52 weeks
    const gridData = useMemo(() => {
        const data = [];
        const today = new Date();

        // Start from exactly 364 days ago to have 52 full weeks
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364);

        // Adjust to the nearest previous Sunday to align weeks
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);

        const iterDate = new Date(startDate);
        const now = new Date();

        while (iterDate <= now) {
            const dateStr = iterDate.toISOString().split('T')[0];
            const points = activityPoints[dateStr] || 0;

            // Tier calculation
            let level = 0;
            if (points >= 10) level = 4;
            else if (points >= 6) level = 3;
            else if (points >= 3) level = 2;
            else if (points > 0) level = 1;

            data.push({
                date: dateStr,
                points,
                level,
                displayDate: iterDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });

            iterDate.setDate(iterDate.getDate() + 1);
        }
        return data;
    }, [activityPoints]);

    // Group into weeks for the vertical layout (7 rows per column)
    const weeks = useMemo(() => {
        const w = [];
        for (let i = 0; i < gridData.length; i += 7) {
            w.push(gridData.slice(i, i + 7));
        }
        return w;
    }, [gridData]);

    // Auto-scroll to end on mount
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [weeks]);

    if (loading) return <div className="grid-skeleton"></div>;

    const totalContributions = Object.values(activityPoints).reduce((a, b) => a + Number(b), 0);

    return (
        <div className={`cinephile-grid-container ${className}`}>
            <div className="grid-header">
                <div className="grid-title-area">
                    <h3>Cinephile Productivity</h3>
                    <p>{totalContributions} activity points in the last year</p>
                </div>
                <div className="grid-legend">
                    <span>Less</span>
                    <div className="legend-square lvl-0"></div>
                    <div className="legend-square lvl-1"></div>
                    <div className="legend-square lvl-2"></div>
                    <div className="legend-square lvl-3"></div>
                    <div className="legend-square lvl-4"></div>
                    <span>More</span>
                </div>
            </div>

            <div className="grid-scroll-wrapper" ref={scrollRef}>
                <div className="grid-labels-y">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                </div>
                <div className="grid-main">
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="grid-column">
                            {week.map((day, dIdx) => (
                                <div
                                    key={day.date}
                                    className={`grid-square lvl-${day.level}`}
                                    title={`${day.points} points on ${day.displayDate}`}
                                >
                                    <div className="square-tooltip">
                                        <strong>{day.points} points</strong>
                                        <span>{day.displayDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid-months-x">
                {/* Simplified month labels logic */}
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                    <span key={m}>{m}</span>
                ))}
            </div>
        </div>
    );
};

export default CinephileGrid;
