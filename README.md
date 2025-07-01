# Service Hub

A full-stack web app to connect customers with local service providers (plumbers, electricians, painters, etc.).

## How to Run

**1. Install backend**
- Go to `servicehub-backend` folder
- Open terminal (or CMD) here
- Run:
    python -m venv venv
    venv\Scripts\activate  (or `source venv/bin/activate` on Mac)
    pip install -r requirements.txt
    python create_db.py  (make sure you created a MySQL schema named `servicehub`)
    python server.py

**2. Install frontend**
- Go to `servicehub-frontend` folder
- Open terminal/CMD here
- Run:
    npm install
    npm start
- Open browser at `http://localhost:3000/`

## Documentation

- Full details in: `Final_Project_Documentation_Group_14.docx`
