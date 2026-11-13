const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./prisma");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Student API is running!");
});

// READ — get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// CREATE — add a student
app.post("/api/students", async (req, res) => {
  try {
    const { name, email, course } = req.body;

    if (!name || !email || !course) {
      return res.status(400).json({ error: "Name, email, and course are required." });
    }

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        course: course.trim(),
      },
    });

    res.status(201).json(student);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "That email address already exists." });
    }
    res.status(500).json({ error: "Failed to create student" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});