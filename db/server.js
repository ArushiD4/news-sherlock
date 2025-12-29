require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require('./routes/newsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use('/api/news', newsRoutes);

app.get("/", (req, res) => {
  res.send("News Sherlock Backend Running");
});

app.listen(process.env.PORT, () =>
  console.log("Server started")
);
