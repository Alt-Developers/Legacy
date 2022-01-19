const express = require("express");

const app = express();

const routes = require("./routes/main-routes");

app.set("views", "views");
app.set("view engine", `ejs`);

app.use(express.static("public"));
app.use(routes);

app.use("/", (req, res, next) => {
  res.send("not here");
});

app.listen(3000);
