import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true }, // Legacy numeric ID for consistency with store
        name: { type: String, required: true },
        fullName: { type: String },
        teamPrincipal: { type: String },
        budgetCap: { type: Number },
        nationality: { type: String },
        logoUrl: { type: String },
        carImageUrl: { type: String },
        history: { type: String },
        achievements: [String],
        improvements: [String],
        driverComments: { type: String },
        powerunit: { type: String },
        personnel: {
            type: Map,
            of: new mongoose.Schema({
                principal: String,
                engineers: [String],
                reserves: [String]
            }, { _id: false })
        }
    },
    { timestamps: true }
);

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default Team;
