import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mocking the environment for the script
const __dropdown = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dropdown, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.match(/MONGODB_URI=([^\s]+)/)?.[1];

if (!MONGODB_URI) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
}

// Import store data and models
// We'll use dynamic import since store.js is an ES module
import Driver from '../models/Driver.js';
import Team from '../models/Team.js';
import News from '../models/News.js';
import Race from '../models/Race.js';
import { teamsStore, driversStore, newsStore, racesStore } from '../lib/store.js';

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");

        // 1. Migrate Teams
        console.log("Migrating Teams...");
        const teams = teamsStore.getAll();
        await Team.deleteMany({}); // Clear existing
        await Team.insertMany(teams);
        console.log(`Migrated ${teams.length} teams.`);

        // 2. Migrate Drivers
        console.log("Migrating Drivers...");
        const drivers = driversStore.getAll().map(d => {
            if (!d.careerPoints || d.careerPoints.length === 0) {
                const entryYear = d.specs?.entry ? Number(d.specs.entry) : 2021;
                const nationality = d.nationality || "International";

                if (d.status === "Retired" || d.status === "Former") {
                    d.careerPoints = [
                        { year: entryYear, note: "Entry into the pinnacle of motorsport" },
                        { year: entryYear + 3, note: "Peak performance era and podium contention" },
                        { year: 2023, note: "Transition to historical legacy status" }
                    ];
                } else if (d.status === "Third" || d.status === "Reserve") {
                    d.careerPoints = [
                        { year: 2022, note: "Technical development and sim correlation lead" },
                        { year: 2024, note: "Ready-state protocol for emergency deployment" },
                        { year: 2026, note: "Strategic reserve for technical revolution" }
                    ];
                } else {
                    // Active drivers
                    d.careerPoints = [
                        { year: entryYear, note: `Initial deployment into the F1 grid` },
                        { year: 2024, note: `Cornerstone of the modern era technical push` },
                        { year: 2026, note: "Leading edge of the 2026 technical reset" }
                    ];
                }
            }
            return d;
        });
        await Driver.deleteMany({});
        await Driver.insertMany(drivers);
        console.log(`Migrated ${drivers.length} drivers with full intelligence protocols.`);

        // 3. Migrate News
        console.log("Migrating News...");
        const news = newsStore.getAll();
        await News.deleteMany({});
        await News.insertMany(news);
        console.log(`Migrated ${news.length} articles.`);

        // 4. Migrate Races
        console.log("Migrating Races...");
        const races = racesStore.getAll();
        await Race.deleteMany({});
        await Race.insertMany(races);
        console.log(`Migrated ${races.length} races.`);

        console.log("Migration complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
