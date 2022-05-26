"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timetableSchema = new mongoose_1.Schema({
    classNo: {
        required: true,
        type: String,
    },
    defaultColor: {
        required: true,
        type: String,
    },
    classId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    program: {
        required: true,
        type: String,
        minlength: 4,
        maxlength: 4,
    },
    timetableContent: {
        monday: [
            {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 3,
            },
        ],
        tuesday: [
            {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 3,
            },
        ],
        wednesday: [
            {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 3,
            },
        ],
        thursday: [
            {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 3,
            },
        ],
        friday: [
            {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 3,
            },
        ],
    },
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    updated: {
        updatedBy: {
            type: mongoose_1.Types.ObjectId,
        },
        updatedAt: {
            type: Date,
        },
    },
}, { timestamps: true });
const db = mongoose_1.connection.useDb("ss_timetables");
exports.default = db.model("Timetable", timetableSchema);
