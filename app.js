// --- UNIFIED BASE DATASET ---
const initialJobs = [
    { id: 1, title: "Frontend Developer", category: "Development", status: "Active" },
    { id: 2, title: "Backend Developer", category: "Development", status: "Active" },
    { id: 3, title: "Full Stack Developer", category: "Development", status: "Active" },
    { id: 4, title: "QA Engineer", category: "Development", status: "Active" },
    { id: 5, title: "UI/UX Designer", category: "Design", status: "Active" },
    { id: 6, title: "Digital Marketing Executive", category: "Marketing", status: "Active" },
    { id: 7, title: "Backend Engineer", category: "Development", status: "Active" },
    { id: 8, title: "Test Automation Engineer", category: "Development", status: "Active" }
];

const initialApplicants = [
    { id: 1, name: "Alice Johnson", position: "Frontend Developer", status: "Selected" },
    { id: 2, name: "Michael Chen", position: "UI/UX Designer", status: "Shortlisted" },
    { id: 3, name: "Sarah Smith", position: "Digital Marketing Executive", status: "Pending" },
    { id: 4, name: "Emma Davis", position: "Full Stack Developer", status: "Selected" },
    { id: 5, name: "Rahul Sharma", position: "Backend Developer", status: "Shortlisted" },
    { id: 6, name: "Sophia Martinez", position: "Backend Engineer", status: "Pending" },
    { id: 7, name: "Liam Wilson", position: "Backend Engineer", status: "Selected" },
    { id: 8, name: "Olivia Taylor", position: "Test Automation Engineer", status: "Pending" },
    { id: 9, name: "David Miller", position: "Frontend Developer", status: "Pending" }
];

// Ensure fallback datasets are present in LocalStorage
function verifyAndSyncStorage() {
    if (!localStorage.getItem('jobs')) {
        localStorage.setItem('jobs', JSON.stringify(initialJobs));
    }
    if (!localStorage.getItem('applicants')) {
        localStorage.setItem('applicants', JSON.stringify(initialApplicants));
    }
}

verifyAndSyncStorage();

let jobs = JSON.parse(localStorage.getItem('jobs'));
let applicants = JSON.parse(localStorage.getItem('applicants'));

let barChartInstance = null;
let pieChartInstance = null;

// --- INITIALIZATION GATEWAY ---
document.addEventListener("DOMContentLoaded", () => {
    checkAuthState(); // Initialize authentication gate
    initAuthForm();
    initNavigation();
    initClickableStats();
    initModalHandlers();
    initLogoutHandler();
    
    // Global filter and search listeners
    document.getElementById("categoryFilter").addEventListener("change", renderDashboard);
    document.getElementById("statusFilter").addEventListener("change", renderDashboard);
    document.getElementById("applicantStatusFilter").addEventListener("change", renderDashboard);
    document.getElementById("globalSearch").addEventListener("input", renderDashboard);
});

// --- AUTHENTICATION GUARDIAN ---
function checkAuthState() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const loginScreen = document.getElementById("login-screen");
    const dashboardApp = document.getElementById("dashboard-app");

    if (isLoggedIn) {
        // Hides login and shows dashboard successfully overriding CSS display defaults
        loginScreen.style.setProperty('display', 'none', 'important');
        dashboardApp.style.setProperty('display', 'flex', 'important');
        renderDashboard(); // Boot up dashboard tables & charts safely
    } else {
        loginScreen.style.setProperty('display', 'flex', 'important');
        dashboardApp.style.setProperty('display', 'none', 'important');
    }
}

function initAuthForm() {
    const loginForm = document.getElementById("loginForm");
    const errorMsg = document.getElementById("login-error-msg");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById("username").value.trim();
        const passwordInput = document.getElementById("password").value;

        // Credentials Gate: username 'admin' and password 'admin123'
        if (usernameInput === "admin" && passwordInput === "admin123") {
            sessionStorage.setItem("isLoggedIn", "true");
            errorMsg.textContent = "";
            loginForm.reset();
            checkAuthState(); // Transition views instantly
        } else {
            errorMsg.textContent = "Invalid username or password. Try admin / admin123";
        }
    });
}

// --- LOGOUT FLOW ---
function initLogoutHandler() {
    document.getElementById("logoutBtn").addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
            sessionStorage.removeItem("isLoggedIn"); // Invalidate session
            checkAuthState(); // Lock dashboard immediately
        }
    });
}

// --- MENU NAVIGATION ---
function initNavigation() {
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".tab-content");
    const pageTitle = document.getElementById("page-title");

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab(item, sections, pageTitle);
        });
    });
}

function switchTab(clickedMenuItem, sections, pageTitle) {
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(el => el.classList.remove("active"));
    clickedMenuItem.classList.add("active");

    const target = clickedMenuItem.getAttribute("data-target");
    sections.forEach(sec => sec.classList.remove("active-tab"));
    
    const targetSection = document.getElementById(target);
    if (targetSection) {
        targetSection.classList.add("active-tab");
    }

    if (pageTitle) {
        pageTitle.textContent = clickedMenuItem.textContent.trim();
    }
    
    // Reset filters and search queries upon changing tabs
    document.getElementById("globalSearch").value = "";
    document.getElementById("categoryFilter").value = "all";
    document.getElementById("statusFilter").value = "all";
    document.getElementById("applicantStatusFilter").value = "all";
    renderDashboard();
}

// --- INTERACTIVE STATS CARDS ROUTING ---
function initClickableStats() {
    const sections = document.querySelectorAll(".tab-content");
    const pageTitle = document.getElementById("page-title");

    document.getElementById("card-total-jobs").addEventListener("click", () => {
        switchTab(document.getElementById("menu-jobs-btn"), sections, pageTitle);
    });

    document.getElementById("card-total-applicants").addEventListener("click", () => {
        switchTab(document.getElementById("menu-applicants-btn"), sections, pageTitle);
    });

    document.getElementById("card-total-users").addEventListener("click", () => {
        switchTab(document.getElementById("menu-applicants-btn"), sections, pageTitle);
    });

    document.getElementById("card-active-jobs").addEventListener("click", () => {
        switchTab(document.getElementById("menu-jobs-btn"), sections, pageTitle);
    });
}

// --- ADD JOB MODAL HANDLERS ---
function initModalHandlers() {
    const modal = document.getElementById("jobModal");
    const openBtn = document.getElementById("openJobModalBtn");
    const closeBtn = document.getElementById("closeJobModalBtn");
    const cancelBtn = document.getElementById("cancelJobModalBtn");
    const form = document.getElementById("addJobForm");

    const toggleModal = (show) => {
        if (show) modal.classList.add("active");
        else {
            modal.classList.remove("active");
            form.reset();
        }
    };

    openBtn.addEventListener("click", () => toggleModal(true));
    closeBtn.addEventListener("click", () => toggleModal(false));
    cancelBtn.addEventListener("click", () => toggleModal(false));

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const titleVal = document.getElementById("jobTitleInput").value.trim();
        const categoryVal = document.getElementById("jobCategoryInput").value;
        const statusVal = document.getElementById("jobStatusInput").value;

        const newId = jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;

        const newJob = {
            id: newId,
            title: titleVal,
            category: categoryVal,
            status: statusVal
        };

        jobs.push(newJob);
        localStorage.setItem('jobs', JSON.stringify(jobs));

        toggleModal(false);
        renderDashboard();
    });
}

// --- CORE RENDERING ENGINE ---
function renderDashboard() {
    if (sessionStorage.getItem("isLoggedIn") !== "true") return;

    const categoryFilter = document.getElementById("categoryFilter").value;
    const statusFilter = document.getElementById("statusFilter").value;
    const applicantStatusFilter = document.getElementById("applicantStatusFilter").value;
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();

    // 1. Map applicants count accurately from applicants list
    jobs.forEach(job => {
        job.applicants = applicants.filter(app => app.position === job.title).length;
    });

    // 2. Filter Jobs Table Dataset (By search title, category, and status)
    let filteredJobs = jobs.filter(job => {
        const matchesCategory = (categoryFilter === "all" || job.category === categoryFilter);
        const matchesStatus = (statusFilter === "all" || job.status === statusFilter);
        const matchesSearch = job.title.toLowerCase().includes(searchVal);
        return matchesCategory && matchesStatus && matchesSearch;
    });

    // 3. Filter Applicants Table Dataset
    let filteredApplicants = applicants.filter(applicant => {
        return (applicantStatusFilter === "all" || applicant.status === applicantStatusFilter);
    });

    // 4. Update top level Stats Cards
    document.getElementById("stat-total-jobs").textContent = jobs.length;
    document.getElementById("stat-total-applicants").textContent = applicants.length;
    document.getElementById("stat-total-users").textContent = applicants.length; 
    document.getElementById("stat-active-jobs").textContent = jobs.filter(j => j.status === "Active").length;

    // 5. Populate Jobs Table
    const jobsTableBody = document.getElementById("jobsTableBody");
    jobsTableBody.innerHTML = "";
    filteredJobs.forEach(job => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${job.title}</strong></td>
            <td>${job.category}</td>
            <td><span class="badge ${job.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${job.status}</span></td>
            <td>${job.applicants} Applied</td>
            <td><button class="delete-btn" onclick="deleteJob(${job.id})"><i class="fa-solid fa-trash"></i> Delete</button></td>
        `;
        jobsTableBody.appendChild(row);
    });

    // 6. Populate Applicants Table
    const applicantsTableBody = document.getElementById("applicantsTableBody");
    applicantsTableBody.innerHTML = "";
    filteredApplicants.forEach(applicant => {
        const row = document.createElement("tr");
        let badgeClass = "badge-pending";
        if (applicant.status === "Selected") badgeClass = "badge-selected";
        if (applicant.status === "Shortlisted") badgeClass = "badge-shortlisted";

        row.innerHTML = `
            <td><strong>${applicant.name}</strong></td>
            <td>${applicant.position}</td>
            <td><span class="badge ${badgeClass}">${applicant.status}</span></td>
            <td><button class="delete-btn" onclick="deleteApplicant(${applicant.id})"><i class="fa-solid fa-user-minus"></i> Remove</button></td>
        `;
        applicantsTableBody.appendChild(row);
    });

    // 7. Render/Refresh charts dynamically
    renderCharts();
}

// --- CHART GRAPHICS CONTROLLER (Chart.js) ---
function renderCharts() {
    const barLabels = jobs.map(j => j.title);
    const barData = jobs.map(j => j.applicants);

    const categories = ["Development", "Design", "Marketing"];
    const pieData = categories.map(cat => jobs.filter(j => j.category === cat).length);

    // Bar Chart Creation
    const ctxBar = document.getElementById("barChart");
    if (ctxBar) {
        if (barChartInstance) barChartInstance.destroy();
        barChartInstance = new Chart(ctxBar.getContext("2d"), {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [{
                    label: 'Applications',
                    data: barData,
                    backgroundColor: '#3b82f6',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        grid: { color: 'rgba(255,255,255,0.05)' }, 
                        ticks: { color: '#9ca3af', stepSize: 1 },
                        beginAtZero: true
                    },
                    x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                }
            }
        });
    }

    // Pie Chart Creation
    const ctxPie = document.getElementById("pieChart");
    if (ctxPie) {
        if (pieChartInstance) pieChartInstance.destroy();
        pieChartInstance = new Chart(ctxPie.getContext("2d"), {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: pieData,
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b'],
                    borderColor: '#111827',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#f3f4f6' } }
                }
            }
        });
    }
}

// --- LOCAL STORAGE DATA EDITORS ---
window.deleteJob = function(id) {
    jobs = jobs.filter(j => j.id !== id);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    renderDashboard();
};

window.deleteApplicant = function(id) {
    applicants = applicants.filter(a => a.id !== id);
    localStorage.setItem('applicants', JSON.stringify(applicants));
    renderDashboard();
};