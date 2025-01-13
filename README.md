# Itinerary Generator Frontend

Next.js frontend application for generating and viewing personalized travel itineraries.

## Features

- Modern UI with Tailwind CSS
- Real-time itinerary generation
- Interactive timeline view
- Weather integration
- Transport suggestions
- Event recommendations

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run linter

## Deployment

This frontend is configured for deployment on Vercel. The production environment variables should be configured in the Vercel dashboard.
