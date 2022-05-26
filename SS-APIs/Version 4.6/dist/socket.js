"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let io;
exports.default = {
    init: (httpServer) => {
        io = require("socket.io")(httpServer, {
            cors: {
                origin: "http://localhost:3000",
            },
            Credential: true,
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    },
};
