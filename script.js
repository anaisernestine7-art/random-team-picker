const namesInput = document.getElementById("names");
const teamInput = document.getElementById("teamCount");

const countText = document.getElementById("count");
const duplicateWarning = document.getElementById("duplicateWarning");
const errorBox = document.getElementById("error");

const results = document.getElementById("results");
const teamsContainer = document.getElementById("teamsContainer");

let currentTeams = [];

function parseNames() {
    return namesInput.value
        .split(/\r?\n/)
        .map(name => name.trim())
        .filter(name => name !== "");
}

function updateCount() {
    const names = parseNames();

    countText.textContent =
        `${names.length} ${names.length === 1 ? "name" : "names"}`;

    checkDuplicates(names);
}

function checkDuplicates(names) {
    const seen = new Set();
    const duplicates = new Set();

    names.forEach(name => {
        const lower = name.toLowerCase();

        if (seen.has(lower)) {
            duplicates.add(name);
        }

        seen.add(lower);
    });

    if (duplicates.size > 0) {
        duplicateWarning.textContent =
            "Duplicate names detected: " +
            [...duplicates].join(", ");

        duplicateWarning.classList.remove("hidden");
    } else {
        duplicateWarning.classList.add("hidden");
    }
}

function fisherYatesShuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function buildTeams(names, teamCount) {
    const shuffled = fisherYatesShuffle(names);

    const teams = Array.from(
        { length: teamCount },
        () => []
    );

    shuffled.forEach((name, index) => {
        teams[index % teamCount].push(name);
    });

    return teams;
}

function showError(message) {
    if (!message) {
        errorBox.classList.add("hidden");
        return;
    }

    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

function renderTeams() {
    teamsContainer.innerHTML = "";

    currentTeams.forEach((team, index) => {

        const card = document.createElement("div");
        card.className = "team-card";

        const title = document.createElement("h3");
        title.textContent =
            `Team ${index + 1} (${team.length})`;

        const list = document.createElement("ul");

        team.forEach(member => {
            const li = document.createElement("li");
            li.textContent = member;
            list.appendChild(li);
        });

        card.appendChild(title);
        card.appendChild(list);

        teamsContainer.appendChild(card);
    });

    results.classList.remove("hidden");
}

function generateTeams() {

    showError("");

    const names = parseNames();
    const teamCount = Number(teamInput.value);

    if (names.length === 0) {
        showError("Please enter at least one name.");
        return;
    }

    if (teamCount < 2) {
        showError("Minimum 2 teams required.");
        return;
    }

    if (teamCount > names.length) {
        showError("Number of teams cannot exceed number of names.");
        return;
    }

    currentTeams = buildTeams(names, teamCount);

    renderTeams();
}

function copyTeams() {

    const text = currentTeams
        .map((team, index) =>
            `*Team ${index + 1}*\n` +
            team.map(name => `• ${name}`).join("\n")
        )
        .join("\n\n");

    navigator.clipboard.writeText(text);

    const btn = document.getElementById("copyBtn");

    btn.textContent = "Copied!";

    setTimeout(() => {
        btn.textContent = "Copy for WhatsApp";
    }, 1500);
}

function clearEverything() {
    namesInput.value = "";
    teamsContainer.innerHTML = "";
    results.classList.add("hidden");

    updateCount();
}

namesInput.addEventListener("input", updateCount);

document
    .getElementById("generateBtn")
    .addEventListener("click", generateTeams);

document
    .getElementById("reshuffleBtn")
    .addEventListener("click", generateTeams);

document
    .getElementById("copyBtn")
    .addEventListener("click", copyTeams);

document
    .getElementById("clearBtn")
    .addEventListener("click", clearEverything);

updateCount();