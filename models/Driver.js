import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true }, // Legacy numeric ID
        name: { type: String, required: [true, "Driver name is required"], trim: true },
        number: { type: Number, required: [true, "Driver number is required"], min: [0, "Number cannot be negative"] },
        teamId: { type: Number, required: [true, "Team ID is required"] },
        nationality: { type: String, required: [true, "Nationality is required"], trim: true },
        careerWins: { type: Number, default: 0, min: [0, "Cannot be negative"] },
        championships: { type: Number, default: 0, min: [0, "Cannot be negative"] },
        podiums: { type: Number, default: 0, min: [0, "Cannot be negative"] },
        poles: { type: Number, default: 0, min: [0, "Cannot be negative"] },
        fastestLaps: { type: Number, default: 0, min: [0, "Cannot be negative"] },
        imageUrl: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, "Must be a valid HTTP/HTTPS URL"]
        },
        coverImageUrl: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, "Must be a valid HTTP/HTTPS URL"]
        },
        bio: { type: String, trim: true },
        status: { type: String, enum: ["Active", "Retired", "Former", "Third", "Reserve"], default: "Active" },
        specs: {
            height: { type: String, trim: true },
            weight: { type: String, trim: true },
            blood: { type: String, trim: true },
            entry: { type: String, trim: true },
            favTrack: { type: String, trim: true }
        },
        careerPoints: [
            {
                year: { type: Number, min: [1950, "Invalid F1 Year"] },
                note: { type: String, trim: true }
            }
        ],
        tacticalStyle: { type: String, trim: true },
        socials: {
            instagram: { type: String, trim: true },
            twitter: { type: String, trim: true },
            web: {
                type: String,
                trim: true,
                match: [/^https?:\/\/.+/, "Must be a valid HTTP/HTTPS URL"]
            }
        }
    },
    { timestamps: true }
);

const Driver = mongoose.models.Driver || mongoose.model("Driver", DriverSchema);
export default Driver;
