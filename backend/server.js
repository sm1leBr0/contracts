const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const contractRoutes = require("./routes/contractRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Contract routes
app.use("/api/contracts", contractRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
