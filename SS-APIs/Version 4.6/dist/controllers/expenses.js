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
exports.deleteTransaction = exports.getTransactions = exports.addTransaction = void 0;
const expenses_1 = __importDefault(require("../models/expenses/expenses"));
const user_1 = __importDefault(require("../models/authentication/user"));
const express_validator_1 = require("express-validator");
const newError_1 = __importDefault(require("../utilities/newError"));
const addTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const errMsg = `Validation Error: ${validationError.array()[0].msg}.`;
            return (0, newError_1.default)(422, errMsg);
        }
        const userId = req.userId;
        const amount = req.body.amount;
        const name = req.body.name;
        const detail = req.body.detail;
        let type = "income";
        if (amount < 0) {
            type = "expenses";
        }
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        let thisTransaction;
        if (!detail) {
            thisTransaction = new expenses_1.default({
                name: name,
                amount: amount,
                createdBy: userId,
                type: type,
            });
        }
        else if (detail) {
            thisTransaction = new expenses_1.default({
                name: name,
                amount: amount,
                createdBy: userId,
                detail: detail,
                type: type,
            });
        }
        yield (thisTransaction === null || thisTransaction === void 0 ? void 0 : thisTransaction.save());
        (_a = user.expenses) === null || _a === void 0 ? void 0 : _a.push(thisTransaction === null || thisTransaction === void 0 ? void 0 : thisTransaction._id);
        yield user.save();
        res.status(200).json({
            message: "Successfully Created a transaction.",
            transactionName: thisTransaction === null || thisTransaction === void 0 ? void 0 : thisTransaction.name,
            transaction: [
                thisTransaction === null || thisTransaction === void 0 ? void 0 : thisTransaction._id,
                thisTransaction === null || thisTransaction === void 0 ? void 0 : thisTransaction.name,
                thisTransaction === null || thisTransaction === void 0 ? void 0 : thisTransaction.amount,
                thisTransaction === null || thisTransaction === void 0 ? void 0 : thisTransaction.createdAt,
            ],
        });
    }
    catch (err) {
        next(err);
    }
});
exports.addTransaction = addTransaction;
const getTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const page = +req.params.page || 1;
    const perPage = +req.params.limit || 5;
    const transactions = [];
    const totalItems = yield expenses_1.default.find().countDocuments();
    const expenses = yield expenses_1.default.find({ createdBy: userId })
        .skip((+page - 1) * perPage)
        .limit(perPage);
    const lastPage = Math.round(totalItems / perPage);
    expenses.forEach((transaction) => {
        if (!transaction.detail) {
            transactions.push([
                transaction._id,
                transaction.name,
                transaction.amount,
                transaction.createdAt,
            ]);
        }
        if (transaction.detail) {
            transactions.push([
                transaction._id,
                transaction.name,
                transaction.amount,
                transaction.createdAt,
                transaction.detail,
            ]);
        }
    });
    res.status(200).json({
        transactions: transactions,
        allTransactions: totalItems,
        lastPage: lastPage,
        currentPage: page,
    });
});
exports.getTransactions = getTransactions;
const deleteTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // Delete the transaction by ID
    try {
        const transactionId = req.params.transactionId;
        const userId = req.userId;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "user not found.");
        const filtered = (_b = user.expenses) === null || _b === void 0 ? void 0 : _b.filter((cur) => {
            return cur.toString() !== transactionId.toString();
        });
        user.expenses = filtered;
        user.save();
        const transaction = yield expenses_1.default.findById(transactionId);
        if (!transaction)
            return (0, newError_1.default)(404, "Transaction not found.");
        if (transaction.createdBy.toString() !== userId.toString())
            return (0, newError_1.default)(403, "Not Authorized. / Forbidden.");
        const deletedTransaction = yield expenses_1.default.findByIdAndDelete(transactionId);
        res.json({
            message: "Deleted a transaction.",
            transactionName: deletedTransaction === null || deletedTransaction === void 0 ? void 0 : deletedTransaction.name,
            transactionId: deletedTransaction === null || deletedTransaction === void 0 ? void 0 : deletedTransaction._id,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteTransaction = deleteTransaction;
