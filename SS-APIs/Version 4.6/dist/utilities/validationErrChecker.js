"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const fileHelper_1 = require("./fileHelper");
const newError_1 = __importDefault(require("./newError"));
const validationErrCheck = (req) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty())
        return;
    // console.log(req.file, req.file.path.replace("\\", "/"));
    if (req.file) {
        (0, fileHelper_1.deleteFile)(req.file.path);
    }
    (0, newError_1.default)(422, `${errors.array()[0].msg.split("|")[0]}|${errors.array()[0].msg.split("|")[1]}`, "validation", errors.array()[0].param);
};
exports.default = validationErrCheck;
