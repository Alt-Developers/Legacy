"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newError_1 = __importDefault(require("../utilities/newError"));
const dCrypt = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
        return (0, newError_1.default)(400, "Token not found.");
    req.authToken = req.get("Authorization").split(" ")[1];
    const token = req.get("Authorization").split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
    }
    catch (err) {
        if (err) {
            err.statusCode = 500;
            throw err;
        }
    }
    if (!decodedToken)
        return (0, newError_1.default)(401, "Not Authenticated.");
    req.userId = decodedToken.userId;
    next();
};
exports.default = dCrypt;
