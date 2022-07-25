import fs from "fs";

export function deleteFile(filePath: string) {
  if (filePath.split("/").includes("default.png")) return;

  fs.stat(filePath, (err, stat) => {
    if (!err) {
      fs.unlink(filePath, (err) => {
        if (err) {
          throw err;
        }
      });
      return 0;
    } else if (err.code === "ENOENT") {
      return 0;
    } else {
      return err;
    }
  });
}

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
