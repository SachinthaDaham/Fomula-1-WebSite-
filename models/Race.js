import mongoose from "mongoose";

const RaceSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        round: { type: Number, required: true },
        name: { type: String, required: true },
        circuit: { type: String },
        date: { type: String },
        season: { type: Number, required: true },
        winnerName: { type: String },
        poleName: { type: String },
        status: { type: String, enum: ["provisional", "finalized"], default: "provisional" }
    },
    { timestamps: true }
);

const Race = mongoose.models.Race || mongoose.model("Race", RaceSchema);
export default Race;
