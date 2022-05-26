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
const expensesController = __importStar(require("../controllers/expenses"));
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post("/addTransaction", isAuth_1.default, [
    (0, express_validator_1.body)("amount", "This filed [amount] is required to be filled and must be a number")
        .isNumeric()
        .not()
        .isEmpty(),
    (0, express_validator_1.body)("name", "This filed [Name] must be filled").not().isEmpty(),
], expensesController.addTransaction);
router.get("/getTransactions", isAuth_1.default, expensesController.getTransactions);
router.delete("/deleteTransaction/:transactionId", isAuth_1.default, expensesController.deleteTransaction);
exports.default = router;
