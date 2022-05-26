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
exports.editConfig = exports.editPassword = exports.editAccount = exports.changeAvatar = exports.getUserData = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newError_1 = __importDefault(require("../utilities/newError"));
const fileHelper_1 = require("../utilities/fileHelper");
const user_1 = __importDefault(require("../models/authentication/user"));
const validationErrChecker_1 = __importDefault(require("../utilities/validationErrChecker"));
let maxFileSize = 8 * 1000 * 1000;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, validationErrChecker_1.default)(req);
        const email = req.body.email;
        const password = req.body.pass;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const color = req.body.primaryColor;
        let avatarPath;
        let isDefault;
        if (!req.file) {
            avatarPath = "images/default.png";
            isDefault = true;
        }
        else {
            avatarPath = req.file.path.replace("\\", "/");
            isDefault = false;
        }
        if (req.file) {
            if (((_a = req.file) === null || _a === void 0 ? void 0 : _a.size) > maxFileSize) {
                (0, fileHelper_1.deleteFile)(req.file.path);
                return (0, newError_1.default)(422, "Profile Picture too big (max 8MB)", "validation", "picture");
            }
        }
        if (!email || !password || !firstName || !lastName) {
            if (!isDefault)
                (0, fileHelper_1.deleteFile)(avatarPath);
            return (0, newError_1.default)(400, "Not All Fields Were Filled|All fields are required to create an account", "validation");
        }
        const user = yield user_1.default.findOne({ email: email });
        if (user) {
            (0, fileHelper_1.deleteFile)(avatarPath);
            return (0, newError_1.default)(409, "Existing Email|This email is already registered to a SS Account. Report to SS Developers if you are sure that the following email is your's", "user");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = new user_1.default({
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword,
            email: email,
            avatar: avatarPath,
            preferredColor: color,
        });
        const result = yield newUser.save();
        res.status(201).json({
            message: "Successfully Created an account.",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validationErrChecker_1.default)(req);
        const email = req.body.email;
        const password = req.body.pass;
        const user = yield user_1.default.findOne({ email: email });
        if (!user)
            return (0, newError_1.default)(404, "User Not Found|Doesn't seem like this email is registered to a SS Account", "user");
        const isCorrectPassword = yield bcryptjs_1.default.compare(password, user.password);
        console.log(isCorrectPassword);
        if (!isCorrectPassword) {
            return (0, newError_1.default)(401, "Incorrect Password|Enter the correct password to login", "user");
        }
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            userId: user._id,
        }, process.env.JWT_KEY);
        res.status(200).json({
            token: token,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const getUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validationErrChecker_1.default)(req);
        const userId = req.userId;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.", "user");
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            img: user.avatar,
            color: user.preferredColor,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserData = getUserData;
const changeAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const userId = req.userId;
    const newAvatarPath = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path.replace("\\", "/");
    if (!newAvatarPath)
        return (0, newError_1.default)(400, "Attachment not found.", "validation");
    const user = yield user_1.default.findById(userId);
    if (!user) {
        (0, fileHelper_1.deleteFile)(newAvatarPath);
        return (0, newError_1.default)(404, "User not found.", "user");
    }
    const isDefault = user.avatar === "images/default.png";
    if (req.file) {
        if (((_c = req.file) === null || _c === void 0 ? void 0 : _c.size) > maxFileSize) {
            (0, fileHelper_1.deleteFile)(req.file.path);
            return (0, newError_1.default)(422, "Profile Picture too big (max 8MB)", "validation", "picture");
        }
    }
    if (!isDefault)
        (0, fileHelper_1.deleteFile)(user.avatar);
    user.avatar = newAvatarPath;
    const result = yield user.save();
    res.status(200).json({
        message: "Successfully Changed User's Profile Picture",
        newAvatar: result.avatar,
    });
});
exports.changeAvatar = changeAvatar;
const editAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const color = req.body.color;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found|This token seems to be invalid so nothing will be changed.", "user");
        if (firstName.length < 2)
            return (0, newError_1.default)(404, "Invalid First Name|First name must be at least 2 letters long.", "validation", "firstName");
        if (lastName.length < 2)
            return (0, newError_1.default)(404, "Invalid Last Name|Last name must be at least 2 letters long ", "user", "lastName");
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (color)
            user.preferredColor = color;
        const result = yield user.save();
        res.status(201).json({
            message: "Change successfully.",
            curInfo: {
                firstName: result.firstName,
                lastName: result.lastName,
                newColor: result.preferredColor,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editAccount = editAccount;
const editPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validationErrChecker_1.default)(req);
    const userId = req.userId;
    const newPassword = req.body.newPassword;
    const ConfirmNewPassword = req.body.confirmNewPassword;
    const password = req.body.password;
    try {
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found|This token seems to be invalid so the password will not be changed.", "user");
        if (newPassword !== ConfirmNewPassword) {
            return (0, newError_1.default)(422, "Confirmation Password Not Matching|The confirmation password must be the same as the new password to change your password.", "user");
        }
        const isCorrectPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!isCorrectPassword)
            return (0, newError_1.default)(403, "Old Password Incorrect|To change your password you need to enter your old password correctly.", "user");
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 12);
        user.password = hashedNewPassword;
        const result = yield user.save();
        res.status(201).json({
            modal: true,
            header: "Password Changed",
            message: `Successfully Changed The Password. Your new password is ${result.password}`,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.editPassword = editPassword;
const editConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validationErrChecker_1.default)(req);
        const userId = req.userId;
        const dateTime = req.body.dateTime;
        const language = req.body.language;
        const showCovid = req.body.showCovid;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.", "user");
        if (dateTime)
            user.preferredConfig.dateTime = dateTime;
        if (language)
            user.preferredConfig.language = language;
        if (showCovid)
            user.preferredConfig.showCovid = showCovid;
        const result = yield user.save();
        res.status(201).json({
            newConfig: result.preferredConfig,
            message: "Successfully Changed The Config.",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.editConfig = editConfig;
