# Sudoku React Game

A modern, responsive Sudoku game built with React, featuring user authentication, game progress tracking, and a beautiful UI. Play Sudoku on any device with a clean, intuitive interface.

![Sudoku Game Screenshot]
*(Add a screenshot of your game here)*

## Features

- 🎮 Modern, responsive game interface
- 🔐 User authentication and profiles
- 📊 Game progress tracking
- 💡 Hint system (3 hints per game)
- 🎯 Real-time validation
- 📱 Mobile-optimized design
- 🌓 Clean, modern UI
- 🔄 New game generation
- 📈 Statistics tracking

## Tech Stack

- React
- Firebase (Authentication & Firestore)
- Framer Motion (Animations)
- TailwindCSS
- Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sudoku-react.git
cd sudoku-react
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Building for Production

To create a production build:
```bash
npm run build
# or
yarn build
```

## Game Features

### User Authentication
- Email/password authentication
- User profile management
- Secure authentication flow

### Game Mechanics
- Random puzzle generation
- Valid puzzle guarantee
- Real-time move validation
- Hint system (3 hints per game)
- Game progress saving

### User Interface
- Responsive grid layout
- Touch-friendly controls
- Keyboard input support
- Visual feedback for moves
- Error highlighting
- Progress tracking

### Statistics
- Games played tracking
- Win rate calculation
- Game duration tracking
- Hint usage tracking

## Deployment

The game is configured for deployment on Vercel with the following features:
- Client-side routing support
- Environment variable management
- Optimized build settings

### Vercel Configuration
The project includes a `vercel.json` configuration file to handle client-side routing:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Sudoku puzzle generation algorithm
- React community
- Firebase team
- TailwindCSS team
- Framer Motion team

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/sudoku-react](https://github.com/yourusername/sudoku-react)

---

Made with ❤️ using React and Firebase
