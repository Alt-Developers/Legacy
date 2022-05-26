"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
function deleteFile(filePath) {
    if (filePath.split("/").includes("default.png"))
        return;
    fs_1.default.stat(filePath, (err, stat) => {
        if (!err) {
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    throw err;
                }
            });
            return 0;
        }
        else if (err.code === "ENOENT") {
            return 0;
        }
        else {
            return err;
        }
    });
}
exports.deleteFile = deleteFile;
// export const deleteFile = new Promise((resolve, reject) => {
// });
// export function saveImage(imageName: string, imageData: any) {
//   const sanitizedImageName = imageName.replace(" ", "+").split(".")[0];
//   console.log("sanitizedImageName: " + sanitizedImageName + ".png");
//   fs.writeFile(`./images/hello.png`, imageData.data, (err) => {
//     if (err) {
//       throw err;
//     }
//     console.log("went well");
//   });
// }
