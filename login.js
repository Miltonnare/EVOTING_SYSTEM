document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  

    try {
        const response = await fetch("login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            alert("Login successful!");
            window.location.href = "Votehtml.php"; 
        } else {
            alert(result.message);
        }
    } catch (error) {
       
        console.log("Login Error:", error);
    }
});
