
const express = require("express");
const router = express.Router();
const db = require("../db");

// Admission Form
router.post("/admission", async (req, res) => {
    try {
        const {
            studentName,
            fatherName,
            email,
            phone,
            className,
            address
        } = req.body;

        if (!studentName || !fatherName || !email ||
            !phone || !className || !address) {
            return res.status(400).json({
                message: "Please fill all admission fields"
            });
        }

        const sql = `INSERT INTO admissions
        (student_name, father_name, email, phone, class_name, address)
        VALUES (?, ?, ?, ?, ?, ?)`;

        const [result] = await db.execute(sql, [
            studentName,
            fatherName,
            email,
            phone,
            className,
            address
        ]);

        res.status(201).json({
            message: "Admission form submitted successfully!",
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Admission form submission failed"
        });
    }
});

// Contact Form
router.post("/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: "Please fill all contact fields"
            });
        }

        const sql = `INSERT INTO contacts
        (name, email, subject, message)
        VALUES (?, ?, ?, ?)`;

        const [result] = await db.execute(sql, [
            name,
            email,
            subject,
            message
        ]);

        res.status(201).json({
            message: "Your message has been sent successfully!",
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Contact form submission failed"
        });
    }
});

module.exports = router;
