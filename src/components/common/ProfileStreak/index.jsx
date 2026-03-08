import React from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import { useUserMoviesContext } from '@/context/UserMoviesContext';
import './styles.css';

const ProfileStreak = ({ className = "" }) => {
    const { streakData, loading } = useUserMoviesContext();

    if (loading || !streakData.current) return null;

    const currentStreak = streakData.current;
    const isElite = currentStreak >= 7;
    const isMaster = currentStreak >= 30;

    // Weekly progress logic (Sunday to Saturday)
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 = Sun, 1 = Mon, etc.

    // Calculate which days are part of the streak
    // We assume the streak ends today or yesterday (if they haven't checked in yet, but the calculation logic handles that)
    // Actually our UserMoviesContext updates the streak as soon as they load the page, so lastActiveDate is likely today.
    const activeDays = new Array(7).fill(false);

    // Simple inference: highlight the last 'currentStreak' days leading up to today
    for (let i = 0; i < currentStreak; i++) {
        const dayIdx = (currentDayIndex - i + 7) % 7;
        // Only mark if it's within the current 7-day trailing window to avoid highlighting the whole week if streak > 7
        // but for a "weekly view" we usually want to see the progress of the current calendar week.
        // Let's just highlight the days that are part of the streak.
        activeDays[dayIdx] = true;
        // Optimization: if streak is very long, all 7 days of the view are active
        if (i >= 6) break;
    }

    return (
        <div className={`profile-streak-card ${isMaster ? 'tier-master' : isElite ? 'tier-elite' : 'tier-basic'} ${className}`}>
            <div className="streak-main-display">
                <div className="streak-fire-platform">
                    <div className="fire-container">
                        <div className="fire-glow"></div>
                        <div className="fire-particles"></div>
                        <Flame
                            size={100}
                            className="main-flame-icon"
                            fill="currentColor"
                        />
                    </div>
                </div>

                <div className="streak-stats-info">
                    <div className="streak-count-wrapper">
                        <span className="count-number">{currentStreak}</span>
                        <div className="count-label">
                            <h3>Day Streak</h3>
                            <p>{isMaster ? 'Master Tier' : isElite ? 'Elite Tier' : 'Active'}</p>
                        </div>
                    </div>

                    {!isElite && (
                        <div className="streak-milestone-hint">
                            <div className="hint-progress-bar">
                                <div className="hint-progress-fill" style={{ width: `${(currentStreak / 7) * 100}%` }}></div>
                            </div>
                            <span>{7 - currentStreak} days to Purple Fire</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="streak-weekly-map">
                {daysOfWeek.map((day, idx) => {
                    const isToday = idx === currentDayIndex;
                    const isHit = activeDays[idx];

                    return (
                        <div key={idx} className={`day-node ${isHit ? 'node-hit' : ''} ${isToday ? 'node-today' : ''}`}>
                            <div className="node-circle">
                                {isHit ? <CheckCircle2 size={16} /> : <span>{day}</span>}
                            </div>
                            <span className="day-label">{day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfileStreak;
