const express = require('express');
const connectDB = require('./config/db');
const userRouter = require('./routes/authRouter');
const packageRouter = require('./routes/packageRouter');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Proper CORS setup
app.use(cors({
  origin: "https://www.takeofftravels.co.in",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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
