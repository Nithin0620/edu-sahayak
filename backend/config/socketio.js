const http = require("http");
const Server = require("socket.io"); // correct
require("dotenv").config();
const SocketIO = require("socket.io");
console.log(SocketIO);

const express = require("express");
const app = express(); // create app only once here

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ENVIRONMENT === "development"
      ? "http://localhost:5173"
      : "",
    credentials: true,
  },
});

const userSocketMap = {};

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (userId) delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, server, io, getReceiverSocketId };
