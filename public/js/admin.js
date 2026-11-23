

const API_URL = "/api/admin";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("loginMessage");
    const button = loginForm.querySelector("button");

    message.innerText = "Please wait...";
    button.disabled = true;

    try {

        const response = await fetch(API_URL + "/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminName", data.adminName);

            message.style.color = "green";
            message.innerText = "Login successful!";

            window.location.href = "dashboard.html";

        } else {

            message.style.color = "red";
            message.innerText = data.message || "Login failed";

        }

    } catch (error) {

        message.style.color = "red";
        message.innerText = "Server connection failed!";

        console.error(error);

    } finally {

        button.disabled = false;

    }

});
