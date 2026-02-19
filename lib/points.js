/**
 * lib/points.js — Professional F1 Standings & Points Logic
 */

export const POINTS_TABLE = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
};

export const FASTEST_LAP_BONUS = 1;

/**
 * Calculates points for a single result
 */
export function calculatePoints(position, fastestLap, dnf) {
    if (dnf) return 0;
    const basePoints = POINTS_TABLE[position] ?? 0;
    const flPoints = (fastestLap && position <= 10) ? FASTEST_LAP_BONUS : 0;
    return basePoints + flPoints;
}

/**
 * Calculates constructor points for a team in a race
 */
export function calculateConstructorPoints(results, teamId) {
    return results
        .filter(r => r.teamId === Number(teamId))
        .reduce((sum, r) => sum + r.points, 0);
}

/**
 * Computes Driver Standings for a specific season
 */
export function calculateDriverStandings(drivers, results) {
    if (!results || results.length === 0) {
        // For unstarted seasons (like 2026), return all active pilots with 0 pts
        return drivers
            .filter(d => d.status !== "Retired" && d.status !== "Former")
            .map(d => ({
                id: d.id,
                name: d.name,
                teamId: d.teamId,
                points: 0,
                wins: 0,
                imageUrl: d.imageUrl,
                nationality: d.nationality
            }));
    }

    // Get unique drivers who participated in this specific season
    const participantIds = [...new Set(results.map(r => r.driverId))];

    const standings = participantIds.map(id => {
        const d = drivers.find(drv => drv.id === id) || { id, name: "Unknown" };
        const driverResults = results.filter(r => r.driverId === id);

        const points = driverResults.reduce((sum, r) => sum + r.points, 0);
        const wins = driverResults.filter(r => r.position === 1 && !r.dnf).length;

        // Use the teamId from the most recent result for this driver in this season
        const latestResult = driverResults[driverResults.length - 1];
        const teamId = latestResult ? latestResult.teamId : d.teamId;

        return {
            id,
            name: d.name,
            teamId,
            points,
            wins,
            imageUrl: d.imageUrl,
            nationality: d.nationality
        };
    });

    return standings.sort((a, b) => b.points - a.points || b.wins - a.wins);
}

/**
 * Computes Constructor Standings for a specific season
 */
export function calculateConstructorStandings(teams, results) {
    const standings = teams.map(t => {
        const teamResults = (results || []).filter(r => r.teamId === t.id);
        const points = teamResults.reduce((sum, r) => sum + r.points, 0);
        const wins = teamResults.filter(r => r.position === 1 && !r.dnf).length;
        return {
            id: t.id,
            name: t.name,
            points,
            wins,
        };
    });

    return standings.sort((a, b) => b.points - a.points || b.wins - a.wins);
}
