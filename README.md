# Animal Milking Tracking System (Frontend)

A Next.js application for tracking and managing animal milking sessions with real-time monitoring and historical data analysis.

## 🚀 Features

- Real-time milking session tracking with timer
- Pause/Resume functionality
- Milk quantity recording
- Session history with pagination
- Calming background music during milking
- Offline support using IndexedDB
- Responsive design for all devices

## 🛠️ Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Zustand for state management
- Tailwind CSS for styling
- Axios for API communication
- IndexedDB for offline storage

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Badrish96/milking-tracking.git
cd milking-tracking
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
milking-tracking/
├── app/
│   ├── (pages)/
│   │   ├── history/
│   │   └── milking/
│   ├── components/
│   ├── services/
│   ├── store/
│   └── types/
├── public/
│   └── music/
├── styles/
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 💻 Usage

1. **Start Milking Session**
   - Click "Start Milking" to begin a new session
   - Timer starts automatically
   - Background music plays (if enabled)

2. **During Session**
   - Pause/Resume as needed
   - Monitor elapsed time
   - Stop session when complete

3. **End Session**
   - Enter milk quantity collected
   - Save session data
   - View in history

4. **View History**
   - Access past sessions
   - Navigate through pages
   - View session details

## 🔗 API Integration

The frontend communicates with the backend through these endpoints:

- `GET /api/sessions` - Fetch milking sessions (paginated)
- `POST /api/sessions` - Create new milking session
