const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Function to parse .env.local manually
function getEnv(key) {
    try {
        const envPath = path.join(__dirname, "..", ".env.local");
        const envContent = fs.readFileSync(envPath, "utf8");
        const lines = envContent.split(/\r?\n/); // Handle both \n and \r\n
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith(`${key}=`)) {
                return trimmedLine.substring(key.length + 1).trim();
            }
        }
    } catch (e) {
        console.error("Error reading .env.local:", e.message);
    }
    return null;
}

const MONGODB_URI = getEnv("MONGODB_URI");

if (!MONGODB_URI) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
}

// Minimal User Schema for seeding
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully.");

        // Clean existing test users (optional, but good for idempotency)
        await User.deleteMany({ email: { $in: ["admin@f1.com", "user@f1.com"] } });

        const adminPassword = await bcrypt.hash("Admin123", 12);
        const userPassword = await bcrypt.hash("User123", 12);

        const users = [
            {
                name: "System Admin",
                email: "admin@f1.com",
                password: adminPassword,
                role: "admin"
            },
            {
                name: "Standard Viewer",
                email: "user@f1.com",
                password: userPassword,
                role: "user"
            }
        ];

        await User.insertMany(users);
        console.log("Successfully seeded users:");
        console.log("Admin: admin@f1.com / Admin123");
        console.log("User:  user@f1.com / User123");

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
