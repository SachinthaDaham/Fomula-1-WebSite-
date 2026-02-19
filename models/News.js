import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true }, // Legacy numeric ID
        title: { type: String, required: true },
        summary: { type: String, required: true },
        category: { type: String, default: "Analysis" },
        teamId: { type: Number },
        season: { type: Number },
        imageUrl: { type: String },
        date: { type: Date, default: Date.now },
        author: { type: String, default: "PADDOCK_INTEL_V1" }
    },
    { timestamps: true }
);

const News = mongoose.models.News || mongoose.model("News", NewsSchema);
export default News;
