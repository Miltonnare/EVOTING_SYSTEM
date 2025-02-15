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
        <nav>
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
    <div  class="Container">
        <h3>LOGIN TO VOTE</h3>
        <form action="login.php" id="loginForm">
            <label for="UserName">UserName</label>
            <input type="text" placeholder="Enter your name" id="names" required>
            <label for="Email">Email</label>
            <input type="email"placeholder="Enter registered email" id="email" required>
            <label for="Password">Password</label>
            <input type="password" placeholder="Enter password" id="password" required>
            <button type="submit" class="submitButton">LOGIN</button>
        </form>

    </div>
    <script src="login.js"></script>
</body>
</html>