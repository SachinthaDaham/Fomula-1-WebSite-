const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

function getEnv(key) {
    try {
        const envPath = path.join(__dirname, "..", ".env.local");
        const envContent = fs.readFileSync(envPath, "utf8");
        const lines = envContent.split(/\r?\n/);
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith(`${key}=`)) {
                return trimmedLine.substring(key.length + 1).trim();
            }
        }
    } catch (e) { }
    return null;
}

const MONGODB_URI = getEnv("MONGODB_URI");

const UserSchema = new mongoose.Schema({
    email: String,
    role: String
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function promote() {
    try {
        await mongoose.connect(MONGODB_URI);
        const email = process.argv[2];
        if (!email) {
            console.log("Usage: node scripts/promoteUser.js <email>");
            process.exit(1);
        }

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { role: "admin" },
            { new: true }
        );

        if (user) {
            console.log(`SUCCESS: ${email} is now an ADMIN.`);
            console.log("User data:", JSON.stringify(user, null, 2));
        } else {
            console.log(`ERROR: User with email ${email} not found.`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Promotion failed:", error);
        process.exit(1);
    }
}

promote();
