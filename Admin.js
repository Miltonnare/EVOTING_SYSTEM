document.addEventListener("DOMContentLoaded", function () {
    fetchCandidates();
    fetchVotes();
    fetchElectionStatus();
    updateDashboard();
    setInterval(updateDashboard, 10000); // Refresh every 10 seconds

    document.getElementById("addCandidateBtn").addEventListener("click", showAddCandidateModal);

    document.getElementById("electionStatusSelect").addEventListener("change", function () {
        updateElectionStatus(this.value);
    });
});

function showAddCandidateModal() {
    const formHtml = `
        <div class="modal-content">
            <h2>Add Candidate</h2>
            <form id="candidateForm">
                <label>Name:</label>
                <input type="text" id="candidateName" required><br>
                <label>Party:</label>
                <input type="text" id="candidateParty" required><br>
                <label>Category:</label>
                <input type="text" id="candidateCategory" required><br>
                <label>Image:</label>
                <input type="file" id="candidateImage" accept="image/*"><br>
                <button type="submit">Submit</button>
                <button type="button" id="closeModal">Cancel</button>
            </form>
        </div>
    `;

    let modal = document.getElementById("candidateModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "candidateModal";
        modal.classList.add("modal");
        document.body.appendChild(modal);
    }
    modal.innerHTML = formHtml;
    modal.style.display = "block";

    document.getElementById("closeModal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    document.getElementById("candidateForm").addEventListener("submit", function (e) {
        e.preventDefault();
        addCandidate(modal);
    });
}

function addCandidate(modal) {
    const name = document.getElementById("candidateName").value.trim();
    const party = document.getElementById("candidateParty").value.trim();
    const category = document.getElementById("candidateCategory").value.trim();
    const image = document.getElementById("candidateImage").files[0];

    if (!name || !party || !category) {
        alert("All fields are required!");
        return;
    }

    const formData = new FormData();
    formData.append("addCandidate", 1);
    formData.append("name", name);
    formData.append("party", party);
    formData.append("category", category);
    if (image) {
        formData.append("image", image);
    }

    fetch("Admin.php", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                fetchCandidates();
                updateDashboard();
                modal.style.display = "none";
            }
        })
        .catch(err => console.error("Error adding candidate:", err));
}

function fetchCandidates() {
    fetch("Admin.php?fetchCandidates=true")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const candidateList = document.getElementById("candidateList");
                candidateList.innerHTML = "";
                data.candidates.forEach(candidate => {
                    candidateList.innerHTML += `
                        <div class="candidate-item">
                            <img src="${candidate.image_url}" alt="${candidate.name}" class="candidate-img">
                            <p>${candidate.name} (${candidate.party}) - ${candidate.category}</p>
                            <button class="deleteBtn" data-id="${candidate.candidate_id}">Delete</button>
                        </div>
                    `;
                });

                document.querySelectorAll(".deleteBtn").forEach(btn => {
                    btn.addEventListener("click", function () {
                        deleteCandidate(this.getAttribute("data-id"));
                    });
                });
            }
        })
        .catch(err => console.error("Error fetching candidates:", err));
}

function deleteCandidate(candidate_id) {
    if (!confirm("Are you sure you want to delete this candidate?")) return;

    fetch(`Admin.php?deleteCandidate=${candidate_id}`, { method: "GET" })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                fetchCandidates();
                updateDashboard();
            }
        })
        .catch(err => console.error("Error deleting candidate:", err));
}

function fetchElectionStatus() {
    fetch("Admin.php?fetchElectionStatus=true")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("electionStatusSelect").value = data.electionStatus;
            }
        })
        .catch(err => console.error("Error fetching election status:", err));
}

function updateElectionStatus(status) {
    fetch("Admin.php", {
        method: "POST",
        body: new URLSearchParams({ updateElectionStatus: 1, status }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            fetchElectionStatus();
            updateDashboard();
        }
    })
    .catch(err => console.error("Error updating election status:", err));
}

function fetchVotes() {
    fetch("Admin.php?fetchVotes=true")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("totalVotes").textContent = data.totalVotes;
            }
        })
        .catch(err => console.error("Error fetching votes:", err));
}

function updateDashboard() {
    fetch("Admin.php?fetchDashboard=true")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("totalVotes").textContent = data.totalVotes;
                document.getElementById("electionStatus").textContent = data.electionStatus;
                document.getElementById("candidateCount").textContent = data.candidateCount;
            }
        })
        .catch(err => console.error("Error fetching dashboard data:", err));
}
