"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPlayer = exports.deletePlayer = exports.addPlayer = exports.getRealNameList = exports.getPlayersList = void 0;
const player_1 = __importDefault(require("../models/system13/player"));
const addCount_1 = __importDefault(require("../utilities/addCount"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/authentication/user"));
const newError_1 = __importDefault(require("../utilities/newError"));
const getPlayersList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        const players = yield player_1.default.find({ createdBy: user._id }).select("codeName score -_id");
        const playersList = {};
        players.forEach((player) => {
            const key = player.codeName;
            playersList[key] = player.score;
        });
        res.json({
            playersList,
        });
    }
    catch (err) {
        next(err);
    }
    (0, addCount_1.default)("getPlayersList");
});
exports.getPlayersList = getPlayersList;
const getRealNameList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        const players = yield player_1.default.find({ createdBy: userId }).select("codeName realName -_id");
        const playersList = {};
        players.forEach((player) => {
            const key = player.codeName;
            playersList[key] = player.realName;
        });
        res.json({
            playersList,
        });
    }
    catch (err) {
        next(err);
    }
    (0, addCount_1.default)("getRealNameList");
});
exports.getRealNameList = getRealNameList;
const addPlayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.userId;
    const realName = req.body.realName;
    const codeName = req.body.codeName;
    const score = req.body.score;
    const errors = (0, express_validator_1.validationResult)(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.array()[0].msg,
            });
        }
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        const player = yield player_1.default.findOne({ codeName: codeName });
        if (player) {
            if ((player === null || player === void 0 ? void 0 : player.createdBy.toString()) === user._id.toString()) {
                return (0, newError_1.default)(409, "This player codename already existed on this account.");
            }
        }
        const newPlayer = new player_1.default({
            realName: realName,
            codeName: codeName,
            createdBy: user._id,
            score: score,
        });
        const result = yield newPlayer.save();
        (_a = user.system13) === null || _a === void 0 ? void 0 : _a.push(result._id);
        user.save();
        res.status(201).json({
            message: "Successfully created a players",
            realName: realName,
            codeName: codeName,
            createdBy: user._id,
            score: score,
        });
        (0, addCount_1.default)("addPlayer");
    }
    catch (err) {
        next(err);
    }
});
exports.addPlayer = addPlayer;
const deletePlayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = req.userId;
        const playerId = req.params.playerId;
        const player = yield player_1.default.findById(playerId);
        const user = yield user_1.default.findById(userId);
        if (!player || !user)
            return (0, newError_1.default)(404, "User / Player not found");
        if (player.createdBy.toString() !== user._id.toString())
            return (0, newError_1.default)(403, "Not Authorized / Forbidden");
        const filtered = (_b = user.system13) === null || _b === void 0 ? void 0 : _b.filter((id) => id.toString() !== playerId.toString());
        user.system13 = filtered;
        user.save();
        const result = yield player_1.default.findByIdAndDelete(playerId);
        if (result) {
            res.status(200).json({
                message: "Successfully deleted a product",
            });
        }
        else
            return (0, newError_1.default)(500, "Something went wrong.");
        (0, addCount_1.default)("deletePlayer");
    }
    catch (err) {
        next(err);
    }
});
exports.deletePlayer = deletePlayer;
const getUserPlayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        const populatedUser = yield user_1.default.findById(userId).populate("system13", "", player_1.default);
        const playersList = populatedUser.system13;
        const userPlayer = [];
        playersList.forEach((cur) => {
            userPlayer.push({
                _id: cur._id,
                realName: cur.realName,
                codeName: cur.codeName,
                score: cur.score,
            });
        });
        res.json({
            userPlayer,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserPlayer = getUserPlayer;
