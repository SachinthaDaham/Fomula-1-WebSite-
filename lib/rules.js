/**
 * lib/rules.js — F1 Business Rule Validators (Updated)
 */

import { AppError } from "./errors.js";

/** Max 2 ACTIVE drivers per team (excluding reserves) */
export function enforceMaxDriversPerTeam(allDrivers, teamId, excludeDriverId = null) {
    const teamActiveCount = allDrivers.filter(
        (d) => d.teamId === Number(teamId) && d.id !== Number(excludeDriverId) && d.status === "Active"
    ).length;

    if (teamActiveCount >= 2) {
        throw new AppError(
            `Team already has 2 active drivers. Retire or change status to Reserve before adding a new main driver.`,
            409
        );
    }
}

export function enforceDriverIsActive(driver) {
    if (driver.status === "Retired") {
        throw new AppError(`Driver "${driver.name}" is retired and cannot race.`, 422);
    }
}

export function enforceFastestLapRule(fastestLap, position, dnf) {
    if (fastestLap && (dnf || position > 10)) {
        throw new AppError(`Fastest lap bonus only for top 10 finishers.`, 422);
    }
}

export function enforceRaceNotFinalized(race) {
    if (race.status === "finalized") {
        throw new AppError(`Race "${race.name}" results are immutable.`, 409);
    }
}

export function enforceNoDuplicateDriverInRace(raceResults, driverId) {
    if (raceResults.some((r) => r.driverId === Number(driverId))) {
        throw new AppError(`Driver is already entered in this race.`, 409);
    }
}

export function enforceUniquePosition(raceResults, position, dnf) {
    if (dnf) return;
    if (raceResults.some((r) => !r.dnf && r.position === Number(position))) {
        throw new AppError(`Position ${position} is already occupied.`, 409);
    }
}

export function enforceOneFastestLap(raceResults, fastestLap) {
    if (fastestLap && raceResults.some((r) => r.fastestLap)) {
        throw new AppError(`Fastest lap already assigned.`, 409);
    }
}
