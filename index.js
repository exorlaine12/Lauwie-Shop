// In-memory storage for registered users (for demo only)
let registeredUsers = [];

// Function to handle registration
function handleRegistration() {
    if (document.querySelector('.register-container')) {
        const form = document.querySelector('.register-container form');
        const messageContainer = document.getElementById('register-message');
        
        if (form) {
            form.onsubmit = function(e) {
                e.preventDefault();
                
                const username = form.elements['username'].value;
                const email = form.elements['email'].value;
                const password = form.elements['password'].value;
                const confirmPassword = form.elements['confirm_password'].value;
                
                if (password !== confirmPassword) {
                    messageContainer.innerHTML = '<div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 15px;">Passwords do not match. Please try again.</div>';
                    return false;
                }
                
                registeredUsers.push({ username, email, password });
                sessionStorage.setItem('lastRegisteredUser', username);
                sessionStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                messageContainer.innerHTML = '<div style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 15px;">Registration successful! Redirecting to login page...</div>';
                setTimeout(() => { window.location.href = "index.html"; }, 2000);
            };
        }
    }
}

// Function to handle login
function enhanceLoginButton() {
    if (document.querySelector('.login-container')) {
        const loginBtn = document.getElementById('mySubmit');
        const loginMessage = document.createElement('p');
        document.querySelector('.login-container').appendChild(loginMessage);

        loginBtn.onclick = function() {
            const username = document.getElementById('myUser').value;
            const password = document.getElementById('myPass').value;
            
            if (!username || !password) {
                loginMessage.textContent = "Please enter both username and password.";
                loginMessage.style.color = "#721c24";
                return;
            }
            
            const storedUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
            const user = storedUsers.find(user => user.username === username && user.password === password);
            
            if (user) {
                sessionStorage.setItem('loggedInUser', username);
                loginMessage.textContent = "Login successful! Redirecting...";
                loginMessage.style.color = "#155724";
                setTimeout(() => { window.location.href = "index.html"; }, 1500);
            } else {
                loginMessage.textContent = "Invalid username or password.";
                loginMessage.style.color = "#721c24";
            }
        };
    }
}

// Redirect to login if user is not logged in
function protectDashboard() {
    if (document.body.classList.contains('dashboard')) {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            alert("You must be logged in to access this page.");
            window.location.href = "index.html";
        }
    }
}

// Function to toggle settings dropdown menu
function toggleSettings(event) {
    let settingsMenu = document.getElementById('settings-menu');
    const settingsBtn = document.querySelector('.fa-cog');

    if (!settingsMenu) {
        settingsMenu = document.createElement('div');
        settingsMenu.id = 'settings-menu';

        // Prevent page overflow and horizontal scrolling
        settingsMenu.style.position = 'fixed'; // Keeps it in the same spot on scroll
        
        settingsMenu.style.padding = '10px';
        settingsMenu.style.border = '1px solid #ccc';
        settingsMenu.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        settingsMenu.style.borderRadius = '5px';
        settingsMenu.style.zIndex = '1000';
        settingsMenu.style.width = 'max-content'; // Auto size without overflow
        settingsMenu.style.minWidth = '120px';
        settingsMenu.style.maxWidth = '200px';
        settingsMenu.style.whiteSpace = 'nowrap';
        settingsMenu.style.overflow = 'hidden';
        settingsMenu.style.display = 'none';

        settingsMenu.innerHTML = `
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 12px; cursor: pointer;" onclick="changeAppearance()">Appearance</li>
                <li style="padding: 8px 12px; cursor: pointer;" onclick="changeLanguage()">Languages</li>
                <li style="padding: 8px 12px; cursor: pointer; color: red;" onclick="resetSettings()">Reset Settings</li>
            </ul>
        `;

        document.body.appendChild(settingsMenu);
    }

    // Position dropdown fixed relative to button
    function positionDropdown() {
        const rect = settingsBtn.getBoundingClientRect();
        settingsMenu.style.top = `${rect.bottom + 5}px`; // Slight spacing below button
        settingsMenu.style.left = `${rect.left}px`;
    }

    // Fix horizontal scrolling issues
    document.body.style.overflowX = "hidden";

    if (settingsMenu.style.display === 'block') {
        settingsMenu.style.display = 'none';
        document.body.style.overflowX = ""; // Restore default scrolling
        window.removeEventListener("scroll", positionDropdown);
        document.removeEventListener("click", closeMenuOnOutsideClick);
    } else {
        settingsMenu.style.display = 'block';
        positionDropdown();
        window.addEventListener("scroll", positionDropdown); // Keeps position when scrolling
        setTimeout(() => {
            document.addEventListener("click", closeMenuOnOutsideClick);
        }, 100);
    }

    function closeMenuOnOutsideClick(event) {
        if (!settingsMenu.contains(event.target) && !settingsBtn.contains(event.target)) {
            settingsMenu.style.display = 'none';
            document.body.style.overflowX = ""; // Restore default scrolling
            window.removeEventListener("scroll", positionDropdown);
            document.removeEventListener("click", closeMenuOnOutsideClick);
        }
    }

    event.stopPropagation();
}

// Attach event listener to settings button
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.fa-cog').addEventListener("click", toggleSettings);
});



// Dummy functions for settings options
function changeAppearance() {
    alert("Appearance settings will be implemented soon.");
}

function changeLanguage() {
    alert("Language settings will be implemented soon.");
}

function resetSettings() {
    alert("Settings have been reset to default.");
}

// Run necessary functions on page load
document.addEventListener('DOMContentLoaded', function() {
    handleRegistration();
    enhanceLoginButton();
    protectDashboard();

    if (document.querySelector('.login-container')) {
        const lastUser = sessionStorage.getItem('lastRegisteredUser');
        if (lastUser) {
            document.getElementById('myUser').value = lastUser;
        }
    }

    const settingsBtn = document.querySelector('.fa-cog');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', toggleSettings);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Dark Mode Toggle
    const settingsIcon = document.querySelector(".fa-user-circle");
    const settingsMenu = document.createElement("div");

    settingsMenu.classList.add("settings-menu");
    settingsMenu.innerHTML = `
        <ul>
            <li id="toggle-dark-mode"><i class="fas fa-moon"></i> Dark Mode</li>
            <li id="change-password"><i class="fas fa-key"></i> Change Password</li>
            <li id="logout"><i class="fas fa-sign-out-alt"></i> Logout</li>
        </ul>
    `;
    document.body.appendChild(settingsMenu);

    settingsIcon.addEventListener("click", function() {
        settingsMenu.classList.toggle("active");
    });

    // Dark Mode Functionality
    const darkModeToggle = document.getElementById("toggle-dark-mode");
    darkModeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));

        document.querySelectorAll(".fa-user-circle, .fa-bell").forEach(icon => {
            icon.style.color = document.body.classList.contains("dark-mode") ? "#fff" : "#000";
        });
    });

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    // Logout Functionality with Styled Message
    document.getElementById("logout").addEventListener("click", function() {
        const messageContainer = document.createElement("div");
        messageContainer.style.position = "fixed";
        messageContainer.style.top = "20px";
        messageContainer.style.left = "50%";
        messageContainer.style.transform = "translateX(-50%)";
        messageContainer.style.backgroundColor = "#d4edda";
        messageContainer.style.color = "#155724";
        messageContainer.style.padding = "10px 20px";
        messageContainer.style.borderRadius = "5px";
        messageContainer.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        messageContainer.textContent = "Logging out... Redirecting to login page.";
        
        document.body.appendChild(messageContainer);

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });

    document.addEventListener("click", function(event) {
        if (!settingsMenu.contains(event.target) && !settingsIcon.contains(event.target)) {
            settingsMenu.classList.remove("active");
        }
    });
});