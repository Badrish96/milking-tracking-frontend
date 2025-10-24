# Animal Milking Tracking System

A full-stack application for tracking and managing animal milking sessions with real-time monitoring and historical data analysis.

## 🚀 Features

- Real-time milking session tracking
- Session duration monitoring
- Milk quantity recording
- Historical data visualization
- Pagination for session history
- Background music during milking sessions
- Offline support with IndexedDB

## 🛠️ Tech Stack

### Frontend
- Next.js 13+ (App Router)
- TypeScript
- Zustand for state management
- Tailwind CSS for styling
- Axios for API calls
- IndexedDB for offline storage

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Badrish96/milking-tracking.git
cd milking-tracking
```

2. Install dependencies:

For Frontend:
```bash
cd milking-tracking
npm install
```

For Backend:
```bash
cd server
npm install
```

3. Environment Setup:

Create `.env` files in both frontend and backend directories:

Frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Backend `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## 🚀 Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd milking-tracking
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

## 📱 API Endpoints

### Sessions

- `GET /api/sessions` - Get all milking sessions (with pagination)
- `POST /api/sessions` - Create a new milking session

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.