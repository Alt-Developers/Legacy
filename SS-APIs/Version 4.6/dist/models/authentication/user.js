"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    preferredColor: {
        type: String,
        required: true,
    },
    DOB: Date,
    system13: [mongoose_1.Types.ObjectId],
    expenses: [mongoose_1.Types.ObjectId],
    timetables: {
        primaryClass: mongoose_1.Types.ObjectId,
        starred: [mongoose_1.Types.ObjectId],
        created: [mongoose_1.Types.ObjectId],
    },
    avatar: {
        type: String,
        required: true,
    },
    preferredConfig: {
        language: String,
        dateTime: String,
        showCovid: String,
    },
}, { timestamps: true });
const db = mongoose_1.connection.useDb("ss_Account");
exports.default = db.model("User", userSchema);
