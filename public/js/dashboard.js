

const API_URL = "http://localhost:5000/api/admin";

const token = localStorage.getItem("adminToken");

if (!token) {
    window.location.href = "admin.html";
}

document.getElementById("adminName").innerText =
    localStorage.getItem("adminName") || "Admin";

async function apiRequest(url, options = {}) {
    const response = await fetch(API_URL + url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            ...options.headers
        }
    });

    if (response.status === 401) {
        logout();
        throw new Error("Please login again");
    }

    if (!response.ok) {
        throw new Error("Request failed");
    }

    return response.json();
}

// Load Statistics
async function loadStats() {
    const data = await apiRequest("/dashboard/stats");

    document.getElementById("totalAdmissions").innerText =
        data.totalAdmissions;

    document.getElementById("totalContacts").innerText =
        data.totalContacts;
}

// Load Admissions
async function loadAdmissions() {
    const data = await apiRequest("/admissions");
    const table = document.getElementById("admissionsTable");

    table.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");

        const values = [
            item.id,
            item.student_name,
            item.father_name,
            item.email,
            item.phone,
            item.class_name,
            item.address
        ];

        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value ?? "";
            row.appendChild(td);
        });

        const action = document.createElement("td");
        const btn = document.createElement("button");

        btn.innerText = "Delete";
        btn.className = "delete-btn";
        btn.onclick = () => deleteAdmission(item.id);

        action.appendChild(btn);
        row.appendChild(action);
        table.appendChild(row);
    });
}

// Load Contact Messages
async function loadContacts() {
    const data = await apiRequest("/contacts");
    const table = document.getElementById("contactsTable");

    table.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");

        const values = [
            item.id,
            item.name,
            item.email,
            item.subject,
            item.message
        ];

        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value ?? "";
            row.appendChild(td);
        });

        table.appendChild(row);
    });
}

// Delete Admission
async function deleteAdmission(id) {
    if (!confirm("Are you sure you want to delete?")) {
        return;
    }

    try {
        await apiRequest("/admissions/" + id, {
            method: "DELETE"
        });

        await loadAdmissions();
        await loadStats();

        alert("Admission deleted successfully!");

    } catch (error) {
        alert(error.message);
    }
}

// Logout
function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");

    window.location.href = "admin.html";
}

// Load Dashboard
async function loadDashboard() {
    try {
        await loadStats();
        await loadAdmissions();
        await loadContacts();

        document.getElementById("dashboardStatus").innerText =
            "Dashboard loaded successfully!";

    } catch (error) {
        document.getElementById("dashboardStatus").innerText =
            "Unable to load dashboard data.";
    }
}

loadDashboard();
