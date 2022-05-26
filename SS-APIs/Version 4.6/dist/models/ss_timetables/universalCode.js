"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UniversalCodeSchema = new mongoose_1.Schema({
    universalCodes: {
        EN: {
            type: Object,
        },
        TH: {
            type: Object,
        },
    },
}, { timestamps: true });
const db = mongoose_1.connection.useDb("ss_timetables");
exports.default = db.model("UniversalCode", UniversalCodeSchema);
