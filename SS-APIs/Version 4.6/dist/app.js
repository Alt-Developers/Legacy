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
exports.sio = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const luxon_1 = require("luxon");
dotenv_1.default.config({ path: "./.env" });
const errorController = __importStar(require("./controllers/errors"));
const system_1 = __importDefault(require("./routes/system"));
const auth_1 = __importDefault(require("./routes/auth"));
const expenses_1 = __importDefault(require("./routes/expenses"));
const timetables_1 = __importDefault(require("./routes/timetables"));
const socket_1 = __importDefault(require("./socket"));
let curTime;
let curDay;
luxon_1.Settings.defaultZone = "utc+7";
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        const sanitizedOriginalName = file.originalname.replace(/ /g, "_");
        const dateAdded = luxon_1.DateTime.local();
        cb(null, `${dateAdded.day}${dateAdded.month < 10 ? "0" + dateAdded.month : dateAdded.month}${dateAdded.year}-${(0, uuid_1.v4)()}.${file.mimetype.endsWith("png")
            ? ".png"
            : file.mimetype.endsWith("jpg")
                ? ".jpg"
                : ".jpeg"}`);
    },
});
const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype;
    if (fileType.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const app = (0, express_1.default)();
// parse a json request
app.use(body_parser_1.default.json());
// get an Image form the file
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
// Cross Origins Handler
app.use((0, cors_1.default)());
// Find Endpoint
app.use("/images", express_1.default.static("./images"));
app.use("/expenses", expenses_1.default);
app.use("/auth", auth_1.default);
app.use("/system13", system_1.default);
app.use("/timetables", timetables_1.default);
// Can't find Endpoint
app.use("/", errorController.notFound404);
// Central Error Handler
app.use(errorController.centralError);
let io;
mongoose_1.default
    .connect(process.env.MONGOOSE_URI)
    .then((result) => {
    console.log("Connected to the database.");
    const server = app.listen(8080);
    // @ts-ignore
    io = socket_1.default.init(server);
    io.on("connection", (socket) => {
        console.log(`Client connected | ID ${socket.id}`);
        socket.emit("welcome", "You have been connected to SS-APIs websocket Network.");
    });
})
    .catch((err) => console.log(err));
const db = mongoose_1.default.connection;
exports.sio = io;
