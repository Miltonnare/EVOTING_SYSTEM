const form = document.getElementById('form');
const button = document.getElementById('submitButton');

form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default only when needed
    console.log("Form submitted");

    const names = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();

    // Validation
    if (password !== confirmPassword) {
        alert("Enter the Correct Password");
        return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
        alert("Enter a valid 10-digit phone number");
        return;
    }

    // Form data object
    const formData = { names, email, password, phoneNumber };

    fetch('register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Registration Successful");
            window.location.href = 'loginhtml.php';
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.log("Error:", error);
    });
});
