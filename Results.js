document.addEventListener("DOMContentLoaded", async function () {
    const resultsTableBody = document.getElementById("resultsTableBody");
    const ctx = document.getElementById("resultsChart").getContext("2d");

    try {
        const response = await fetch("Results.php");
        const data = await response.json();

        console.log("Election Data Received:", data);

        if (!data.success || !data.categories || Object.keys(data.categories).length === 0) {
            resultsTableBody.innerHTML = `<tr><td colspan="4">${data.message || "No election results available."}</td></tr>`;
            return;
        }

        resultsTableBody.innerHTML = ""; // Clear existing table

        let labels = [];
        let votes = [];
        let backgroundColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFC300"];

        Object.keys(data.categories).forEach((category, catIndex) => {
            // Add category as a table row header
            const categoryRow = document.createElement("tr");
            categoryRow.innerHTML = `<td colspan="4" style="background-color: #004080; color: #fff; font-weight: bold; text-align: center;">
                ${category.toUpperCase()}
            </td>`;
            resultsTableBody.appendChild(categoryRow);

            // Loop through candidates in the category
            data.categories[category].forEach((candidate, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${candidate.name}</td>
                    <td>${candidate.party}</td>
                    <td>${candidate.vote_count}</td>
                    <td>${candidate.percentage}%</td>
                `;
                row.style.backgroundColor = index % 2 === 0 ? "#1A237E" : "#283593";
                row.style.color = "#003366";
                resultsTableBody.appendChild(row);

                // Store data for the chart
                labels.push(`${candidate.name} (${category})`);
                votes.push(candidate.vote_count);
            });
        });

        // Initialize Chart.js
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Votes",
                    data: votes,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace("FF", "DD")),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Votes" }
                    },
                    x: {
                        title: { display: true, text: "Candidates" }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error fetching results:", error);
        resultsTableBody.innerHTML = `<tr><td colspan="4" style="color: red;">Failed to load results. Please try again later.</td></tr>`;
    }
});
