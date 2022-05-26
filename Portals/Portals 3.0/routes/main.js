const express = require("express");
const rootDir = require("../utilities/path");
const path = require("path");

const router = express.Router();

router.get("/dev", (req, res, next) => {
  console.log("There's a user requresting portal main page!");
  res.render("dev");
});
router.get("/docs", (req, res, next) => {
  console.log("There's a user requresting portal main page!");
  res.sendFile("docs.html");
});
router.get("/github", (req, res, next) => {
  console.log("There's a user requresting portal main page!");
  res.sendFile(path.join(rootDir, "views", "github.html"));
});
router.get("/LICENSE", (req, res, next) => {
  res.sendFile(path.join(rootDir, "public", "src", "data", "LICENSE.txt"));
});
router.get("/", (req, res, next) => {
  console.log("There's a user requresting portal main page!");
  res.render("index");
});

module.exports = router;
