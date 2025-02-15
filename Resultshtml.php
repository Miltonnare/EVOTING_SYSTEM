<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="Results.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <title>Election Results</title>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="./Home.html">HOME</a></li>
                <li><a href="./Register.html">REGISTER</a></li>
                <li><a href="./login.html">LOGIN</a></li>
                <li><a href="#vote">VOTE</a></li>
                <li><a href="#results">RESULTS</a></li>
                <li><a href="#contact">CONTACT US</a></li>
                <li><a href="#admin">ADMIN</a></li>
                <li><a href="#settings">SETTINGS</a></li>
            </ul>
        </nav>
    </header>

    <section id="results">
        <h1>Election Results</h1>
        <p>Here are the final results of the election.</p>

       
        <table id="resultsTable">
            <thead>
                <tr>
                    <th>Candidate</th>
                    <th>Party</th>
                    <th>Votes</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody id="resultsTableBody">
                
                
            </tbody>
        </table>

        <!-- Optional Graph (could use a chart library like Chart.js or a simple bar graph) -->
        <div id="voteGraph">
            <h2>Vote Distribution</h2>
            <canvas id="resultsChart"></canvas>
            <!-- Use a chart or visual representation here -->
        </div>
    </section>

    <footer>
        <div>
            <p>&copy; 2025 E-Voting System</p>
            <h3>Contact Us</h3>
            <p>You can find us on the following platforms:</p>
            <div class="social-icons">
                <a href="https://twitter.com" target="_blank" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
                <a href="https://facebook.com" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                <a href="https://whatsapp.com" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                <a href="https://instagram.com" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            </div>
        </div>
    </footer>
    <script src="Results.js"></script>
    
</body>
</html>
