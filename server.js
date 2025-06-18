const express = require('express');
const connectDB = require('./config/db');
const userRouter = require('./routes/authRouter');
const packageRouter = require('./routes/packageRouter');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  "https://www.takeofftravels.co.in",
  "https://takeofftravels.co.in", 
  "https://takeofftravels-backend.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("public/upload"));

const port = process.env.PORT || 8080;
connectDB();

app.get("/", (req, res) => {
  res.send("I am root");
});

app.use("/users", userRouter);
app.use("/packages", packageRouter);

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
