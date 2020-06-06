const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var jwt = require("jsonwebtoken");
var cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
// const index = require(".//api/api");

// app.use(index);
var bodyParser = require("body-parser");
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, "secret", function (err, decoded) {
      if (err) return next(new Error("Authentication error"));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit(socket.decoded.username, response);
};

const userData = {
  username: "harry",
  password: "123",
};

app.post("/signin", function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  // return 400 status if username/password is not exist
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required.",
    });
  }

  // return 401 status if the credential is not match.
  if (user !== userData.username || pwd !== userData.password) {
    return res.status(401).json({
      error: true,
      message: "Username or Password is Wrong.",
    });
  }
  const payload = {
    username: user,
    password: pwd,
  };
  const token = jwt.sign(payload, "secret", {
    expiresIn: 60 * 60 * 24, // expires in 24 hours
  });
  return res.json({ user, token });
});

app.get("/login", function (req, res) {
  const token = req.headers["token"];
  if (!token) return res.status(401).json("Unauthorize user");

  try {
    const decoded = jwt.verify(token, "secret");
    res.json({ ...decoded, auth: true });
  } catch (e) {
    console.log(e);
    res.status(400).json("Token not valid");
  }
});

server.listen(port, () => console.log(`Listening on port ${port}`));
