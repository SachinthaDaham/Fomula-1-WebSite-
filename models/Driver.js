import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        number: { type: Number, required: true },
        teamId: { type: Number, required: true },
        nationality: { type: String, required: true },
        careerWins: { type: Number, default: 0 },
        championships: { type: Number, default: 0 },
        podiums: { type: Number, default: 0 },
        poles: { type: Number, default: 0 },
        fastestLaps: { type: Number, default: 0 },
        imageUrl: { type: String },
        coverImageUrl: { type: String },
        bio: { type: String },
        status: { type: String, enum: ["Active", "Retired", "Former"], default: "Active" },
        specs: {
            height: String,
            weight: String,
            blood: String,
            entry: String,
            favTrack: String
        },
        tacticalStyle: String,
        socials: {
            instagram: String,
            twitter: String,
            web: String
        }
    },
    { timestamps: true }
);

const Driver = mongoose.models.Driver || mongoose.model("Driver", DriverSchema);
export default Driver;
