"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const timetablesController = __importStar(require("../controllers/timetables"));
const data_1 = require("../models/ss_timetables/data");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = (0, express_1.Router)();
const programList = Object.keys(data_1.programTypes);
router.get("/getUser", isAuth_1.default, timetablesController.getUser);
router.get("/getTimetable", isAuth_1.default, timetablesController.getTimetable);
router.get("/getGlance", timetablesController.getGlance);
router.get("/getCode", timetablesController.getCode);
router.get("/socketRefresh", timetablesController.socketRefresh);
router.get("/getNotUserClass", isAuth_1.default, timetablesController.getNotUserClass);
router.post("/registerUserClass", isAuth_1.default, [
    (0, express_validator_1.body)("classNo", "Must include classNo.").notEmpty(),
    (0, express_validator_1.body)("program", "Invalid Program.")
        .notEmpty()
        .custom((value, { req }) => {
        let validationErr = false;
        if (!programList.includes(value)) {
            validationErr = true;
        }
        if (!validationErr) {
            return Promise.resolve();
        }
        return Promise.reject("Program does not exist. there's bell, english, chinese, mathScience, digitalTechnology and gifted");
    }),
], timetablesController.registerUserClass);
router.post("/createTimetable", isAuth_1.default, [
    (0, express_validator_1.body)("classNo", "ClassNo must not be empty.").notEmpty(),
    (0, express_validator_1.body)("program")
        .notEmpty()
        .withMessage("Program must not be empty.")
        .custom((value) => {
        if (!programList.includes(value)) {
            return Promise.reject(`Program does not exist. please select between ${programList.flat()}`);
        }
        else
            return Promise.resolve();
    }),
    (0, express_validator_1.body)("color", "You must fill the color and it must be HEX color")
        .notEmpty()
        .isHexColor(),
    (0, express_validator_1.body)("content", "Content must not be empty.").notEmpty(),
], timetablesController.createTimetable);
router.post("/removeRegisteredClass", isAuth_1.default, [
    (0, express_validator_1.body)("classNo", "ClassNo must be filled.").notEmpty(),
    (0, express_validator_1.body)("program", "program must be 4 letter long.")
        .notEmpty()
        .toUpperCase()
        .isLength({ min: 4, max: 4 }),
], timetablesController.removeClassFromUser);
// router.post("/newProgram", timetablesController.newProgram);
// router.post("/newUniversalClass", timetablesController.newUniversalClass);
exports.default = router;
