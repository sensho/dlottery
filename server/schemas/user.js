import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
    {
        wallet_id: {
            type: String,
            required: true
        },
        wallet_name: {
            type: String,
            enum: ["METAMASK", "WALLET_CONNECT"],
            default: "METAMASK"
        },
        active: {
            type: Boolean,
            default: true
        },
        points: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const walletModel = mongoose.model("wallet", walletSchema);
export { walletModel };
