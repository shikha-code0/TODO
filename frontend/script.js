/* =============================================================
   shy_xhaTodo — Complete Frontend JavaScript
   Author: Shikha | Clean Rewrite — No Duplicates
   =============================================================

   SECTIONS:
   1.  CONFIG
   2.  AUTH GUARD
   3.  UI HELPERS
   4.  LOGIN PAGE
   5.  SIGNUP PAGE
   6.  LOGOUT
   7.  DASHBOARD — STATS
   8.  DASHBOARD — TASKS (CRUD, Search, Filter)
   9.  NOTES PAGE
   10. HABITS PAGE
   11. PASSWORD VAULT PAGE
   12. PROFILE PAGE
   13. ANALYTICS PAGE
   14. CALENDAR PAGE
   15. POMODORO PAGE
   16. SETTINGS PAGE
   17. PAGE INIT
   ============================================================= */


/* =============================================================
   SECTION 1: CONFIG
   Central place for all API URLs and auth helpers
   ============================================================= */

const API_BASE = "http://localhost:8080/api";

// Get stored token and email from localStorage
function getToken()  { return localStorage.getItem("token"); }
function getEmail()  { return localStorage.getItem("email"); }
function getUserName() { return localStorage.getItem("fullName") || "User"; }

// Build Authorization header for protected API calls
function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}

// Generic API helper — handles all fetch calls
async function apiCall(url, method = "GET", body = null) {
    const options = {
        method: method,
        headers: authHeaders()
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    return response;
}


/* =============================================================
   SECTION 2: AUTH GUARD
   Single check — runs once when any page loads
   ============================================================= */

// Pages that require the user to be logged in
const PROTECTED_PAGES = [
    "dashboard.html", "analytics.html", "calendar.html",
    "notes.html", "habits.html", "pomodoro.html",
    "passwords.html", "profile.html", "settings.html"
];

// Get the current filename (e.g. "dashboard.html")
const currentPage = window.location.pathname.split("/").pop();

// If the current page is protected and no token exists, redirect to login
if (PROTECTED_PAGES.includes(currentPage) && !getToken()) {
    window.location.href = "login.html";
}


/* =============================================================
   SECTION 3: UI HELPERS
   Shared utilities used across all pages
   ============================================================= */

// Show a temporary toast notification
function showToast(message, type = "success") {
    // Remove any existing toast
    const existing = document.querySelector(".custom-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.textContent = message;

    // Add color based on type
    if (type === "error") {
        toast.style.background = "#B07A87";
    }

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// Smooth scroll for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

// Navbar shadow on scroll
function initNavbarShadow() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    window.addEventListener("scroll", () => {
        navbar.style.boxShadow = window.scrollY > 50
            ? "0 8px 20px rgba(0,0,0,.15)"
            : "none";
    });
}

// Back to top button
function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener("scroll", () => {
        btn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}

// Scroll reveal animation
function initScrollReveal() {
    const elements = document.querySelectorAll(".planner-card, .dashboard-card, .hero-box");
    elements.forEach(el => el.classList.add("reveal"));
    function reveal() {
        elements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add("active");
            }
        });
    }
    window.addEventListener("scroll", reveal);
    reveal();
}

// Hero image float animation (index page)
function initHeroAnimation() {
    const hero = document.querySelector("#hero img");
    if (!hero) return;
    hero.animate(
        [{ transform: "translateY(0px)" }, { transform: "translateY(-12px)" }, { transform: "translateY(0px)" }],
        { duration: 3000, iterations: Infinity }
    );
}

// Button hover animation
function initButtonAnimation() {
    document.querySelectorAll(".btn").forEach(btn => {
        btn.addEventListener("mouseenter", () => btn.style.transform = "scale(1.05)");
        btn.addEventListener("mouseleave", () => btn.style.transform = "scale(1)");
    });
}

// Handle 401 Unauthorized — clear session and redirect
function handleUnauthorized() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    showToast("Session expired. Please login again.", "error");
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
}


/* =============================================================
   SECTION 4: LOGIN PAGE
   ============================================================= */

function initLoginPage() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;  // Not on login page, skip

    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const email    = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Basic validation
        if (!email || !password) {
            showToast("Please fill in all fields.", "error");
            return;
        }

        const loginBtn = document.getElementById("loginBtn");
        if (loginBtn) loginBtn.textContent = "Logging in...";

        try {
            const response = await fetch(API_BASE + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Store auth info
                localStorage.setItem("token", data.token);
                localStorage.setItem("email", email);
                localStorage.setItem("isLoggedIn", "true");

                // Try to load full name from profile
                try {
                    const profileRes = await fetch(
                        API_BASE + "/auth/profile?email=" + encodeURIComponent(email),
                        { headers: { "Authorization": "Bearer " + data.token } }
                    );
                    if (profileRes.ok) {
                        const profile = await profileRes.json();
                        localStorage.setItem("fullName", profile.fullName || email);
                    }
                } catch (_) { /* profile load failure is not critical */ }

                showToast("Login Successful! 🌸");
                setTimeout(() => { window.location.href = "dashboard.html"; }, 800);

            } else {
                showToast(data.message || "Invalid email or password.", "error");
                if (loginBtn) loginBtn.textContent = "Log In";
            }

        } catch (error) {
            showToast("Cannot connect to server. Please try again.", "error");
            if (loginBtn) loginBtn.textContent = "Log In";
        }
    });
}


/* =============================================================
   SECTION 5: SIGNUP PAGE
   ============================================================= */

function initSignupPage() {
    const signupForm = document.getElementById("signupForm");
    if (!signupForm) return;  // Not on signup page, skip

    signupForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const fullName       = document.getElementById("fullName").value.trim();
        const email          = document.getElementById("email").value.trim();
        const password       = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validations
        if (!fullName || !email || !password || !confirmPassword) {
            showToast("Please complete all fields.", "error");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }
        if (password.length < 8) {
            showToast("Password must be at least 8 characters.", "error");
            return;
        }
        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        const signupBtn = document.getElementById("signupBtn");
        if (signupBtn) signupBtn.textContent = "Creating account...";

        try {
            const response = await fetch(API_BASE + "/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password })
            });

            const result = await response.text();

            if (response.ok) {
                showToast("Account created! Redirecting to login... 🌸");
                setTimeout(() => { window.location.href = "login.html"; }, 1500);
            } else if (response.status === 409) {
                showToast("This email is already registered.", "error");
                if (signupBtn) signupBtn.textContent = "Create My Workspace";
            } else {
                showToast(result || "Registration failed. Please try again.", "error");
                if (signupBtn) signupBtn.textContent = "Create My Workspace";
            }

        } catch (error) {
            showToast("Cannot connect to server. Please try again.", "error");
            if (signupBtn) signupBtn.textContent = "Create My Workspace";
        }
    });
}


/* =============================================================
   SECTION 6: LOGOUT
   ============================================================= */

function initLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", function(e) {
        e.preventDefault();
        // Clear all session data
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("fullName");
        // Redirect to home page
        window.location.href = "index.html";
    });
}


/* =============================================================
   SECTION 7: DASHBOARD — STATS
   Loads statistics from backend stats API
   ============================================================= */

async function loadDashboardStats() {
    const email = getEmail();
    if (!email) return;

    try {
        const response = await fetch(
            API_BASE + "/tasks/stats?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );

        if (response.status === 401) { handleUnauthorized(); return; }
        if (!response.ok) return;

        const stats = await response.json();

        // Update the stat cards — safely check each element exists
        const totalEl     = document.getElementById("totalTasks");
        const completedEl = document.getElementById("completedTasks");
        const pendingEl   = document.getElementById("pendingTasks");
        const priorityEl  = document.getElementById("priorityTasks");

        if (totalEl)     totalEl.textContent     = stats.totalTasks;
        if (completedEl) completedEl.textContent  = stats.completedTasks;
        if (pendingEl)   pendingEl.textContent    = stats.pendingTasks;
        if (priorityEl)  priorityEl.textContent   = stats.highPriorityTasks;

        // Update Today's Overview sidebar
        updateTodayOverview(stats);

        // Update progress bar
        const progressBar = document.getElementById("goalProgress");
        if (progressBar && stats.totalTasks > 0) {
            const pct = Math.round((stats.completedTasks / stats.totalTasks) * 100);
            progressBar.style.width = pct + "%";
        }

    } catch (error) {
        console.error("Stats load error:", error);
    }
}

// Update the right sidebar "Today's Overview" counters
function updateTodayOverview(stats) {
    // The dashboard sidebar has <strong> tags inside flex rows
    // They don't have IDs, so we set them via parent element text matching
    const overviewItems = document.querySelectorAll(".planner-card .d-flex.justify-content-between");
    overviewItems.forEach(row => {
        const label = row.querySelector("span")?.textContent?.trim();
        const valueEl = row.querySelector("strong");
        if (!valueEl) return;
        if (label === "Completed")    valueEl.textContent = stats.completedTasks;
        if (label === "Pending")      valueEl.textContent = stats.pendingTasks;
        if (label === "High Priority") valueEl.textContent = stats.highPriorityTasks;
    });
}


/* =============================================================
   SECTION 8: DASHBOARD — TASKS
   All task operations use backend APIs — no localStorage
   ============================================================= */

// Holds tasks loaded from the backend (used for search/filter without re-fetching)
let allTasks = [];

// The ID of the task currently being edited (null = creating new)
let editingTaskId = null;

// Currently active filter value
let currentFilter = "all";

// Load all tasks from backend and display them
async function loadTasks() {
    const email = getEmail();
    if (!email) return;

    const taskContainer = document.getElementById("taskContainer");
    if (!taskContainer) return;  // Not on dashboard

    try {
        const response = await fetch(
            API_BASE + "/tasks?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );

        if (response.status === 401) { handleUnauthorized(); return; }
        if (!response.ok) { showToast("Failed to load tasks.", "error"); return; }

        allTasks = await response.json();

        displayTasks(allTasks);
        updateDeadlines(allTasks);

    } catch (error) {
        showToast("Cannot connect to server.", "error");
    }
}

// Display task cards — applies current search + filter on top of provided task list
function displayTasks(tasks) {
    const taskContainer = document.getElementById("taskContainer");
    if (!taskContainer) return;

    // Apply search filter
    const searchInput = document.getElementById("searchTask");
    const keyword = searchInput ? searchInput.value.toLowerCase() : "";

    // Apply status/priority filter
    let filtered = tasks.filter(task => {
        // Search filter
        if (keyword && !(
            task.title?.toLowerCase().includes(keyword) ||
            task.description?.toLowerCase().includes(keyword)
        )) return false;

        // Status/priority filter
        if (currentFilter === "completed" && task.status !== "COMPLETED") return false;
        if (currentFilter === "pending"   && task.status !== "PENDING")   return false;
        if (currentFilter === "high"      && task.priority !== "HIGH")    return false;

        return true;
    });

    // Show empty state if no tasks
    if (filtered.length === 0) {
        taskContainer.innerHTML = `
            <div class="text-center py-5">
                <img src="preview.jpeg" class="img-fluid mb-4" style="max-width:200px;" alt="No tasks">
                <h4>No Tasks Yet 🌸</h4>
                <p>Create your first task using the form above.</p>
            </div>`;
        return;
    }

    // Build task cards
    taskContainer.innerHTML = "";
    filtered.forEach(task => {
        const isCompleted = task.status === "COMPLETED";
        const priorityClass = (task.priority || "").toLowerCase();  // HIGH → high

        const card = document.createElement("div");
        card.className = "planner-card mb-3" + (isCompleted ? " completed-task" : "");

        card.innerHTML = `
            <div class="task-card">
                <div class="task-top">
                    <div>
                        <h4 class="task-title">${escapeHtml(task.title)}</h4>
                        <p class="task-description">${escapeHtml(task.description || "")}</p>
                    </div>
                    <input
                        type="checkbox"
                        class="form-check-input completeCheckbox"
                        data-id="${task.id}"
                        data-status="${task.status}"
                        ${isCompleted ? "checked" : ""}
                        title="Mark as ${isCompleted ? "Pending" : "Completed"}">
                </div>
                <div class="task-bottom">
                    <div>
                        ${task.category ? `<span class="badge bg-secondary">${escapeHtml(task.category)}</span>` : ""}
                        <span class="priority-badge ${priorityClass}">${task.priority || ""}</span>
                        <span class="task-date">📅 ${task.dueDate || "No Date"}</span>
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn editTaskBtn" data-id="${task.id}" title="Edit">✏️</button>
                        <button class="delete-btn deleteTaskBtn" data-id="${task.id}" title="Delete">🗑️</button>
                    </div>
                </div>
            </div>`;

        taskContainer.appendChild(card);
    });
}

// Prevent XSS — escape user content before inserting into HTML
function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Add task form submit handler
function initTaskForm() {
    const taskForm = document.getElementById("taskForm");
    if (!taskForm) return;

    taskForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const title    = document.getElementById("taskTitle")?.value.trim();
        const desc     = document.getElementById("taskDescription")?.value.trim();
        const category = document.getElementById("taskCategory")?.value;
        const priority = document.getElementById("taskPriority")?.value;
        const dueDate  = document.getElementById("taskDate")?.value;

        if (!title) {
            showToast("Task title is required.", "error");
            return;
        }

        const taskData = {
            title,
            description: desc,
            category,
            priority,
            status: "PENDING",
            dueDate: dueDate || null,
            email: getEmail()
        };

        try {
            let response;

            if (editingTaskId !== null) {
                // UPDATE existing task
                response = await fetch(API_BASE + "/tasks/" + editingTaskId, {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify(taskData)
                });
            } else {
                // CREATE new task
                response = await fetch(API_BASE + "/tasks", {
                    method: "POST",
                    headers: authHeaders(),
                    body: JSON.stringify(taskData)
                });
            }

            if (response.status === 401) { handleUnauthorized(); return; }

            if (response.ok) {
                showToast(editingTaskId ? "Task updated! ✅" : "Task added! 🌸");
                resetTaskForm();
                await loadTasks();
                await loadDashboardStats();
            } else {
                showToast("Failed to save task.", "error");
            }

        } catch (error) {
            showToast("Cannot connect to server.", "error");
        }
    });
}

// Reset form to "create new task" mode
function resetTaskForm() {
    const taskForm = document.getElementById("taskForm");
    if (taskForm) taskForm.reset();

    editingTaskId = null;

    const submitBtn = taskForm?.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.textContent = "➕ Add Task";
}

// Delete a task by ID
async function deleteTask(id) {
    if (!confirm("Delete this task? This cannot be undone.")) return;

    try {
        const response = await fetch(API_BASE + "/tasks/" + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + getToken() }
        });

        if (response.status === 401) { handleUnauthorized(); return; }

        if (response.ok) {
            showToast("Task deleted.");
            await loadTasks();
            await loadDashboardStats();
        } else {
            showToast("Failed to delete task.", "error");
        }
    } catch (error) {
        showToast("Cannot connect to server.", "error");
    }
}

// Load a task into the form for editing
function editTask(id) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    editingTaskId = id;

    const titleEl    = document.getElementById("taskTitle");
    const descEl     = document.getElementById("taskDescription");
    const categoryEl = document.getElementById("taskCategory");
    const priorityEl = document.getElementById("taskPriority");
    const dateEl     = document.getElementById("taskDate");

    if (titleEl)    titleEl.value    = task.title || "";
    if (descEl)     descEl.value     = task.description || "";
    if (categoryEl) categoryEl.value = task.category || "Study";
    if (priorityEl) priorityEl.value = task.priority || "LOW";
    if (dateEl)     dateEl.value     = task.dueDate || "";

    // Change button text to indicate we're editing
    const taskForm = document.getElementById("taskForm");
    const submitBtn = taskForm?.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.textContent = "✅ Update Task";

    // Scroll to form
    document.getElementById("taskForm")?.scrollIntoView({ behavior: "smooth" });
}

// Toggle task status between PENDING and COMPLETED
async function toggleTaskStatus(id, currentStatus) {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

    try {
        const response = await fetch(
            API_BASE + "/tasks/" + id + "/status?status=" + newStatus,
            { method: "PUT", headers: { "Authorization": "Bearer " + getToken() } }
        );

        if (response.status === 401) { handleUnauthorized(); return; }

        if (response.ok) {
            await loadTasks();
            await loadDashboardStats();
        }
    } catch (error) {
        showToast("Cannot connect to server.", "error");
    }
}

// Upcoming deadlines list in sidebar
function updateDeadlines(tasks) {
    const deadlineList = document.getElementById("deadlineList");
    if (!deadlineList) return;

    const upcoming = tasks
        .filter(t => t.dueDate && t.status !== "COMPLETED")
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    if (upcoming.length === 0) {
        deadlineList.innerHTML = "<li>No upcoming deadlines 🌸</li>";
        return;
    }

    deadlineList.innerHTML = upcoming.map(t => `
        <li class="mb-2">
            <strong>${escapeHtml(t.title)}</strong><br>
            <small>📅 ${t.dueDate}</small>
        </li>`).join("");
}

// Attach event delegation to task container
function initTaskContainer() {
    const taskContainer = document.getElementById("taskContainer");
    if (!taskContainer) return;

    taskContainer.addEventListener("click", function(e) {
        // Delete button
        if (e.target.classList.contains("deleteTaskBtn")) {
            const id = parseInt(e.target.dataset.id);
            deleteTask(id);
        }
        // Edit button
        if (e.target.classList.contains("editTaskBtn")) {
            const id = parseInt(e.target.dataset.id);
            editTask(id);
        }
    });

    taskContainer.addEventListener("change", function(e) {
        // Complete checkbox
        if (e.target.classList.contains("completeCheckbox")) {
            const id = parseInt(e.target.dataset.id);
            const currentStatus = e.target.dataset.status;
            toggleTaskStatus(id, currentStatus);
        }
    });
}

// Search input handler
function initSearch() {
    const searchInput = document.getElementById("searchTask");
    if (!searchInput) return;

    searchInput.addEventListener("input", function() {
        displayTasks(allTasks);  // Re-render using loaded tasks with new search
    });
}

// Filter dropdown handler
function initFilter() {
    const filterSelect = document.getElementById("filterSelect");
    if (!filterSelect) return;

    filterSelect.addEventListener("change", function() {
        currentFilter = this.value;  // "all", "completed", "pending", "high"
        displayTasks(allTasks);
    });
}

// Set today's date in dashboard hero
function initTodayDate() {
    const todayEl = document.getElementById("todayDate");
    if (!todayEl) return;
    todayEl.textContent = new Date().toDateString();
}

// Set welcome name in dashboard hero
function initWelcomeName() {
    const heroName = document.querySelector(".hero-name");
    if (!heroName) return;
    const name = getUserName();
    heroName.textContent = name;
}


/* =============================================================
   SECTION 9: NOTES PAGE
   Full CRUD connected to backend /api/notes
   ============================================================= */

let allNotes = [];
let editingNoteId = null;

async function loadNotes() {
    const notesContainer = document.getElementById("notesContainer");
    if (!notesContainer) return;

    const email = getEmail();
    if (!email) return;

    try {
        const response = await fetch(
            API_BASE + "/notes?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );

        if (response.status === 401) { handleUnauthorized(); return; }
        if (!response.ok) { showToast("Failed to load notes.", "error"); return; }

        allNotes = await response.json();
        displayNotes(allNotes);

    } catch (error) {
        showToast("Cannot connect to server.", "error");
    }
}

function displayNotes(notes) {
    const notesContainer = document.getElementById("notesContainer");
    if (!notesContainer) return;

    const searchEl = document.getElementById("searchNote");
    const keyword  = searchEl ? searchEl.value.toLowerCase() : "";

    const filtered = notes.filter(n =>
        !keyword ||
        n.title?.toLowerCase().includes(keyword) ||
        n.content?.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) {
        notesContainer.innerHTML = `
            <div class="text-center py-5">
                <img src="preview.jpeg" class="img-fluid mb-3" style="max-width:200px;" alt="">
                <h4>No Notes Yet 📝</h4>
                <p>Create your first note above.</p>
            </div>`;
        return;
    }

    notesContainer.innerHTML = "";
    filtered.forEach(note => {
        const card = document.createElement("div");
        card.className = "note-card mb-3 planner-card";
        card.innerHTML = `
            <h4>${escapeHtml(note.title)}</h4>
            <p>${escapeHtml(note.content)}</p>
            <div class="note-actions">
                <button class="btn btn-sm me-2 editNoteBtn" data-id="${note.id}">✏️ Edit</button>
                <button class="btn btn-sm btn-danger deleteNoteBtn" data-id="${note.id}">🗑️ Delete</button>
            </div>`;
        notesContainer.appendChild(card);
    });
}

function initNotesPage() {
    const noteForm = document.getElementById("noteForm");
    if (!noteForm) return;

    // Load notes on page init
    loadNotes();

    // Submit note form
    noteForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const title   = document.getElementById("noteTitle")?.value.trim();
        const content = document.getElementById("noteText")?.value.trim();

        if (!title) { showToast("Please enter a note title.", "error"); return; }

        const body = { title, content, email: getEmail() };

        try {
            let response;
            if (editingNoteId !== null) {
                response = await fetch(API_BASE + "/notes/" + editingNoteId, {
                    method: "PUT", headers: authHeaders(), body: JSON.stringify(body)
                });
            } else {
                response = await fetch(API_BASE + "/notes", {
                    method: "POST", headers: authHeaders(), body: JSON.stringify(body)
                });
            }

            if (response.status === 401) { handleUnauthorized(); return; }

            if (response.ok) {
                showToast(editingNoteId ? "Note updated! ✅" : "Note saved! 📝");
                editingNoteId = null;
                noteForm.reset();
                await loadNotes();
            } else {
                showToast("Failed to save note.", "error");
            }
        } catch (error) {
            showToast("Cannot connect to server.", "error");
        }
    });

    // Search notes
    const searchNote = document.getElementById("searchNote");
    if (searchNote) {
        searchNote.addEventListener("input", () => displayNotes(allNotes));
    }

    // Edit / Delete via event delegation
    const notesContainer = document.getElementById("notesContainer");
    if (notesContainer) {
        notesContainer.addEventListener("click", async function(e) {
            const id = parseInt(e.target.dataset.id);

            if (e.target.classList.contains("deleteNoteBtn")) {
                if (!confirm("Delete this note?")) return;
                try {
                    const res = await fetch(API_BASE + "/notes/" + id, {
                        method: "DELETE", headers: { "Authorization": "Bearer " + getToken() }
                    });
                    if (res.ok) { showToast("Note deleted."); await loadNotes(); }
                } catch (_) { showToast("Cannot connect to server.", "error"); }
            }

            if (e.target.classList.contains("editNoteBtn")) {
                const note = allNotes.find(n => n.id === id);
                if (!note) return;
                editingNoteId = id;
                const titleEl = document.getElementById("noteTitle");
                const textEl  = document.getElementById("noteText");
                if (titleEl) titleEl.value = note.title || "";
                if (textEl)  textEl.value  = note.content || "";
                noteForm.querySelector("button")?.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
}


/* =============================================================
   SECTION 10: HABITS PAGE
   Full CRUD connected to backend /api/habits
   ============================================================= */

let allHabits = [];

async function loadHabits() {
    const habitContainer = document.getElementById("habitContainer");
    if (!habitContainer) return;

    const email = getEmail();
    if (!email) return;

    try {
        const response = await fetch(
            API_BASE + "/habits?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );

        if (response.status === 401) { handleUnauthorized(); return; }
        if (!response.ok) { showToast("Failed to load habits.", "error"); return; }

        allHabits = await response.json();
        displayHabits(allHabits);

    } catch (error) {
        showToast("Cannot connect to server.", "error");
    }
}

function displayHabits(habits) {
    const habitContainer = document.getElementById("habitContainer");
    if (!habitContainer) return;

    if (habits.length === 0) {
        habitContainer.innerHTML = `<p class="text-muted">No habits yet. Click "+ Add Habit" to start!</p>`;
        return;
    }

    habitContainer.innerHTML = "";
    habits.forEach(habit => {
        const card = document.createElement("div");
        card.className = "habit-card d-flex align-items-center justify-content-between mb-3 p-3";
        card.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <input type="checkbox" class="form-check-input habitToggle"
                    data-id="${habit.id}" ${habit.done ? "checked" : ""}>
                <span class="${habit.done ? "text-decoration-line-through text-muted" : ""}">
                    ${escapeHtml(habit.name)}
                </span>
            </div>
            <button class="btn btn-sm btn-danger deleteHabitBtn" data-id="${habit.id}">🗑️</button>`;
        habitContainer.appendChild(card);
    });
}

function initHabitsPage() {
    const habitContainer = document.getElementById("habitContainer");
    if (!habitContainer) return;

    loadHabits();

    // Add habit button
    const addHabitBtn = document.getElementById("addHabit");
    if (addHabitBtn) {
        addHabitBtn.addEventListener("click", async function() {
            const name = prompt("Enter habit name:");
            if (!name || !name.trim()) return;

            try {
                const response = await fetch(API_BASE + "/habits", {
                    method: "POST",
                    headers: authHeaders(),
                    body: JSON.stringify({ name: name.trim(), email: getEmail() })
                });
                if (response.ok) { showToast("Habit added! 🌱"); await loadHabits(); }
                else showToast("Failed to add habit.", "error");
            } catch (_) { showToast("Cannot connect to server.", "error"); }
        });
    }

    // Toggle and Delete via delegation
    habitContainer.addEventListener("click", async function(e) {
        const id = parseInt(e.target.dataset.id);

        if (e.target.classList.contains("habitToggle")) {
            try {
                await fetch(API_BASE + "/habits/" + id + "/toggle", {
                    method: "PUT", headers: { "Authorization": "Bearer " + getToken() }
                });
                await loadHabits();
            } catch (_) { showToast("Cannot connect to server.", "error"); }
        }

        if (e.target.classList.contains("deleteHabitBtn")) {
            if (!confirm("Delete this habit?")) return;
            try {
                const res = await fetch(API_BASE + "/habits/" + id, {
                    method: "DELETE", headers: { "Authorization": "Bearer " + getToken() }
                });
                if (res.ok) { showToast("Habit deleted."); await loadHabits(); }
            } catch (_) { showToast("Cannot connect to server.", "error"); }
        }
    });
}


/* =============================================================
   SECTION 11: PASSWORD VAULT PAGE
   Full CRUD connected to backend /api/passwords
   ============================================================= */

let allPasswords = [];
let editingPasswordId = null;

async function loadPasswords() {
    const passwordContainer = document.getElementById("passwordContainer");
    if (!passwordContainer) return;

    const email = getEmail();
    if (!email) return;

    try {
        const response = await fetch(
            API_BASE + "/passwords?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );

        if (response.status === 401) { handleUnauthorized(); return; }
        if (!response.ok) { showToast("Failed to load passwords.", "error"); return; }

        allPasswords = await response.json();
        displayPasswords(allPasswords);

    } catch (error) {
        showToast("Cannot connect to server.", "error");
    }
}

function displayPasswords(passwords) {
    const passwordContainer = document.getElementById("passwordContainer");
    if (!passwordContainer) return;

    const searchEl = document.getElementById("searchPassword");
    const keyword  = searchEl ? searchEl.value.toLowerCase() : "";

    const filtered = passwords.filter(p =>
        !keyword ||
        p.website?.toLowerCase().includes(keyword) ||
        p.username?.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) {
        passwordContainer.innerHTML = `
            <div class="text-center py-5">
                <h4>No passwords saved 🔐</h4>
                <p>Save your first password using the form.</p>
            </div>`;
        return;
    }

    passwordContainer.innerHTML = "";
    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "password-card mb-3 p-3";
        card.innerHTML = `
            <div class="password-top d-flex justify-content-between align-items-center mb-2">
                <h5 class="mb-0">${escapeHtml(p.website)}</h5>
                <span class="badge bg-secondary">${escapeHtml(p.category || "")}</span>
            </div>
            <div class="mb-1">👤 ${escapeHtml(p.username)}</div>
            <div class="password-hidden mb-2" id="vault-${p.id}">••••••••••</div>
            <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-sm showPasswordBtn" data-id="${p.id}" data-pass="${escapeHtml(p.vaultPassword)}">👁 Show</button>
                <button class="btn btn-sm copyPasswordBtn" data-pass="${escapeHtml(p.vaultPassword)}">📋 Copy</button>
                <button class="btn btn-sm editPasswordBtn" data-id="${p.id}">✏️ Edit</button>
                <button class="btn btn-sm btn-danger deletePasswordBtn" data-id="${p.id}">🗑️ Delete</button>
            </div>`;
        passwordContainer.appendChild(card);
    });
}

function initPasswordVaultPage() {
    const passwordForm = document.getElementById("passwordForm");
    if (!passwordForm) return;

    loadPasswords();

    // Submit password form
    passwordForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const website       = document.getElementById("website")?.value.trim();
        const username      = document.getElementById("username")?.value.trim();
        const vaultPassword = document.getElementById("password")?.value;
        const category      = document.getElementById("category")?.value;

        if (!website || !username || !vaultPassword) {
            showToast("Please fill all password fields.", "error");
            return;
        }

        const body = { website, username, vaultPassword, category, email: getEmail() };

        try {
            let response;
            if (editingPasswordId !== null) {
                response = await fetch(API_BASE + "/passwords/" + editingPasswordId, {
                    method: "PUT", headers: authHeaders(), body: JSON.stringify(body)
                });
            } else {
                response = await fetch(API_BASE + "/passwords", {
                    method: "POST", headers: authHeaders(), body: JSON.stringify(body)
                });
            }

            if (response.status === 401) { handleUnauthorized(); return; }

            if (response.ok) {
                showToast(editingPasswordId ? "Password updated! ✅" : "Password saved! 🔐");
                editingPasswordId = null;
                passwordForm.reset();
                await loadPasswords();
            } else {
                showToast("Failed to save password.", "error");
            }
        } catch (_) { showToast("Cannot connect to server.", "error"); }
    });

    // Search
    const searchPassword = document.getElementById("searchPassword");
    if (searchPassword) {
        searchPassword.addEventListener("input", () => displayPasswords(allPasswords));
    }

    // Show / Copy / Edit / Delete via delegation
    const passwordContainer = document.getElementById("passwordContainer");
    if (passwordContainer) {
        passwordContainer.addEventListener("click", async function(e) {
            const id = parseInt(e.target.dataset.id);

            if (e.target.classList.contains("showPasswordBtn")) {
                const div = document.getElementById("vault-" + id);
                if (div) {
                    div.textContent = div.textContent === "••••••••••"
                        ? e.target.dataset.pass
                        : "••••••••••";
                    e.target.textContent = div.textContent === "••••••••••" ? "👁 Show" : "🙈 Hide";
                }
            }

            if (e.target.classList.contains("copyPasswordBtn")) {
                navigator.clipboard.writeText(e.target.dataset.pass)
                    .then(() => showToast("Password copied! 📋"))
                    .catch(() => showToast("Copy failed.", "error"));
            }

            if (e.target.classList.contains("editPasswordBtn")) {
                const entry = allPasswords.find(p => p.id === id);
                if (!entry) return;
                editingPasswordId = id;
                const w = document.getElementById("website");
                const u = document.getElementById("username");
                const p = document.getElementById("password");
                const c = document.getElementById("category");
                if (w) w.value = entry.website || "";
                if (u) u.value = entry.username || "";
                if (p) p.value = entry.vaultPassword || "";
                if (c) c.value = entry.category || "Social";
                passwordForm.scrollIntoView({ behavior: "smooth" });
            }

            if (e.target.classList.contains("deletePasswordBtn")) {
                if (!confirm("Delete this saved password?")) return;
                try {
                    const res = await fetch(API_BASE + "/passwords/" + id, {
                        method: "DELETE", headers: { "Authorization": "Bearer " + getToken() }
                    });
                    if (res.ok) { showToast("Password deleted."); await loadPasswords(); }
                } catch (_) { showToast("Cannot connect to server.", "error"); }
            }
        });
    }
}


/* =============================================================
   SECTION 12: PROFILE PAGE
   Load and save profile from backend /api/auth/profile
   ============================================================= */

async function initProfilePage() {
    const saveProfileBtn = document.getElementById("saveProfile");
    if (!saveProfileBtn) return;

    const email = getEmail();
    if (!email) return;

    // Load profile from backend
    try {
        const response = await fetch(
            API_BASE + "/auth/profile?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );

        if (response.ok) {
            const profile = await response.json();

            // Fill form fields safely
            const fields = {
                profileName:     profile.fullName,
                profileEmail:    profile.email,
                profilePhone:    profile.phone,
                profileLocation: profile.location,
                profileBio:      profile.bio
            };
            Object.entries(fields).forEach(([id, val]) => {
                const el = document.getElementById(id);
                if (el) el.value = val || "";
            });

            // Update hero title with name
            const heroTitle = document.querySelector("#profileHero .hero-title");
            if (heroTitle && profile.fullName) heroTitle.textContent = profile.fullName;

            // Load task stats for profile page
            loadProfileStats(email);
        }
    } catch (error) {
        showToast("Failed to load profile.", "error");
    }

    // Save profile button
    saveProfileBtn.addEventListener("click", async function() {
        const body = {
            email:    email,
            fullName: document.getElementById("profileName")?.value.trim(),
            phone:    document.getElementById("profilePhone")?.value.trim(),
            location: document.getElementById("profileLocation")?.value.trim(),
            bio:      document.getElementById("profileBio")?.value.trim()
        };

        try {
            const response = await fetch(API_BASE + "/auth/profile", {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify(body)
            });

            if (response.ok) {
                showToast("Profile saved! 🌸");
                if (body.fullName) localStorage.setItem("fullName", body.fullName);
            } else {
                showToast("Failed to save profile.", "error");
            }
        } catch (_) { showToast("Cannot connect to server.", "error"); }
    });
}

// Load task stats for profile page productivity section
async function loadProfileStats(email) {
    try {
        const response = await fetch(
            API_BASE + "/tasks/stats?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );
        if (!response.ok) return;
        const stats = await response.json();

        const totalEl     = document.getElementById("profileTotalTasks");
        const completedEl = document.getElementById("profileCompletedTasks");
        const highEl      = document.getElementById("profileHighPriority");

        if (totalEl)     totalEl.textContent     = stats.totalTasks;
        if (completedEl) completedEl.textContent  = stats.completedTasks;
        if (highEl)      highEl.textContent       = stats.highPriorityTasks;
    } catch (_) { /* not critical */ }
}


/* =============================================================
   SECTION 13: ANALYTICS PAGE
   Uses backend stats + tasks for charts — no localStorage
   ============================================================= */

async function initAnalyticsPage() {
    const analyticsTotal = document.getElementById("analyticsTotal");
    if (!analyticsTotal) return;

    const email = getEmail();
    if (!email) return;

    try {
        // Fetch stats
        const statsRes = await fetch(
            API_BASE + "/tasks/stats?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );
        if (statsRes.status === 401) { handleUnauthorized(); return; }
        if (!statsRes.ok) { showToast("Failed to load analytics.", "error"); return; }
        const stats = await statsRes.json();

        document.getElementById("analyticsTotal")?.setAttribute("textContent", stats.totalTasks);
        analyticsTotal.textContent = stats.totalTasks;
        const completedEl = document.getElementById("analyticsCompleted");
        const pendingEl   = document.getElementById("analyticsPending");
        const highEl      = document.getElementById("analyticsHigh");
        if (completedEl) completedEl.textContent = stats.completedTasks;
        if (pendingEl)   pendingEl.textContent   = stats.pendingTasks;
        if (highEl)      highEl.textContent      = stats.highPriorityTasks;

        // Fetch all tasks for priority breakdown
        const tasksRes = await fetch(
            API_BASE + "/tasks?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );
        const tasks = tasksRes.ok ? await tasksRes.json() : [];

        const high   = tasks.filter(t => t.priority === "HIGH").length;
        const medium = tasks.filter(t => t.priority === "MEDIUM").length;
        const low    = tasks.filter(t => t.priority === "LOW").length;

        // Doughnut chart — completed vs pending
        const pieCanvas = document.getElementById("pieChart");
        if (pieCanvas && window.Chart) {
            new Chart(pieCanvas, {
                type: "doughnut",
                data: {
                    labels: ["Completed", "Pending"],
                    datasets: [{
                        data: [stats.completedTasks, stats.pendingTasks],
                        backgroundColor: ["#9BB89C", "#B07A87"]
                    }]
                },
                options: { responsive: true }
            });
        }

        // Bar chart — priority distribution
        const barCanvas = document.getElementById("barChart");
        if (barCanvas && window.Chart) {
            new Chart(barCanvas, {
                type: "bar",
                data: {
                    labels: ["High", "Medium", "Low"],
                    datasets: [{
                        label: "Tasks by Priority",
                        data: [high, medium, low],
                        backgroundColor: ["#B07A87", "#D6BFA8", "#9BB89C"]
                    }]
                },
                options: { responsive: true }
            });
        }

    } catch (error) {
        showToast("Failed to load analytics.", "error");
    }
}


/* =============================================================
   SECTION 14: CALENDAR PAGE
   Shows real task due dates from backend
   ============================================================= */

async function initCalendarPage() {
    const calendarGrid = document.getElementById("calendarGrid");
    if (!calendarGrid) return;

    const email = getEmail();
    if (!email) return;

    try {
        const response = await fetch(
            API_BASE + "/tasks?email=" + encodeURIComponent(email),
            { headers: { "Authorization": "Bearer " + getToken() } }
        );
        if (response.status === 401) { handleUnauthorized(); return; }
        const tasks = response.ok ? await response.json() : [];

        const today = new Date();
        const month = today.getMonth();
        const year  = today.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthYearEl = document.getElementById("monthYear");
        if (monthYearEl) {
            monthYearEl.textContent = today.toLocaleString("default", {
                month: "long", year: "numeric"
            });
        }

        calendarGrid.innerHTML = "";
        for (let day = 1; day <= daysInMonth; day++) {
            // Check if any task has a due date on this day (same month + year)
            const hasTask = tasks.some(task => {
                if (!task.dueDate) return false;
                const d = new Date(task.dueDate + "T00:00:00"); // Avoid timezone shift
                return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
            });

            const dayEl = document.createElement("div");
            dayEl.className = "calendar-day";
            if (day === today.getDate()) dayEl.classList.add("today");
            if (hasTask) dayEl.classList.add("task-day");
            dayEl.innerHTML = `<strong>${day}</strong>`;
            calendarGrid.appendChild(dayEl);
        }

        // Task list below calendar
        const taskList = document.getElementById("calendarTaskList");
        if (taskList) {
            const withDates = tasks
                .filter(t => t.dueDate)
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

            taskList.innerHTML = withDates.length === 0
                ? "<li class='list-group-item'>No scheduled tasks 🌸</li>"
                : withDates.map(t => `
                    <li class="list-group-item">
                        <strong>${escapeHtml(t.title)}</strong> — ${t.dueDate}
                        <span class="badge ms-2 ${t.status === "COMPLETED" ? "bg-success" : "bg-warning text-dark"}">
                            ${t.status}
                        </span>
                    </li>`).join("");
        }

    } catch (error) {
        showToast("Failed to load calendar.", "error");
    }
}


/* =============================================================
   SECTION 15: POMODORO PAGE
   Frontend-only timer — no database needed
   ============================================================= */

function initPomodoroPage() {
    const timerDisplay = document.getElementById("timerDisplay");
    if (!timerDisplay) return;

    let totalSeconds = 25 * 60;  // 25 minutes
    let timerInterval = null;
    let isRunning = false;

    function updateDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    }

    const startBtn = document.getElementById("startTimer");
    const pauseBtn = document.getElementById("pauseTimer");
    const resetBtn = document.getElementById("resetTimer");

    if (startBtn) {
        startBtn.addEventListener("click", function() {
            if (isRunning) return;
            isRunning = true;
            timerDisplay.classList.add("timer-running");

            timerInterval = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateDisplay();
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    timerDisplay.classList.remove("timer-running");
                    showToast("🍅 Pomodoro complete! Time for a break.");
                }
            }, 1000);
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener("click", function() {
            clearInterval(timerInterval);
            isRunning = false;
            timerDisplay.classList.remove("timer-running");
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", function() {
            clearInterval(timerInterval);
            isRunning = false;
            totalSeconds = 25 * 60;
            updateDisplay();
            timerDisplay.classList.remove("timer-running");
        });
    }

    updateDisplay();
}


/* =============================================================
   SECTION 16: SETTINGS PAGE
   Saves UI preferences to localStorage (no sensitive data)
   ============================================================= */

function initSettingsPage() {
    const saveSettingsBtn = document.getElementById("saveSettings");
    if (!saveSettingsBtn) return;

    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem("uiSettings")) || {};
    const darkModeEl    = document.getElementById("darkMode");
    const notifEl       = document.getElementById("notifications");
    const accentEl      = document.getElementById("accentColor");

    if (darkModeEl && savedSettings.darkMode)      darkModeEl.checked  = true;
    if (notifEl    && savedSettings.notifications) notifEl.checked     = true;
    if (accentEl   && savedSettings.accentColor)   accentEl.value      = savedSettings.accentColor;

    // Apply saved accent color
    if (savedSettings.accentColor) {
        document.documentElement.style.setProperty("--color-primary", savedSettings.accentColor);
    }

    saveSettingsBtn.addEventListener("click", function() {
        const settings = {
            darkMode:      darkModeEl ? darkModeEl.checked : false,
            notifications: notifEl    ? notifEl.checked    : false,
            accentColor:   accentEl   ? accentEl.value     : "#B07A87"
        };

        localStorage.setItem("uiSettings", JSON.stringify(settings));

        if (settings.accentColor) {
            document.documentElement.style.setProperty("--color-primary", settings.accentColor);
        }

        showToast("Settings saved! 🌸");
    });
}


/* =============================================================
   SECTION 17: PAGE INIT
   DOMContentLoaded — runs the right code for the current page
   ============================================================= */

document.addEventListener("DOMContentLoaded", function() {

    // UI helpers that run on every page
    initSmoothScrolling();
    initNavbarShadow();
    initBackToTop();
    initScrollReveal();
    initHeroAnimation();
    initButtonAnimation();
    initLogout();

    // TODAY'S DATE on dashboard
    initTodayDate();

    // ---- Page-specific initialization ----

    if (currentPage === "login.html") {
        initLoginPage();
    }

    else if (currentPage === "signup.html") {
        initSignupPage();
    }

    else if (currentPage === "dashboard.html") {
        initWelcomeName();
        initTaskForm();
        initTaskContainer();
        initSearch();
        initFilter();
        loadTasks();
        loadDashboardStats();
    }

    else if (currentPage === "notes.html") {
        initNotesPage();
    }

    else if (currentPage === "habits.html") {
        initHabitsPage();
    }

    else if (currentPage === "passwords.html") {
        initPasswordVaultPage();
    }

    else if (currentPage === "profile.html") {
        initProfilePage();
    }

    else if (currentPage === "analytics.html") {
        initAnalyticsPage();
    }

    else if (currentPage === "calendar.html") {
        initCalendarPage();
    }

    else if (currentPage === "pomodoro.html") {
        initPomodoroPage();
    }

    else if (currentPage === "settings.html") {
        initSettingsPage();
    }

});