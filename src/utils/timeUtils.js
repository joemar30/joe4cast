/**
 * Formats a given time into a human-readable string indicating how much time a user has spent watching.
 * It provides a display similar to Steam or Dota (e.g., "250 hours", "45 minutes", "2 hours 30 minutes").
 * 
 * @param {number} minutes - The total watch time in minutes (can be adapted if your data is in seconds).
 * @returns {string} The formatted watch time string.
 */
export const formatWatchTime = (minutes) => {
    if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) {
        return '0 minutes';
    }

    if (minutes < 60) {
        const mins = Math.floor(minutes);
        return `${mins} minute${mins !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);

    // Like Steam: if the user has spent a massive amount of time (e.g., over 100 hours),
    // it often just shows the total hours and one decimal for cleaner display.
    if (hours >= 100) {
        const totalHours = (minutes / 60).toFixed(1);
        // Convert back to number to remove trailing .0 if present, then format with commas (e.g., "1,250.5")
        const formattedHours = Number(totalHours).toLocaleString('en-US');
        return `${formattedHours} hours`;
    }

    // Exact display for smaller amounts of time
    if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
};
