import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true }, // Legacy numeric ID for consistency with store
        name: { type: String, required: [true, "Team name is required"], trim: true },
        fullName: { type: String, trim: true },
        teamPrincipal: { type: String, trim: true },
        budgetCap: { type: Number, min: [0, "Budget cannot be negative"] },
        nationality: { type: String, trim: true },
        logoUrl: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, "Must be a valid HTTP/HTTPS URL"]
        },
        carImageUrl: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, "Must be a valid HTTP/HTTPS URL"]
        },
        history: { type: String, trim: true },
        achievements: [{ type: String, trim: true }],
        improvements: [{ type: String, trim: true }],
        driverComments: { type: String, trim: true },
        powerunit: { type: String, trim: true },
        personnel: {
            type: Map,
            of: new mongoose.Schema({
                principal: { type: String, trim: true },
                engineers: [{ type: String, trim: true }],
                reserves: [{ type: String, trim: true }]
            }, { _id: false })
        }
    },
    { timestamps: true }
);

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default Team;
