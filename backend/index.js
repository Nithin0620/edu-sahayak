const express = require("express")
// const app = express();

require("dotenv").config();
const cors = require("cors")
const path = require("path")
const PORT = process.env.PORT || 5000 || 8000
const {app,server} = require("./config/socketio");
const allowedOrigins = [
  "https://edu-sahayak.vercel.app",
  "http://localhost:5173"
];

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


// app.use((req, res, next) => {
//   console.log("METHOD:", req.method);
//   console.log("URL:", req.url);
//   console.log("HEADERS:", req.headers);
//   let data = '';
//   req.on('data', chunk => { data += chunk });
//   req.on('end', () => {
//     console.log("RAW BODY:", data);
//     next();
//   });
// });

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

app.use(express.static(path.join(__dirname, '../frontend/dist')));


const {dbconnect} = require("./config/database")
dbconnect();

// Must come LAST — after all routes



server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});

app.get("/" , (req,res)=>{
  res.send(`<h1> This is homepage, response from server hance the server is up and running <h1/>`)
})

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});
