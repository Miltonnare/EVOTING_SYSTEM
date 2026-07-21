document.getElementById("voteForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const categories = ["president", "governor", "senator"]; // Add more categories if needed
    let votes = {};
    let missingCategory = null;

    for (let category of categories) {
        const selectedCandidate = document.querySelector(`input[name="${category}"]:checked`);

        if (!selectedCandidate) {
            missingCategory = category;
            break; // Stop checking if a category is missing
        }

        votes[category] = parseInt(selectedCandidate.value, 10);
    }

    // If a category is missing, alert the user and stop the function
    if (missingCategory) {
        alert(`Please select a candidate for ${missingCategory} before voting.`);
        return;
    }

    console.log("Sending JSON:", JSON.stringify(votes)); // Debugging

    try {
        const response = await fetch("vote.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({votes})
        });

        const text = await response.text();
        console.log("Raw Response:", text); // Debugging

        try {
            const result = JSON.parse(text);
            if (result.success) {
                document.getElementById("confirmationMessage").style.display = "block";
                document.getElementById("confirmationMessage").innerHTML = `<h3>Thank you for voting!</h3><p>${result.message}</p>`;
            } else {
                alert(result.message);
            }
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            alert("Server returned an invalid response.");
        }
    } catch (error) {
        console.error("Voting error:", error);
        alert("An error occurred. Please try again.");
    }
});
