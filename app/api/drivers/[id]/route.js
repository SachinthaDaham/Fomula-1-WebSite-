/**
 * app/api/drivers/[id]/route.js
 *
 * GET    /api/drivers/:id  — Get a single driver
 * PUT    /api/drivers/:id  — Update driver (status, team, number, etc.)
 * DELETE /api/drivers/:id  — Delete driver
 */

import { NextResponse } from "next/server";
import { driversStore, teamsStore } from "@/lib/store";
import { AppError, withErrorHandler } from "@/lib/errors";
import { enforceMaxDriversPerTeam } from "@/lib/rules";

function parseId(raw) {
    const id = parseInt(raw, 10);
    if (isNaN(id) || id <= 0) throw new AppError("ID must be a positive integer.", 400);
    return id;
}

// ─── GET /api/drivers/:id ─────────────────────────────────────────────────────

export const GET = withErrorHandler(async (_, { params }) => {
    const id = parseId(params.id);
    const driver = driversStore.getById(id);
    if (!driver) throw new AppError(`Driver with ID ${id} not found.`, 404);

    const team = teamsStore.getById(driver.teamId);
    return NextResponse.json(
        { success: true, data: { ...driver, teamName: team?.name ?? "Unknown" } },
        { status: 200 }
    );
});

// ─── PUT /api/drivers/:id ─────────────────────────────────────────────────────

export const PUT = withErrorHandler(async (request, { params }) => {
    const id = parseId(params.id);
    const driver = driversStore.getById(id);
    if (!driver) throw new AppError(`Driver with ID ${id} not found.`, 404);

    const body = await request.json().catch(() => { throw new AppError("Invalid JSON body.", 400); });

    if (Object.keys(body).length === 0) {
        throw new AppError("Provide at least one field to update.", 400);
    }

    // Validate status if provided
    if (body.status !== undefined && !["active", "retired"].includes(body.status)) {
        throw new AppError("'status' must be either 'active' or 'retired'.", 400);
    }

    // If changing team, enforce max-2 rule on the new team
    if (body.teamId !== undefined) {
        const newTeamId = Number(body.teamId);
        const newTeam = teamsStore.getById(newTeamId);
        if (!newTeam) throw new AppError(`Team with ID ${newTeamId} not found.`, 404);

        // Exclude current driver from the count (they're moving teams)
        enforceMaxDriversPerTeam(driversStore.getAll(), newTeamId, id);
    }

    // Ensure driver number uniqueness (excluding self)
    if (body.number !== undefined) {
        const numberTaken = driversStore.getAll().find(
            (d) => d.id !== id && d.number === Number(body.number)
        );
        if (numberTaken) {
            throw new AppError(`Driver number #${body.number} is already taken by ${numberTaken.name}.`, 409);
        }
    }

    const updated = driversStore.update(id, body);
    return NextResponse.json({ success: true, message: "Driver updated.", data: updated }, { status: 200 });
});

// ─── DELETE /api/drivers/:id ──────────────────────────────────────────────────

export const DELETE = withErrorHandler(async (_, { params }) => {
    const id = parseId(params.id);
    const driver = driversStore.getById(id);
    if (!driver) throw new AppError(`Driver with ID ${id} not found.`, 404);

    driversStore.remove(id);
    return NextResponse.json(
        { success: true, message: `Driver "${driver.name}" removed.` },
        { status: 200 }
    );
});
