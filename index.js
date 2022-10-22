const express = require("express");
const app = express();
const path = require("path");
const PORT = 3002;

app.use(express.static(__dirname + "/public"));

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.listen(PORT, (req, res) => {
  console.log(`listening on port:${PORT}`);
});
