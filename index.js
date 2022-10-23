const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const PORT = 3002;

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: "localhost",
  user: "root",
  password: "",
  database: "real-time-talk",
  debug: false,
});

app.use(express.static(__dirname + "/public"));
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
  pool.query("SELECT * FROM users", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // rows fetch
    console.log(data);
  });
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/register.html"));
});
app.post("/register", urlencodedParser, (req, res) => {
  const { username, password, contactNumber } = req.body;

  pool.query(
    `INSERT INTO users (username,password,contactNumber) VALUES ('${username}','${password}','${contactNumber}')`
  );

  console.log(username);

  setTimeout(function () {
    res.redirect("/login");
  }, 3000);
});
app.get("*", (req, res) => {
  // Here user can also design an
  // error page and render it
  res.send("<h1>Error 404: PAGE NOT FOUND</h1>");
});
app.listen(PORT, (req, res) => {
  console.log(`listening on port:${PORT}`);
});
