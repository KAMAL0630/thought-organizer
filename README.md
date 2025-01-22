

---

# 🧠 Thought Organizer

**Thought Organizer** is a web-based application designed to help users organize and visualize their thoughts in a structured, hierarchical tree format. Built using Angular and D3.js for dynamic visualizations, this app leverages MongoDB for persistent storage of user data and thought structures.

## ✨ Features

- **Authentication System**:
  - Secure login with JWT (JSON Web Tokens).
  - User registration option that creates an account and initializes a default thought structure in MongoDB if no previous data exists.
- **Thought Management**:
  - Add, edit, delete, and link thoughts to create a dynamic thought map.
  - Visualize relationships between thoughts in a hierarchical tree structure using D3.js.
- **Responsive & Modern UI**:
  - Aesthetic design with **Bootstrap** for responsive layouts.
  - Centered login and registration forms with modern styling.
  - Logout button in the top-right corner for easy access.

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
- **Backend**: Node.js Express server managing authentication, registration, and thought data.
- **MongoDB**: Stores user credentials and the hierarchical thought structures.

### Key Files

#### Frontend
- `thought-organizer.component.ts`: Core logic for managing thoughts.
- `thought.service.ts`: Manages interactions with the backend API.
- `login.component.ts`: Login form for authentication.
- `register.component.ts`: Registration form for creating new user accounts.

#### Backend
- `server.js`: Main entry point for the Express server.

---

## 💻 Usage

1. **Register**:
   - If you don’t have an account, click on the **Sign Up** link on the login page to create a new account.
   - Upon registration, a default thought structure is created in the database if one does not already exist for the user.

2. **Login**:
   - Log in with valid credentials (MongoDB should contain registered users).
   
3. **Manage Thoughts**:
   - Once logged in, you can create, edit, or delete thoughts. You can also link them to visualize relationships using dashed lines.
   
4. **Logout**:
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

- **Authentication Issues**: Ensure that MongoDB is running and user credentials are correct.
- **Connection Issues**: Confirm that the frontend and backend are connected. The backend should run on port `5000` and be accessible at `http://localhost:5000`.
- **Visualization Errors**: Check that D3.js is correctly integrated and that the thought data structure is valid.

---

## 📧 Contact

- **Email**: rajkamal77995@gmail.com
- **GitHub**: [KAMAL0630](https://github.com/KAMAL0630)

--- 

Let me know if you'd like any more modifications!
