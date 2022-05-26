"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newError_1 = __importDefault(require("./newError"));
const identifyCurrentClassIndex = (curTime) => {
    let thisClassIndex;
    if (curTime < 800)
        thisClassIndex = 7;
    if (curTime >= 800 && curTime < 830)
        thisClassIndex = -1;
    if (curTime >= 830 && curTime < 920)
        thisClassIndex = 0;
    if (curTime >= 920 && curTime < 1010)
        thisClassIndex = 1;
    if (curTime >= 1010 && curTime < 1100)
        thisClassIndex = 2;
    if (curTime >= 1100 && curTime < 1140)
        thisClassIndex = 3;
    if (curTime >= 1140 && curTime < 1240)
        thisClassIndex = 3;
    if (curTime >= 1240 && curTime < 1330)
        thisClassIndex = 4;
    if (curTime >= 1330 && curTime < 1420)
        thisClassIndex = 5;
    if (curTime >= 1420 && curTime < 1500)
        thisClassIndex = 6;
    if (curTime >= 1500)
        thisClassIndex = 7;
    if (!thisClassIndex && thisClassIndex !== 0)
        return (0, newError_1.default)(500, "an error has occurred.");
    return thisClassIndex;
};
exports.default = identifyCurrentClassIndex;
