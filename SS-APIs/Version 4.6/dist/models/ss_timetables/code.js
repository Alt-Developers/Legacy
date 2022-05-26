"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const codeSchema = new mongoose_1.Schema({
    programCode: {
        type: String,
        minlength: 4,
        maxlength: 4,
        required: true,
    },
    programName: {
        type: String,
        required: true,
    },
    classCode: {
        EN: {
            type: Object,
        },
        TH: {
            type: Object,
        },
    },
});
const db = mongoose_1.connection.useDb("ss_timetables");
exports.default = db.model("code", codeSchema);
