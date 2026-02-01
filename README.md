A full-stack Expense Tracker app with React as frontend and Flask as backend. Features JWT authentication, expense CRUD, and category charts.

Tech Stack
React, React Router, Axios, Chart.js

Flask, JWT, SQLAlchemy, SQLite

Setup
Backend
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Add .env with SECRET_KEY, JWT_SECRET_KEY, DATABASE_URL=sqlite:///db.sqlite3
flask run
Frontend
bash
Copy
Edit
cd frontend
npm install
# Add .env with REACT_APP_BASE_API_URL=http://localhost:5000
npm start
GitHub Workflow
bash
Copy
Edit
git pull origin main --rebase
git add .
git commit -m "Your message"
git push origin main
Notes
Backend runs on port 5000

Frontend runs on port 3000

Use .gitignore to avoid staging unwanted files
