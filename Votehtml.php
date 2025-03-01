<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="Vote.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <title>E-VOTING SYSTEM</title>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="./Home.html">HOME</a></li>
                <li><a href="./Register.html">REGISTER</a></li>
                <li><a href="./login.html">LOGIN</a></li>
                <li><a href="#Votehtml.php">VOTE</a></li>
                <li><a href="./News.html">NEWS</a></li>
                <li><a href="./Resultshtml.php">RESULTS</a></li>
                <li><a href="#contact">CONTACT US</a></li>
                <li><a href="#admin">ADMIN</a></li>
                <li><a href="#settings">SETTINGS</a></li>
            </ul>
        </nav>
    </header>

    <section id="vote">
        <h1>Cast Your Vote</h1>
        <p>Please select your preferred candidates for each position and submit your vote.</p>

        <form id="voteForm" action="vote.php" method="POST">

            <!-- PRESIDENTIAL ASPIRANTS -->
            <div class="category">
                <h2>Presidential Candidates</h2>
                <div class="candidate-option">
                    <input type="radio" id="president1" name="president" value="4" required>
                    <label for="president1">
                        <img src="VOTING/ruto.jpg" alt="Candidate 1">
                        <span>WILLIAM RUTO</span>
                        <span>Party: CCP</span>
                    </label>
                </div>

                <div class="candidate-option">
                    <input type="radio" id="president2" name="president" value="5" required>
                    <label for="president2">
                        <img src="VOTING/raila.jpg" alt="Candidate 2">
                        <span>RAILA ODINGA</span>
                        <span>Party: CEA</span>
                    </label>
                </div>
            </div>

            <!-- GOVERNOR ASPIRANTS -->
            <div class="category">
                <h2>Governor Candidates</h2>
                <div class="candidate-option">
                    <input type="radio" id="governor1" name="governor" value="6" required>
                    <label for="governor1">
                        <img src="VOTING/susan.jpeg" alt="Candidate 1">
                        <span>SUSAN KIHIKA</span>
                        <span>Party: TIP</span>
                    </label>
                </div>

                <div class="candidate-option">
                    <input type="radio" id="governor2" name="governor" value="7" required>
                    <label for="governor2">
                        <img src="VOTING/Babu.jpeg" alt="Candidate 2">
                        <span>BABU OWINO</span>
                        <span>Party: PNP</span>
                    </label>
                </div>
            </div>

            <!-- SENATOR ASPIRANTS -->
            <div class="category">
                <h2>Senatorial Candidates</h2>
                <div class="candidate-option">
                    <input type="radio" id="senator1" name="senator" value="8" required>
                    <label for="senator1">
                        <img src="VOTING/sonko.jpeg" alt="Candidate 1">
                        <span>MIKE SONKO</span>
                        <span>Party: UDP</span>
                    </label>
                </div>

                <div class="candidate-option">
                    <input type="radio" id="senator2" name="senator" value="9" required>
                    <label for="senator2">
                        <img src="VOTING/sifuna.jpeg" alt="Candidate 2">
                        <span>EDWIN SIFUNA</span>
                        <span>Party: KDP</span>
                    </label>
                </div>
            </div>

            <!-- SUBMIT BUTTON -->
            <button type="submit" id="submitVote">Submit Vote</button>
        </form>

        <div id="confirmationMessage" style="display: none;">
            <h3>Thank You for Voting!</h3>
            <p>Your vote has been successfully submitted.</p>
        </div>
    </section>

    <footer>
        <div>
            <p>Voting is your right. Remember to vote wisely!</p>
            <p>&copy; 2025</p>
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

    <script src="vote.js"></script>
</body>
</html>
