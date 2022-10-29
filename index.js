const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 3002;

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: "localhost",
  user: "root",
  password: "",
  database: "real-time-talk",
  debug: false,
});
const info = [
  "a",
  "b",
  "c",
  "d",
  "a",
  "b",
  "c",
  "d",
  "a",
  "b",
  "c",
  "d",
  "a",
  "b",
  "c",
  "d",
];
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.set("views", "public/views");

app.set("view engine", "ejs");

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.post("/login", urlencodedParser, (req, res) => {
  const { username, rawPassword } = req.body;

  pool.query(
    `SELECT id, username, password FROM users WHERE username = '${username}'`,
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const hashedp = data[0].password;
      const user = data[0].username;
      const numbUID = data[0].id;
      const UID = numbUID.toString();
      if (data.length > 0) {
        bcrypt.compare(rawPassword, hashedp, function (err, result) {
          if (result == true) {
            const payload = { user };
            console.log(payload);
            const token = jwt.sign(
              { id: UID, user },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );
            res.cookie("accessToken", token, {
              httpOnly: true,
            });
            res.redirect("/welcome");
          } else {
            console.log("err pass no match");
          }
        });
      }
      // console.log(hashedp);
    }
  );
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/register.html"));
});

app.post("/register", urlencodedParser, (req, res) => {
  const saltRounds = 10;

  const { username, password, contactNumber } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    pool.query(
      `INSERT INTO users (username,password,contactNumber) VALUES ('${username}','${hash}','${contactNumber}')`
    );
  });

  setTimeout(function () {
    res.redirect("/login");
  }, 3000);
});
const authCookieMiddleware = (req, res, next) => {
  const authCookie = req.cookies.accessToken;

  jwt.verify(authCookie, process.env.JWT_SECRET_KEY, (err, data) => {
    if (err) return res.redirect("/login");
    req.data = data;
    next();
  });
};
app.get("/welcome", authCookieMiddleware, (req, res) => {
  console.log(req.data.user);
  pool.query(
    `SELECT * FROM users WHERE username = '${req.data.user}'`,
    (err, results) => {
      const dataResults = results[0];
      res.render("welcome", { data: dataResults });
    }
  );

  // const authCookie = req.cookies.accessToken;

  // jwt.verify(authCookie, process.env.JWT_SECRET_KEY, (err, data) => {
  //   console.log(data);
  // });
});
app.get("/public-room", authCookieMiddleware, (req, res) => {
  pool.query(
    `SELECT * FROM users WHERE username = '${req.data.user}'`,
    (err, results) => {
      const dataResults = results[0];

      res.render("public-room", { data: dataResults });
    }
  );
});
io.on("connection", (socket) => {
  // console.log(socket.id); //
  socket.on("addMSG", (data) => {
    socket.broadcast.emit("recieveMSG", { recieve: data.msg, user: data.user }); //
  });
});

app.get("*", (req, res) => {
  // Here user can also design an
  // error page and render it
  res.send("<h1>Error 404: PAGE NOT FOUND</h1>");
});

server.listen(PORT);
