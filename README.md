E-Voting System 🗳️
A secure, web-based E-Voting System that allows users to cast their votes electronically for different election categories. The system ensures one vote per category per user, validates votes, and securely stores them in a database.

📌 Features

✔ User Authentication – Secure login required to vote.
✔ Vote Casting – Users can vote for multiple categories (e.g., President, Governor, Senator).
✔ Vote Validation – Ensures a user does not vote twice in the same category.
✔ Database Integration – Votes are stored in a MySQL database.
✔ Foreign Key Constraints – Ensures referential integrity between users, votes, and candidates.

🛠️ Technologies Used

Frontend: HTML, CSS, JavaScript
Backend: PHP
Database: MySQL
Server: Apache (XAMPP)
📂 Database Schema
Users Table (users)
Column	Type	Attributes
id	INT	PRIMARY KEY, AUTO_INCREMENT
first_name	VARCHAR(50)	NOT NULL
last_name	VARCHAR(50)	NOT NULL
email	VARCHAR(100)	UNIQUE, NOT NULL
password_hash	VARCHAR(255)	NOT NULL
Candidates Table (candidates)
Column	Type	Attributes
candidate_id	INT	PRIMARY KEY, AUTO_INCREMENT
name	VARCHAR(100)	NOT NULL
category	ENUM('president', 'governor', 'senator')	NOT NULL
Votes Table (votes)
Column	Type	Attributes
vote_id	INT	PRIMARY KEY, AUTO_INCREMENT
user_id	INT	FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE
category	ENUM('president', 'governor', 'senator')	NOT NULL
candidate_id	INT	FOREIGN KEY REFERENCES candidates(candidate_id) ON DELETE CASCADE

🔧 Installation & Setup

1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/e-voting-system.git
cd e-voting-system

2️⃣ Setup Database
Import database.sql into MySQL.
Update database credentials in Database.php.
3️⃣ Start Apache & MySQL (XAMPP/WAMP)
4️⃣ Run the Project
Place the project folder in the htdocs directory of XAMPP, then open:

bash
Copy
Edit
http://localhost/VotingSystemProject

🚀 How It Works

1️⃣ User logs in to vote.
2️⃣ Selects a candidate in each category.
3️⃣ Votes are validated & stored in the database.
4️⃣ User cannot vote twice in the same category.

📌 To-Do / Future Improvements  
  
✅ Admin panel for vote management.
✅ Real-time voting statistics.
✅ Enhanced security features.


🙌 Contributors
👤 MILTON - Project Developer
👤 
