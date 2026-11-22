
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const verifyAdmin = require("../middleware/auth");

const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        const [admins] = await db.execute(
            "SELECT * FROM admins WHERE email = ?",
            [email]
        );

        if (admins.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const admin = admins[0];

        const isMatch = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login successful",
            token,
            adminName: admin.name
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

// Dashboard Statistics
router.get("/dashboard/stats", verifyAdmin, async (req, res) => {
    try {
        const [admissions] = await db.execute(
            "SELECT COUNT(*) AS total FROM admissions"
        );

        const [contacts] = await db.execute(
            "SELECT COUNT(*) AS total FROM contacts"
        );

        res.json({
            totalAdmissions: admissions[0].total,
            totalContacts: contacts[0].total
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get Admissions
router.get("/admissions", verifyAdmin, async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM admissions ORDER BY id DESC"
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get Contact Messages
router.get("/contacts", verifyAdmin, async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM contacts ORDER BY id DESC"
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Admission
router.delete("/admissions/:id", verifyAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid admission ID"
            });
        }

        const [result] = await db.execute(
            "DELETE FROM admissions WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Admission not found"
            });
        }

        res.json({ message: "Admission deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
