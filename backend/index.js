const express = require("express")
// const app = express();

require("dotenv").config();
const cors = require("cors")
const path = require("path")
const PORT = process.env.PORT || 5000
const {app,server} = require("./config/socketio");
const allowedOrigins = ["*"];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Database connection
const {dbconnect} = require("./config/database")
dbconnect();

// API Routes
const authRoutes = require("./routes/Auth.routes")
const aiAPiRoutes = require("./routes/AiApi.routes")
const chatRoutes = require("./routes/chat.routes")
const groupsRoutes = require("./routes/groups")
const groupaMessage = require("./routes/GRPMessage")
const quiz = require("./routes/Quiz.routes")
const cards = require("./routes/flashcardRoutes")
const score = require("./routes/userQuizAns");

app.use("/api/auth",authRoutes);
app.use("/api/requirement",aiAPiRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/group",groupsRoutes);
app.use("/api/grpmsg",groupaMessage);
app.use("/api/quiz",quiz);
app.use("/api/cards",cards);
app.use("/api/score",score);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing - send all non-API requests to React app
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

// Start server
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});
const {dbconnect} = require("./config/database")
dbconnect();

// Must come LAST — after all routes



server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});

app.get("/" , (req,res)=>{
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
})

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});
