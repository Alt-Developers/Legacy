"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.centralError = exports.notFound404 = void 0;
const notFound404 = (req, res, next) => {
    res.status(404).json({
        message: "SS APIs can't find service you have requested.",
        requestedService: req.path,
    });
};
exports.notFound404 = notFound404;
const centralError = (err, req, res, next) => {
    const code = err.statusCode || 500;
    console.log(`${err.statusCode} - ${err.message}`);
    res.status(code).json({
        type: err.type || "general",
        modal: err.modal,
        location: err.location,
        message: err.message.split("|")[1] || err.message,
        header: err.message.split("|")[1] ? err.message.split("|")[0] : undefined,
    });
};
exports.centralError = centralError;
