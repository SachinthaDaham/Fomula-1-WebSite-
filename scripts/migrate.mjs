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
        const drivers = driversStore.getAll();
        await Driver.deleteMany({});
        await Driver.insertMany(drivers);
        console.log(`Migrated ${drivers.length} drivers.`);

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
