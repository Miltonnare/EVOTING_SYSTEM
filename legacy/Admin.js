document.addEventListener("DOMContentLoaded", function () {
    fetchCandidates();
    fetchVotes();
    fetchElectionStatus();

    // Add Candidate
    document.getElementById("addCandidateBtn").addEventListener("click", function () {
        const name = prompt("Enter Candidate Name:");
        const party = prompt("Enter Candidate Party:");

        if (name && party) {
            const formData = new FormData();
            formData.append("addCandidate", true);
            formData.append("name", name);
            formData.append("party", party);

            fetch("Admin.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                fetchCandidates();
            });
        }
    });

    // Fetch Candidates
    function fetchCandidates() {
        fetch("Admin.php?fetchCandidates=true")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const candidateList = document.getElementById("candidateList");
                    candidateList.innerHTML = "";

                    data.candidates.forEach(candidate => {
                        const div = document.createElement("div");
                        div.className = "candidate-item";
                        div.innerHTML = `
                            <p>${candidate.name} (${candidate.party})</p>
                            <button class="deleteBtn" data-id="${candidate.candidate_id}">Delete</button>
                        `;
                        candidateList.appendChild(div);
                    });

                    // Delete Candidate
                    document.querySelectorAll(".deleteBtn").forEach(btn => {
                        btn.addEventListener("click", function () {
                            const candidate_id = this.getAttribute("data-id");

                            const formData = new FormData();
                            formData.append("deleteCandidate", true);
                            formData.append("candidate_id", candidate_id);

                            fetch("Admin.php", {
                                method: "POST",
                                body: formData
                            })
                            .then(res => res.json())
                            .then(data => {
                                alert(data.message);
                                fetchCandidates();
                            });
                        });
                    });
                }
            });
    }

    // Fetch Vote Data
    function fetchVotes() {
        fetch("Admin.php?fetchVotes=true")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const voteTable = document.getElementById("voteData");
                    voteTable.innerHTML = "";

                    data.voteData.forEach(vote => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${vote.name}</td>
                            <td>${vote.vote_count}</td>
                        `;
                        voteTable.appendChild(row);
                    });
                }
            });
    }

    // Fetch Election Status
    function fetchElectionStatus() {
        fetch("Admin.php?fetchElectionStatus=true")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("electionStatus").textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
                    document.getElementById("electionStatusSelect").value = data.status;
                }
            });
    }

    // Update Election Status
    document.getElementById("settingsForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const status = document.getElementById("electionStatusSelect").value;

        const formData = new FormData();
        formData.append("updateElectionStatus", true);
        formData.append("status", status);

        fetch("Admin.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            fetchElectionStatus();
        });
    });
});
