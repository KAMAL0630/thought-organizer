

# 🧠 Thought Organizer

**Thought Organizer** is a web-based application designed to help users organize and visualize their thoughts in a structured, hierarchical tree format. It's built using Angular and D3.js for dynamic visualizations and leverages MongoDB for persistent storage of user data and thought structures. 

## ✨ Features

- **Login System**: Secure authentication using JWT (JSON Web Tokens). Users log in with credentials stored in MongoDB.
- **Thought Management**:
  - Add, edit, delete, and link thoughts to create a dynamic thought map.
  - Visualize the relationships between thoughts in a hierarchical tree structure using D3.js.
- **Responsive & Modern UI**:
  - Designed using **Bootstrap** for aesthetics and responsive layouts.
  - Login form positioned at the center of the page for a clean, modern look.
  - Logout button at the top-right for easy access.

## 🛠️ Tech Stack

### Frontend
- **Angular** (Standalone Components)
- **D3.js** (Tree Visualization)
- **Bootstrap** (UI Styling)

### Backend
- **Node.js & Express.js** (REST API)
- **MongoDB** (Database for users and thought structures)
- **Bcrypt.js** (Password hashing)
- **JWT** (Session management)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** (locally or cloud-based)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KAMAL0630/thought-organizer.git
   cd thought-organizer
   ```

2. **Backend Setup**:
   - Navigate to the backend folder:
     ```bash
     cd thought-organizer-backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start MongoDB locally:
     ```bash
     mongod
     ```
   - Launch the backend server:
     ```bash
     node server.js
     ```

3. **Frontend Setup**:
   - Navigate to the frontend folder:
     ```bash
     cd thought-organizer
     ```
   - Install Angular dependencies:
     ```bash
     npm install
     ```
   - Run the Angular app:
     ```bash
     ng serve
     ```

4. **Access the Application**:
   - Open your browser and visit: `http://localhost:4200`

---

## 📂 Project Structure

- **Frontend**: Angular app handling the UI, visualizations, and user interactions.
- **Backend**: Node.js Express server managing authentication and thought data.
- **MongoDB**: Stores user credentials and the hierarchical thought structures.

### Key Files

#### Frontend
- `thought-organizer.component.ts`: Core logic for managing thoughts.
- `thought.service.ts`: Handles communication with the backend API.
- `login.component.ts`: Login form for authentication.

#### Backend
- `server.js`: Main entry point for the Express server.

---

## 💻 Usage

1. **Login**:
   - Start by logging in with valid credentials. (Make sure the MongoDB database has valid users.)
   
2. **Manage Thoughts**:
   - Once logged in, you can create, edit, or delete thoughts. Link them to visualize relationships using dashed lines.
   
3. **Logout**:
   - A logout button on the top-right corner will redirect you back to the login page.

---

## 🛠️ Development

### Setup MongoDB

To set up the database, run MongoDB and use the following commands to create a database and add a user:

```bash
use thoughtOrganizerDB
db.users.insert({
  username: 'testuser',
  password: '<hashed_password>'
})

```

---



## 🐞 Troubleshooting

- **Authentication Issues**: Ensure that the MongoDB server is running, and user credentials are correct.
- **Connection Issues**: Check that the frontend and backend are properly connected. The backend should run on port `5000` and be accessible at `http://localhost:5000`.
- **Visualization Errors**: Ensure that the D3.js library is correctly integrated and that the thought data structure is valid.

---



## 📧 Contact

- **Email**: rajkamal77995@gmail.com
- **GitHub**: [KAMAL0630](https://github.com/KAMAL0630)

---

