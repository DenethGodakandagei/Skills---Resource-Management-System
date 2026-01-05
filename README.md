##  Author

**Name:** Deneth Godakandagei  

**Portfolio:** https://deneth.site 
**GitHub:** https://github.com/DenethGodakandagei
**Email** contact.deneth@gmail.com

# Consultancy Management System

A full-stack web application designed to manage personnel, skills, projects, and intelligent skill-based personnel matching for a consultancy company.  
The system helps project managers efficiently assign the right people to the right projects based on skills, proficiency levels, and availability.

---

## 🚀 Features

- Manage personnel (Create, Read, Update, Delete)
- Manage skills and proficiency levels
- Assign skills to personnel
- Create and manage projects
- Define project skill requirements
- Skill-based personnel matching algorithm
- Assign personnel to projects
- Modern responsive UI using Tailwind CSS

---

## 🛠 Technology Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MySQL
- REST API architecture

### Tools
- Postman (API testing)
- Git & GitHub

---

## 📦 Prerequisites

Make sure you have the following installed:

- **Node.js** ^24.10.1 
- **npm** ^25.0.3 

---

## ⚙️ Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE consultancy_db;

2. Run the provided SQL schema file to create tables:

personnel

skills

personnel_skills

projects

project_requirements

project_assignments


## ENV File setup 

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=consultancy_db

# Start the backend server

cd backend
npm install
npm run dev

# Start the frontend server

cd frontend
npm install
npm run dev


## Additional Feature – Personnel Assignment to Projects

### Problem
In real consultancy environments, personnel cannot be assigned to multiple active projects at the same time.  
Without availability checks, employees can be over-allocated, causing delays and burnout.

### Solution
This system introduces availability assign  after project assignment: