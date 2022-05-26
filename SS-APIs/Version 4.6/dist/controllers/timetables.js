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
exports.getGlance = exports.newUniversalClass = exports.socketRefresh = exports.getCode = exports.newProgram = exports.getTimetable = exports.createTimetable = exports.getUser = exports.getNotUserClass = exports.removeClassFromUser = exports.registerUserClass = void 0;
const timetable_1 = __importDefault(require("../models/ss_timetables/timetable"));
const user_1 = __importDefault(require("../models/authentication/user"));
const userClass_1 = __importDefault(require("../models/ss_timetables/userClass"));
const newError_1 = __importDefault(require("../utilities/newError"));
const validationErrChecker_1 = __importDefault(require("../utilities/validationErrChecker"));
const data_1 = require("../models/ss_timetables/data");
const code_1 = __importDefault(require("../models/ss_timetables/code"));
const luxon_1 = require("luxon");
const socket_1 = __importDefault(require("../socket"));
const universalCode_1 = __importDefault(require("../models/ss_timetables/universalCode"));
const identifyCurrentClass_1 = __importDefault(require("../utilities/identifyCurrentClass"));
// const timeCalculator = require("working-time-calculator");
let curTime;
let curDay;
let curWeekDay;
luxon_1.Settings.defaultZone = "utc+7";
exports.default = setInterval(() => {
    const now = luxon_1.DateTime.local();
    const day = now.weekday;
    const advanceTime = +`${now.hour}${(now.minute < 10 ? "0" : "") + now.minute}${(now.second < 10 ? "0" : "") + now.second}`;
    curTime = +`${now.hour}${(now.minute < 10 ? "0" : "") + now.minute}`;
    curWeekDay = day;
    if (day === 1)
        curDay = "monday";
    if (day === 2)
        curDay = "tuesday";
    if (day === 3)
        curDay = "wednesday";
    if (day === 4)
        curDay = "thursday";
    if (day === 5)
        curDay = "friday";
    if (day === 7 || day === 6)
        curDay = "weekend";
    if (advanceTime === 83000 ||
        advanceTime === 92000 ||
        advanceTime === 110000 ||
        advanceTime === 114000 ||
        advanceTime === 124000 ||
        advanceTime === 133000 ||
        advanceTime === 142000 ||
        advanceTime === 150000) {
        socket_1.default.getIO().emit("glance", {
            action: "refresh",
            currentTime: curTime,
        });
    }
    // console.log(curDay, curWeekDay, advanceTime);
}, 1000);
const registerUserClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        (0, validationErrChecker_1.default)(req);
        const userId = req.userId;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        const classNo = req.body.classNo;
        const program = req.body.program;
        const color = req.body.program;
        let isPrimary = req.body.isPrimary;
        if (isPrimary === "true")
            isPrimary = true;
        if (isPrimary === "false")
            isPrimary = false;
        let thisClass = yield userClass_1.default.findOne({
            classNo: classNo,
            program: program,
        });
        if (!thisClass) {
            const newClass = new userClass_1.default({
                classNo: classNo,
                program: program,
                defaultColor: color,
            });
            thisClass = yield newClass.save();
        }
        // if (!userTimetableId)
        //   return newError(404, "Class's timetable not yet existed");
        if (((_a = user.timetables) === null || _a === void 0 ? void 0 : _a.primaryClass) === thisClass._id)
            (0, newError_1.default)(409, "This class is already user's primary class.");
        if (isPrimary === true) {
            if ((_b = user.timetables) === null || _b === void 0 ? void 0 : _b.starred.includes(thisClass._id)) {
                const filtered = user.timetables.starred.filter((cur) => {
                    cur.toString() !== (thisClass === null || thisClass === void 0 ? void 0 : thisClass._id.toString());
                });
                user.timetables.starred = filtered;
            }
            user.timetables.primaryClass = thisClass._id;
        }
        else {
            if ((_c = user.timetables) === null || _c === void 0 ? void 0 : _c.starred.includes(thisClass._id))
                (0, newError_1.default)(409, "This class is already in user's starred class.");
            user.timetables.starred.push(thisClass._id);
        }
        const result = yield user.save();
        res.status(200).json({
            message: "Successfully Registered user's class.",
            userFirstName: user.firstName,
            setPrimary: isPrimary,
            classDetail: {
                classId: thisClass._id,
                classNo: thisClass.classNo,
                program: thisClass.program,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.registerUserClass = registerUserClass;
const removeClassFromUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        (0, validationErrChecker_1.default)(req);
        const userId = req.userId;
        const classNo = req.body.classNo;
        const program = req.body.program;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User Not found.");
        if (!user.timetables)
            return (0, newError_1.default)(400, "This account not migrated yet!");
        const thisClass = yield userClass_1.default.findOne({
            classNo: classNo,
            program: program,
        });
        if (!thisClass)
            return (0, newError_1.default)(404, "Class not existed.");
        const filtered = (_d = user.timetables) === null || _d === void 0 ? void 0 : _d.starred.filter((cur) => cur.toString() !== thisClass._id.toString());
        user.timetables.starred = filtered;
        const result = yield user.save();
        res.status(200).json({
            starredNow: user.timetables.starred,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.removeClassFromUser = removeClassFromUser;
const getNotUserClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        (0, validationErrChecker_1.default)(req);
        const userId = req.userId;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        const allClass = yield userClass_1.default.find();
        if (!allClass)
            return (0, newError_1.default)(500, "Something went wrong.");
        let filtered = allClass.filter((cur) => {
            var _a;
            return !((_a = user.timetables) === null || _a === void 0 ? void 0 : _a.starred.includes(cur._id));
        });
        if ((_e = user.timetables) === null || _e === void 0 ? void 0 : _e.primaryClass) {
            filtered = filtered.filter((cur) => {
                var _a;
                return cur._id.toString() !== ((_a = user.timetables) === null || _a === void 0 ? void 0 : _a.primaryClass.toString());
            });
        }
        const formattedData = [];
        filtered.forEach((cur) => {
            formattedData.push({
                className: `${cur.program === "ENPG" ? "EP" : "M"} ${cur.classNo}`,
                classNo: cur.classNo,
                program: cur.program,
            });
        });
        res.status(200).json({
            data: formattedData,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getNotUserClass = getNotUserClass;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h;
    try {
        const userId = req.userId;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        let primaryClass;
        const starredClasses = [];
        if (!((_f = user.timetables) === null || _f === void 0 ? void 0 : _f.primaryClass)) {
            return res.status(200).json({
                firstName: user.firstName,
                lastName: user.lastName,
                color: user.preferredColor,
                profilePicture: user.avatar,
                glance: {
                    currentClass: "AYC",
                    nextClass: "AYC",
                },
                config: {
                    dateTime: "24h",
                    showCovid: "covShow",
                    language: "EN",
                },
                primaryClass: false,
                starredClass: [],
            });
        }
        primaryClass = yield userClass_1.default.findById((_g = user.timetables) === null || _g === void 0 ? void 0 : _g.primaryClass);
        const starredClass = yield userClass_1.default.find({
            _id: (_h = user.timetables) === null || _h === void 0 ? void 0 : _h.starred,
        });
        starredClass.forEach((cur) => {
            starredClasses.push({
                className: `${cur.program === "ENPG" ? "EP" : "M"} ${cur.classNo}`,
                color: cur.defaultColor,
                classNo: cur.classNo,
                program: cur.program,
            });
        });
        let curClass;
        let nextClass;
        if (user.timetables.primaryClass) {
            if (curDay !== "weekend") {
                const userClass = yield userClass_1.default.findById(user.timetables.primaryClass);
                if (userClass === null || userClass === void 0 ? void 0 : userClass.timetable) {
                    const thisClassIndex = (0, identifyCurrentClass_1.default)(curTime);
                    const userTimetable = yield timetable_1.default.findById(userClass === null || userClass === void 0 ? void 0 : userClass.timetable);
                    // if (thisClassIndex === false) curClass = "BFS";
                    // curClass =
                    // userTimetable?.timetableContent[time.curDay][thisClassIndex];
                    if (thisClassIndex !== 6) {
                        nextClass =
                            // @ts-ignore
                            userTimetable === null || userTimetable === void 0 ? void 0 : userTimetable.timetableContent[curDay][thisClassIndex + 1];
                    }
                    else if (thisClassIndex === 6) {
                        curWeekDay = curWeekDay + 1;
                        // nextClass =
                        //   // @ts-ignore
                        //   userTimetable?.timetableContent[tmrDay][0];
                        // console.log(nextClass);
                        nextClass = "FTD";
                    }
                    if (curTime < 1140 || curTime >= 1240) {
                        // @ts-ignore
                        curClass = userTimetable === null || userTimetable === void 0 ? void 0 : userTimetable.timetableContent[curDay][thisClassIndex];
                    }
                    if (curTime >= 1140 && curTime < 1240)
                        curClass = "LUC";
                    if (curTime >= 1100 && curTime < 1140)
                        nextClass = "LUC";
                    if (thisClassIndex === 7) {
                        nextClass = "FTD";
                        curClass = "FTD";
                    }
                    if (thisClassIndex === -1)
                        curClass = "BFS";
                    if (curTime >= 1500) {
                        curClass = "FTD";
                        nextClass = "FTD";
                    }
                }
            }
            else {
                curClass = "WKN";
                nextClass = "WKN";
            }
        }
        // const timeUntillNextPeriod = timeCalculator.calcMinutesBetween();
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            color: user.preferredColor,
            profilePicture: user.avatar,
            primaryClass: {
                className: `${primaryClass.program === "ENPG" ? "EP" : "M"} ${primaryClass.classNo}`,
                color: primaryClass.defaultColor,
                classNo: primaryClass.classNo,
                program: primaryClass.program,
            },
            glance: {
                currentClass: curClass,
                nextClass: nextClass,
            },
            config: {
                dateTime: user.preferredConfig.dateTime || "24h",
                showCovid: user.preferredConfig.showCovid || "covShow",
                language: user.preferredConfig.language || "EN",
            },
            starredClasses: starredClasses,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUser = getUser;
const createTimetable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validationErrChecker_1.default)(req);
        const userId = req.userId;
        const classNo = req.body.classNo;
        const timetableContent = req.body.content;
        const defaultColor = req.body.color;
        const program = req.body.program;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        const creator = user._id;
        const timetable = yield timetable_1.default.findOne({ classNo: classNo });
        if (timetable) {
            if (timetable.program === program) {
                return (0, newError_1.default)(409, "This class timetables already existed.");
            }
        }
        let classResult = yield userClass_1.default.findOne({
            classNo: classNo,
            program: program,
        });
        if (!timetableContent.monday)
            (0, newError_1.default)(400, "monday must be filled");
        if (!timetableContent.tuesday)
            (0, newError_1.default)(400, "tuesday must be filled");
        if (!timetableContent.wednesday)
            (0, newError_1.default)(400, "wednesday must be filled");
        if (!timetableContent.thursday)
            (0, newError_1.default)(400, "thursday must be filled");
        if (!timetableContent.friday)
            (0, newError_1.default)(400, "friday must be filled");
        const code = yield code_1.default.findOne({ programCode: program });
        if (!code)
            return (0, newError_1.default)(404, "Program not found.");
        const subjectCode = Object.keys(code.classCode.EN);
        timetableContent.monday.forEach((cur) => {
            if (!subjectCode.includes(cur))
                (0, newError_1.default)(400, "Wrong subject Code|[MONDAY]", "validation");
        });
        timetableContent.tuesday.forEach((cur) => {
            if (!subjectCode.includes(cur))
                (0, newError_1.default)(400, "Wrong subject Code|[TUESDAY]");
        });
        timetableContent.wednesday.forEach((cur) => {
            if (!subjectCode.includes(cur))
                (0, newError_1.default)(400, "Wrong subject Code|[WEDNESDAY]");
        });
        timetableContent.thursday.forEach((cur) => {
            if (!subjectCode.includes(cur))
                (0, newError_1.default)(400, "Wrong subject Code|[THURSDAY]");
        });
        timetableContent.friday.forEach((cur) => {
            if (!subjectCode.includes(cur))
                (0, newError_1.default)(400, "Wrong subject Code|[FRIDAY]");
        });
        if (timetableContent) {
            if (timetableContent.monday.length !== 7 ||
                timetableContent.tuesday.length !== 7 ||
                timetableContent.wednesday.length !== 7 ||
                timetableContent.thursday.length !== 7 ||
                timetableContent.friday.length !== 7) {
                return (0, newError_1.default)(400, "The number of subject per day must be 7.");
            }
        }
        else {
            return (0, newError_1.default)(400, "Must include content of the timetable in the request's body.");
        }
        if (!classResult) {
            const newUserClass = new userClass_1.default({
                classNo: classNo,
                program: program,
                defaultColor: defaultColor,
            });
            classResult = yield newUserClass.save();
        }
        const newTimetable = new timetable_1.default({
            classNo: classNo,
            classId: classResult === null || classResult === void 0 ? void 0 : classResult._id,
            program: program,
            defaultColor: defaultColor,
            timetableContent: timetableContent,
            createdBy: creator,
        });
        const result = yield newTimetable.save();
        classResult.timetable = result._id;
        yield classResult.save();
        // @ts-ignore
        const programName = data_1.programTypes[program];
        res.status(201).json({
            timetableId: result._id,
            classNo: result.classNo,
            program: programName,
            class: {},
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createTimetable = createTimetable;
const getTimetable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l, _m;
    try {
        const userId = req.userId;
        const classRequested = (_j = req.query.classNo) === null || _j === void 0 ? void 0 : _j.toString();
        const programRequested = (_k = req.query.program) === null || _k === void 0 ? void 0 : _k.toString();
        let color;
        const user = yield user_1.default.findById(userId);
        if (!user)
            return (0, newError_1.default)(404, "User not found.");
        const thisTimetable = yield timetable_1.default.findOne({
            classNo: classRequested,
            program: programRequested,
        });
        if (!thisTimetable)
            return (0, newError_1.default)(404, "this class timetable does not existed yet.");
        if ((_l = user.timetables) === null || _l === void 0 ? void 0 : _l.preferredColor)
            color = user.timetables.preferredColor;
        if (!((_m = user.timetables) === null || _m === void 0 ? void 0 : _m.preferredColor))
            color = thisTimetable.defaultColor;
        let thisClassIndex = (0, identifyCurrentClass_1.default)(curTime);
        let tmrDay;
        // @ts-ignore
        if (curWeekDay === 6 || curWeekDay === 5) {
            tmrDay = "weekend";
        }
        else {
            if (curWeekDay === 7)
                tmrDay = "monday";
            if (curWeekDay === 1)
                tmrDay = "tuesday";
            if (curWeekDay === 2)
                tmrDay = "wednesday";
            if (curWeekDay === 3)
                tmrDay = "thursday";
            if (curWeekDay === 4)
                tmrDay = "friday";
        }
        if (curTime >= 1140 && curTime < 1240)
            thisClassIndex = 3.5;
        // console.log(curWeekDay, curDay, tmrDay);
        res.status(200).json({
            className: `${thisTimetable.program === "ENPG" ? "EP" : "M"} ${thisTimetable.classNo}`,
            color: color,
            content: thisTimetable.timetableContent,
            detail: {
                classNo: thisTimetable.classNo,
            },
            identifier: {
                curClass: {
                    index: curDay === "weekend" ? 10 : thisClassIndex,
                    day: curDay === "weekend" ? "monday" : curDay,
                },
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTimetable = getTimetable;
const newProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const programCode = req.body.code;
    const programName = req.body.programName;
    const classCode = req.body.classCode;
    // console.log(classCode);
    const newCode = new code_1.default({
        programCode: programCode,
        programName: programName,
        classCode: classCode,
    });
    const result = yield newCode.save();
    // console.log(result);
    res.json({
        result,
    });
});
exports.newProgram = newProgram;
const getCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.query.language;
    try {
        // console.log(language !== "EN");
        // console.log(language !== "TH");
        // console.log(language);
        // @ts-ignore
        if (language !== "EN" && language !== "TH")
            return (0, newError_1.default)(400, 'languages shall be "TH" or "EN"');
        const codes = yield code_1.default.find();
        const universalCode = yield universalCode_1.default.findOne();
        if (!codes || !universalCode)
            return (0, newError_1.default)(500, "Somthing went worng.");
        const formattedCode = {};
        codes.forEach((cur) => {
            const key = cur.programCode;
            // console.log(cur.classCode.EN);
            formattedCode[key] = Object.assign(Object.assign({}, cur.classCode[language]), universalCode.universalCodes[language]);
        });
        // const formattedCode: any = {};
        // codes.forEach((cur) => {
        //   const key: string = cur.programCode;
        //   formattedCode.EN[key] = cur.classCode.EN;
        //   formattedCode.TH[key] = cur.classCode.EN;
        // });
        res.status(200).json({
            totalAmountOfPrograms: yield code_1.default.find().countDocuments(),
            codes: formattedCode,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCode = getCode;
const socketRefresh = (req, res, next) => {
    try {
        socket_1.default.getIO().emit("glance", {
            action: "refresh",
            currentTime: curTime,
        });
        res.status(200).json({
            message: "Successfully emitted.",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.socketRefresh = socketRefresh;
const newUniversalClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newClassCode = req.body.code;
        const newClassNameEN = req.body.ENName;
        const newClassNameTH = req.body.THName;
        const newClassIcon = req.body.icon;
        const universalCodes = yield universalCode_1.default.findOne();
        if (!universalCodes)
            return (0, newError_1.default)(500, "Server-side Error");
        // @ts-ignore
        universalCodes.universalCodes.TH[newClassCode] = {
            name: newClassNameTH,
            icon: newClassIcon,
        };
        // @ts-ignore
        universalCodes.universalCodes.EN[newClassCode] = {
            name: newClassNameEN,
            icon: newClassIcon,
        };
        // console.log(universalCodes);
        universalCodes.markModified("universalCodes");
        yield universalCodes.save();
        res.status(201).json({
            message: "success!",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.newUniversalClass = newUniversalClass;
const getGlance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classNo = req.query.classNo;
        const program = req.query.program;
        const thisClassIndex = (0, identifyCurrentClass_1.default)(curTime);
        const timetable = yield timetable_1.default.findOne({
            classNo: classNo,
            program: program,
        });
        let nextClass;
        let curClass;
        if (curDay !== "weekend") {
            if (thisClassIndex !== 6) {
                nextClass =
                    // @ts-ignore
                    userTimetable === null || userTimetable === void 0 ? void 0 : userTimetable.timetableContent[curDay][thisClassIndex + 1];
            }
            else if (thisClassIndex === 6) {
                curWeekDay = curWeekDay + 1;
                // let tmrDay;
                // if (curWeekDay === 1) tmrDay = "monday";
                // if (curWeekDay === 2) tmrDay = "tuesday";
                // if (curWeekDay === 3) tmrDay = "wednesday";
                // if (curWeekDay === 4) tmrDay = "thursday";
                // if (curWeekDay === 5) tmrDay = "friday";
                // console.log(curDay, tmrDay);
                // nextClass =
                //   // @ts-ignore
                //   userTimetable?.timetableContent[tmrDay][0];
                // console.log(nextClass);
                nextClass = "FTD";
            }
            if (curTime < 1140 || curTime >= 1240) {
                // @ts-ignore
                curClass = userTimetable === null || userTimetable === void 0 ? void 0 : userTimetable.timetableContent[curDay][thisClassIndex];
            }
            if (curTime >= 1140 && curTime < 1240)
                curClass = "LUC";
            if (curTime >= 1100 && curTime < 1140)
                nextClass = "LUC";
            if (curTime < 830)
                curClass = "BFS";
            if (curTime >= 1500) {
                curClass = "FTD";
                nextClass = "FTD";
            }
        }
        else {
            curClass = "WKN";
            nextClass = "WKN";
        }
    }
    catch (err) {
        next(err);
    }
});
exports.getGlance = getGlance;
