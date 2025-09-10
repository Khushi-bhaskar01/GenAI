# NEXTskill Frontend

A modern web application built with React, TypeScript, and Firebase for skill assessment and monitoring.

## Features

- User Authentication (Login/Signup)
- Dashboard Interface
- Skill Assessment System
- Resume Builder
- Skill Monitoring
- Career Roadmap
- Team Connection

## Tech Stack

- React with TypeScript
- Vite as build tool
- Firebase Authentication and Firestore
- Custom UI Components

## Project Structure

```
src/
├── assets/        # Static assets and data
├── components/    # Reusable UI components
├── context/       # React context providers
├── firebase/      # Firebase configuration
├── lib/           # Utility functions
├── pages/         # Main application pages
└── services/      # API and service layer
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Main Components

- `Layout.tsx`: Main layout wrapper with navigation
- `Navbar.tsx`: Navigation bar for authenticated users
- `NavbarLogin.tsx`: Navigation bar for non-authenticated users
- `Dashboard.tsx`: User dashboard interface
- `ProtectedRoute.tsx`: Route protection for authenticated pages

## Authentication

The application uses Firebase Authentication for user management. The `authContext.tsx` provides authentication state and methods throughout the application.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
