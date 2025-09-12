# QuizCraft Frontend

This is the frontend for **QuizCraft**, a magical quiz platform inspired by the wizarding world. Built with React and Vite, it provides an interactive, visually enchanting experience for users to take quizzes, view leaderboards, and create their own magical scrolls.

## Features

- 🧙‍♂️ Wizard-themed UI with spell effects and animations
- 🔐 User authentication (login, signup)
- 📚 Take quizzes and view results
- 📝 Create and edit quizzes and questions
- 🏆 Leaderboards and user profiles
- 🎨 Responsive design for desktop and mobile
- ✨ Custom animated components (Runes, Fireflies, LiquidEther, etc.)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update the backend URL:
     ```
     VITE_BACKEND_URL=http://localhost:5000
     ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Project Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and SVGs
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-based pages
│   ├── styles/            # CSS files
│   └── main.jsx           # Entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── README.md              # This file
└── .env                   # Environment variables
```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## Customization

- **Styling:** Uses Tailwind CSS and custom animations.
- **Fonts:** Includes magical fonts via Google Fonts.
- **Environment:** Set `VITE_BACKEND_URL` in `.env` to match your backend.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.

---

For backend setup and API documentation, see [../backend/README.md](../backend/README.md)
