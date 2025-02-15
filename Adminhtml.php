<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - E-VOTING SYSTEM</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="Admin.css">

</head>
<body>

    <header>
        <nav>
            <ul>
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#candidates">Manage Candidates</a></li>
                <li><a href="#votes">View Votes</a></li>
                <li><a href="#settings">Settings</a></li>
                <li><a href="#logout">Logout</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="dashboard">
            <h1>Admin Dashboard</h1>
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Votes Cast</h3>
                    <p id="totalVotes">500</p>
                </div>
                <div class="stat-card">
                    <h3>Ongoing Election</h3>
                    <p id="electionStatus">Open</p>
                </div>
                <div class="stat-card">
                    <h3>Registered Candidates</h3>
                    <p id="candidateCount">10</p>
                </div>
            </div>
        </section>

    
        <section id="candidates">
            <h2>Manage Candidates</h2>
            <button id="addCandidateBtn">Add New Candidate</button>
            <div id="candidateList">
               
            </div>
        </section>

      
        <section id="votes">
            <h2>Vote Tracking</h2>
            <table>
                <thead>
                    <tr>
                        <th>Candidate</th>
                        <th>Votes Received</th>
                    </tr>
                </thead>
                <tbody id="voteData">
                    <!-- Vote data will be dynamically populated -->
                </tbody>
            </table>
        </section>

      
        <section id="settings">
            <h2>Election Settings</h2>
            <form id="settingsForm">
                <label for="electionStatus">Election Status</label>
                <p id="electionStatus">Loading...</p>
                <select id="electionStatusSelect">
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
                <button type="submit">Update Status</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 E-Voting System</p>
    </footer>

    
    <script src="admin.js"></script>
</body>
</html>
