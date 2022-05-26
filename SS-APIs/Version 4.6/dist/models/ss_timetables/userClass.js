"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const classSchema = new mongoose_1.Schema({
    classNo: {
        required: true,
        type: String,
    },
    program: {
        required: true,
        type: String,
        minlength: 4,
        maxlength: 4,
    },
    timetable: {
        type: mongoose_1.Types.ObjectId,
        required: false,
    },
    defaultColor: {
        type: String,
        required: true,
    },
    primaryClassOf: [mongoose_1.Types.ObjectId],
}, { timestamps: true });
const db = mongoose_1.connection.useDb("ss_timetables");
exports.default = db.model("userClass", classSchema);
