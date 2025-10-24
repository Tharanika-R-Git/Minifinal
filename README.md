# Clonos Dashboard Platform

A modern, interactive dashboard builder with Chart.js integration, user authentication, and PostgreSQL backend.

## Features

- 🎨 **Attractive UI** - Modern glassmorphism design with smooth animations
- 📊 **Chart.js Integration** - Interactive charts (Bar, Line, Pie, Doughnut, Radar, Scatter)
- 🔐 **Authentication** - Secure signup/login with JWT tokens
- 🗄️ **PostgreSQL Database** - Reliable data storage
- 📱 **Responsive Design** - Works on all devices
- 🎯 **Drag & Drop** - Intuitive dashboard builder
- 💾 **Save/Load** - Persistent dashboard storage

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup PostgreSQL:**
   - Create a database named `dashboard_builder`
   - Run the setup script: `psql -d dashboard_builder -f setup.sql`

3. **Configure environment:**
   - Update `.env` file with your database credentials
   - Change the JWT_SECRET for production

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Navigate to `http://localhost:5173`

## Usage

1. **Sign Up** - Create a new account
2. **Login** - Access your dashboard
3. **Build** - Add charts using the sidebar
4. **Customize** - Configure chart data and styling
5. **Save** - Store your dashboards

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Dashboards
- `GET /api/dashboards` - Get user dashboards
- `POST /api/dashboards` - Create dashboard
- `PUT /api/dashboards/:id` - Update dashboard
- `DELETE /api/dashboards/:id` - Delete dashboard

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Chart.js & react-chartjs-2
- React Router DOM
- React Grid Layout

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dashboard_builder
DB_USER=postgres
DB_PASSWORD=your_password

# Security
JWT_SECRET=your_jwt_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details