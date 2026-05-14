# SB Works - Freelancer Marketplace 🚀

SB Works is a comprehensive, full-stack Freelancer Marketplace platform designed to connect talented freelancers with clients. The platform features a robust bidding system, real-time status updates, and a powerful administrative dashboard to manage the entire ecosystem.

---

## 🌟 Key Features

### 👤 User Roles
- **Freelancer**: Can browse projects, place bids (proposals), manage active projects, and track earnings.
- **Client**: Can post new projects, review bids from freelancers, hire talent, and manage project workflows.
- **Admin**: Has full visibility of all users, projects, and applications. Admins can manage users and clean up the database by deleting invalid entries.

### 🛠 Core Functionalities
- **Real-Time Bidding**: Freelancers can submit proposals with custom bid amounts and estimated delivery times.
- **Project Lifecycle Management**: Projects transition through states: `Available` -> `Assigned` -> `Completed`.
- **Dynamic Dashboard**: Personalized dashboards for each role with real-time statistics (Current Projects, Completed Projects, Funds, etc.).
- **Smart Filters**: Advanced filtering for projects based on skills and categories.
- **Profile Management**: Users can update their professional summary and skill sets.
- **Secure Authentication**: JWT-based authentication with role-based access control (RBAC).

---

## 💻 Tech Stack

### Frontend
- **React.js**: Modern UI components and hooks.
- **Context API**: Global state management (GeneralContext).
- **React Router**: Client-side routing.
- **Axios**: API communication with interceptors for auth tokens.
- **Vanilla CSS**: Premium, dark-themed design system.

### Backend
- **Node.js & Express**: High-performance server environment.
- **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
- **Socket.io**: Real-time communication (Chat and notifications).
- **Bcrypt.js**: Secure password hashing.
- **JWT**: Token-based authentication and security.

### DevOps & Tools
- **Docker**: Containerized environment for consistent development and deployment.
- **GitHub Actions**: Automated CI/CD pipeline for testing and deployment to Docker Hub.
- **Vitest**: Modern testing framework for backend services and controllers.

---

## 📂 Project Structure

```text
freelancer-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global State Management
│   │   ├── pages/          # Role-specific pages (Admin, Client, Freelancer)
│   │   └── styles/         # Detailed CSS Design System
│   └── public/
├── server/                 # Node.js Backend
│   ├── controllers/        # Request handling logic
│   ├── models/             # Mongoose Schemas (User, Project, Application)
│   ├── routes/             # API Endpoints
│   ├── services/           # Business logic layer
│   ├── middleware/         # Auth and Security guards
│   └── tests/              # Vitest Integration Tests
└── docker-compose.yml       # Multi-container orchestration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account or Local MongoDB
- Docker (Optional, for containerized setup)

### Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/poojasingh5555/freelancer.git
   cd freelancer-app
   ```

2. **Backend Configuration**
   - Create a `.env` file in the `server/` directory:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     PORT=6001
     ```
   - Install dependencies and start:
     ```bash
     cd server
     npm install
     npm run dev
     ```

3. **Frontend Configuration**
   - Create a `.env` file in the `client/` directory:
     ```env
     REACT_APP_API_URL=http://localhost:6001/
     ```
   - Install dependencies and start:
     ```bash
     cd client
     npm install
     npm start
     ```

### Docker Setup
Run the entire stack with one command:
```bash
docker-compose up --build
```

---

## 🧪 Testing
The project uses **Vitest** for backend integration testing.
```bash
cd server
npm test
```
Tests cover:
- User Registration & Login
- Project Creation & Bidding
- Admin Privileges
- Application Status Updates

---

## 🛡 Security Features
- **JWT Protection**: All sensitive routes are protected by a `protect` middleware.
- **Role-Based Guards**: Ensuring Clients cannot access Admin tools and vice-versa.
- **Data Sanitization**: Mongoose schemas ensure data integrity.
- **Environment Isolation**: Sensitive keys are never hardcoded and are managed via `.env`.

---

## 📝 Recent Updates
- ✅ **Admin Dashboard**: Enhanced with User and Application deletion capabilities.
- ✅ **Data Population**: Fixed missing Client/Freelancer details in the bidding view.
- ✅ **UI Optimization**: Made dashboard cards fully clickable for better UX.
- ✅ **Registration**: Enabled Admin role selection for development/testing purposes.

---

## 🤝 Contributing
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

Developed  by Pooja Sing
