import mongoose from "mongoose";
import { getRaffleId } from ".";

const raffleSchema = new mongoose.Schema(
    {
        host: {
            type: mongoose.Types.ObjectId,
            ref: "wallet",
            required: true
        },
        name: {
            type: String
        },
        participants: [{
            type: mongoose.Types.ObjectId,
            ref: "wallet",
        }],
        players_number: {
            type: Number,
            required: true
        },
        raffle_id: {
            type: String,
            default: function () {
                return Math.floor(Math.random() * 100000)
            },
            unique: true
        },
        winner: {
            type: mongoose.Types.ObjectId,
            ref: "wallet"
        },
        block_transaction_id: {
            type: String
        },
        amount: {
            type: Number,
            required: true
        },
        token: {
            type: String,
            default: 'POLYGON'
        },
        amount_collected: {
            type: Number,
            default: 0
        },
        finished: {
            type: Boolean,
            default: false
        },
        archived: {
            type: Boolean,
            default: false
        },
        blockHash: {
            type: String,
            default: undefined
        },
        seen: [{
            type: mongoose.Types.ObjectId,
            ref: "wallet",
        }]
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const raffleModel = mongoose.model("raffle", raffleSchema);
export { raffleModel };
