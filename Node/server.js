require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // לאפשר לקליינט לגשת לשרת
app.use(express.json()); // לאפשר קריאה של JSON בבקשות

// מסלול בדיקה
app.get("/", (req, res) => {
  res.send("API is running!");
});

// מסלול שמחזיר רשימת משימות לדוגמה
app.get("/tasks", (req, res) => {
  res.json([
    { id: 1, name: "משימה 1", isComplete: false },
    { id: 2, name: "משימה 2", isComplete: true },
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
 
