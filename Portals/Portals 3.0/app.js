const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const route = require("./routes/main");
const { join } = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(route);
app.use((req, res, next) => {
  res.sendFile("404");
});

app.listen(8080);
