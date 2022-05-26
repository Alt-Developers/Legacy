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
const authController = __importStar(require("../controllers/auth"));
const express_validator_1 = require("express-validator");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = (0, express_1.Router)();
router.post("/login", [
    (0, express_validator_1.body)("email", "Invalid Email|Please input a valid email")
        .notEmpty()
        .toLowerCase()
        .isEmail(),
    (0, express_validator_1.body)("pass", "Password Required|Password field is empty").notEmpty(),
], authController.login);
router.post("/signup", [
    (0, express_validator_1.body)("email").toLowerCase().isEmail(),
    (0, express_validator_1.body)("pass", "Unsecure Password|A secure password should have at least eight characters one letter and one number.").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "i"),
    (0, express_validator_1.body)("firstName", "Invalid First Name|First name must be longer than 2 letters and shorter than 30 letters")
        .notEmpty()
        .isLength({ max: 30, min: 2 }),
    (0, express_validator_1.body)("lastName", "Invalid Last Name|Last name must be filled.").notEmpty(),
    (0, express_validator_1.body)("primaryColor", "Accent Color Required|An accent color is required to make an account").notEmpty(),
], authController.signup);
router.post("/updateUserProfilePicture", isAuth_1.default, authController.changeAvatar);
router.post("/updateUserInfo", isAuth_1.default, authController.editAccount);
router.post("/changePassword", [
    (0, express_validator_1.body)("newPassword", "Unsecure Password|A secure password should have at least eight characters one letter and one number.").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "i"),
], isAuth_1.default, authController.editPassword);
router.get("/getUserData", isAuth_1.default, authController.getUserData);
router.post("/editConfig", isAuth_1.default, [
    (0, express_validator_1.body)("showCovid", "COVID")
        .isString()
        .isLength({ min: 7, max: 7 })
        .custom((value) => {
        if (value !== "covShow" && value !== "covHide") {
            return Promise.reject("Option does not exist.");
        }
        else
            return Promise.resolve();
    }),
    (0, express_validator_1.body)("dateTime", "DATETIME")
        .isString()
        .isLength({ min: 3, max: 3 })
        .custom((value) => {
        if (value !== "24h" && value !== "12h") {
            return Promise.reject("Option does not exist.");
        }
        else
            return Promise.resolve();
    }),
    (0, express_validator_1.body)("language", "LANGUAGE").toUpperCase().isLength({ min: 2, max: 2 }),
], authController.editConfig);
exports.default = router;
