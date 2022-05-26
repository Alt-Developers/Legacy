"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const expensesSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    detail: {
        type: String,
        required: false,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, { timestamps: true });
const db = mongoose_1.connection.useDb("expenses");
exports.default = db.model("Expenses", expensesSchema);
