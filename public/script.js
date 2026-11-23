
const API_URL = "/api";

// Mobile Menu

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", function () {
    navbar.classList.toggle("active");
});

document.querySelectorAll("#navbar a").forEach(function (link) {
    link.addEventListener("click", function () {
        navbar.classList.remove("active");
    });
});

// Gallery Image Preview

const galleryImages = document.querySelectorAll(".gallery-item img");
const lightbox = document.getElementById("lightbox");
const previewImage = document.getElementById("previewImage");
const closeLightbox = document.getElementById("closeLightbox");

galleryImages.forEach(function (img) {
    img.addEventListener("click", function () {
        lightbox.style.display = "flex";
        previewImage.src = img.src;
        previewImage.alt = img.alt;
    });
});

closeLightbox.addEventListener("click", function () {
    lightbox.style.display = "none";
});

lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        lightbox.style.display = "none";
    }
});

// Admission Form

const admissionForm = document.getElementById("admissionForm");
const admissionStatus = document.getElementById("admissionStatus");

admissionForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const admissionData = {
        studentName: document.getElementById("studentName").value.trim(),
        fatherName: document.getElementById("fatherName").value.trim(),
        email: document.getElementById("admissionEmail").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        className: document.getElementById("className").value,
        address: document.getElementById("studentAddress").value.trim()
    };

    admissionStatus.textContent = "Submitting...";

    try {
        const response = await fetch(API_URL + "/admission", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(admissionData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Admission submission failed.");
        }

        admissionStatus.textContent = result.message;
        admissionStatus.style.color = "green";
        admissionForm.reset();

    } catch (error) {
        admissionStatus.textContent =
            error.message === "Failed to fetch"
                ? "Server se connection nahi ho paya. Backend check karein."
                : error.message;

        admissionStatus.style.color = "red";
    }
});

// Contact Form

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const contactData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    formStatus.textContent = "Sending...";

    try {
        const response = await fetch(API_URL + "/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Message could not be sent.");
        }

        formStatus.textContent = result.message;
        formStatus.style.color = "green";
        contactForm.reset();

    } catch (error) {
        formStatus.textContent =
            error.message === "Failed to fetch"
                ? "Server se connection nahi ho paya. Backend check karein."
                : error.message;

        formStatus.style.color = "red";
    }
});
