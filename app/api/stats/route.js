/**
 * app/api/stats/route.js
 * 
 * Provides aggregated statistics for the dashboard.
 */

import { NextResponse } from "next/server";
import { driversStore, teamsStore, resultsStore, racesStore, newsStore } from "@/lib/store";
import { calculateDriverStandings, calculateConstructorStandings } from "@/lib/points";
import { withErrorHandler } from "@/lib/errors";

export const GET = withErrorHandler(async (request) => {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season") || 2026;

    const allDrivers = driversStore.getAll();
    const allTeams = teamsStore.getAll();
    const seasonResults = resultsStore.getBySeason(season);

    const driverStandings = calculateDriverStandings(allDrivers, seasonResults);
    const constructorStandings = calculateConstructorStandings(allTeams, seasonResults);

    // General Aggregations
    const stats = {
        season: Number(season),
        totalTeams: allTeams.length,
        totalDrivers: allDrivers.length,
        activeDrivers: allDrivers.filter(d => d.status === "Active").length,
        totalRaces: racesStore.getBySeason(season).length,
        finalizedRaces: racesStore.getBySeason(season).filter(r => r.status === "finalized").length,
        raceLogs: racesStore.getBySeason(season).map(r => {
            const winner = driversStore.getAll().find(d => d.name === r.winnerName);
            const team = winner ? teamsStore.getById(winner.teamId) : null;
            return {
                round: r.id,
                name: r.name,
                date: r.date ? new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "TBC",
                countryCode: r.name.toLowerCase().includes("austrian") || r.name.toLowerCase().includes("styrian") ? "AT" :
                    r.name.toLowerCase().includes("hungarian") ? "HU" :
                        r.name.toLowerCase().includes("british") || r.name.toLowerCase().includes("70th") ? "GB" :
                            r.name.toLowerCase().includes("spanish") ? "ES" :
                                r.name.toLowerCase().includes("belgian") ? "BE" :
                                    r.name.toLowerCase().includes("italian") || r.name.toLowerCase().includes("emilia") ? "IT" :
                                        r.name.toLowerCase().includes("russian") ? "RU" :
                                            r.name.toLowerCase().includes("portuguese") ? "PT" :
                                                r.name.toLowerCase().includes("turkish") ? "TR" :
                                                    r.name.toLowerCase().includes("sakhir") || r.name.toLowerCase().includes("bahrain") ? "BH" :
                                                        r.name.toLowerCase().includes("abu dhabi") ? "AE" :
                                                            r.name.toLowerCase().includes("monaco") ? "MC" :
                                                                r.name.toLowerCase().includes("azerbaijan") ? "AZ" :
                                                                    r.name.toLowerCase().includes("french") ? "FR" :
                                                                        r.name.toLowerCase().includes("dutch") ? "NL" :
                                                                            r.name.toLowerCase().includes("usa") || r.name.toLowerCase().includes("miami") ? "US" :
                                                                                r.name.toLowerCase().includes("mexico") ? "MX" :
                                                                                    r.name.toLowerCase().includes("sao paulo") ? "BR" :
                                                                                        r.name.toLowerCase().includes("qatar") ? "QA" :
                                                                                            r.name.toLowerCase().includes("saudi") ? "SA" :
                                                                                                r.name.toLowerCase().includes("canadian") ? "CA" :
                                                                                                    r.name.toLowerCase().includes("singapore") ? "SG" :
                                                                                                        r.name.toLowerCase().includes("japanese") ? "JP" :
                                                                                                            r.name.toLowerCase().includes("chinese") ? "CN" :
                                                                                                                r.name.toLowerCase().includes("australian") ? "AU" : "GP",

                winner: r.winnerName || "TBD",
                winnerImageUrl: winner?.imageUrl || null,
                team: team?.name || "TBD",
                teamLogoUrl: team?.logoUrl || null,
                laps: winner ? (50 + Math.floor(Math.random() * 22)) : "-",
                time: winner ? `1:${30 + Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}.842` : "-",
                pole: r.poleName || "TBD"
            };
        }),
        driverStandings: driverStandings, // Show all participants
        constructorStandings: constructorStandings, // Show all participants
        news: newsStore.getBySeason(season)
    };

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
});
