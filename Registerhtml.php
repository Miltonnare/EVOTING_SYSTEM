<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="Register.css">
    <title>E-VOTING SYSTEM</title>
</head>
<body>
    <header>
        <nav aria-label="Main navigation">
            <ul>
                <li><a href="./Home.html">HOME</a></li>
                <li><a href="#register">REGISTER</a></li>
                <li><a href="#login">LOGIN</a></li>
                <li><a href="#vote">VOTE</a></li>
                <li><a href="#news">NEWS</a></li>
                <li><a href="#results">RESULTS</a></li>
                <li><a href="#contact">CONTACT US</a></li>
                <li><a href="#admin">ADMIN</a></li>
                <li><a href="#settings">SETTINGS</a></li>
            </ul>
        </nav>
        </header>
        <div class="Container">
            <h3>REGISTERATION ONGOING</h3>
            <form action="register.php" id="form" >
                <label for="">NAMES</label>
                <input type="text" placeholder="Enter official names" id="name"required>
                <label for="">EMAIL</label>
                <input type="email" placeholder="Enter email" id="email"required>
                <label for="">PASSWORD</label>
                <input type="password" placeholder="Enter strong password" id="password" required>
                <label for="">CONFIRM PASSWORD</label>
                <input type="password" placeholder="confirm password" id="confirmPassword"required>
                <label for="">Phone Number</label>
                <input type="number" name="" id="phoneNumber" placeholder="phone number" required>
                <button type="submit" class="submitButton" id="submitButton">REGISTER</button>

            </form>
        </div>
        <script src="Register.js"></script>
</body>
</html>