
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const db = require("./db");
const formRoutes = require("./routes/forms");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

// Frontend files serve karna
app.use(express.static(path.join(__dirname, "public")));

// Main website
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API routes
app.use("/api", formRoutes);
app.use("/api/admin", adminRoutes);

// Create Admin Table and First Admin
async function setupAdmin() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password || password.length < 12) {
        throw new Error(
            "Set admin details in .env. Password must be at least 12 characters."
        );
    }

    const [admins] = await db.execute(
        "SELECT id FROM admins WHERE email = ?",
        [email]
    );

    if (admins.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 12);

        await db.execute(
            "INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        console.log("First admin account created successfully!");
    } else {
        console.log("Admin account already exists.");
    }
}

async function startServer() {
    try {
        await db.query("SELECT 1");
        console.log("MySQL Connected Successfully!");

        await setupAdmin();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server Startup Failed:", error);
        process.exit(1);
    }
}

startServer();
