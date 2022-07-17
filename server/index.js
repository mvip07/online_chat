const express = require("express");
const cors = require("cors");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

const isAuth = require("./utils/auth");
const useControllers = require("./controllers/userController");
const messageConrtroller= require("./controllers/messageController");
const mongoConnect = require("./utils/db").mongoConnect;

app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.post("/user/login", useControllers.login);
app.post("/user/register", useControllers.signup);
app.post("/user/update/account", useControllers.getUserUpdate);
app.get("/api/all/user", useControllers.allUsers)
app.post("/api/addmsg",  messageConrtroller.addMessage);
app.post("/api/getmsg",  messageConrtroller.getMessage);

mongoConnect(() => {
  app.listen(process.env.PORT || 5000, () => console.log("Server Started!"));
});

const io = socket(mongoConnect(), {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});



global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  setInterval(() => {
    socket.clients.map((client) => {
      client.send(new Date().toTimeString());
    });
  }, 1000);

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

socket.onmessage = function (event) {
  el = document.getElementById('server-time');
  el.innerHTML = 'Server time: ' + event.data;
};