require('dotenv').config(); // Load env variables first

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRouter = require('./routes/authRouter');
const packageRouter = require('./routes/packageRouter');

const app = express();

/* ---- Allowed Origins ---- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.takeofftravels.co.in",
  "https://takeofftravels.co.in",
  "https://takeofftravels-backend.onrender.com",
  "https://api.takeofftravels.co.in"
];

/* ---- CORS Setup ---- */
const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS request from:", origin || "Direct/Server-to-Server");
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS Blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

// Use CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests

/* ---- Body Parsers ---- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---- DB Connection ---- */
connectDB();

/* ---- Routes ---- */
app.get("/", (req, res) => {
  res.send("API Root: TakeOffTravels Backend is running!");
});

console.log("Loading users router");
app.use("/users", userRouter);

console.log("Loading packages router");
app.use("/packages", packageRouter);

/* ---- Start Server ---- */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
