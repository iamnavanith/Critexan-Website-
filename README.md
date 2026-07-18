# Critexan — Pre-Launch Gaming Platform Website

CRITEXAN™ is an upcoming all-in-one gaming and creator platform built to bring the entire gaming ecosystem together in one place. Whether you're a gamer, content creator, esports enthusiast, or community leader, CRITEXAN™ is designed to help you watch gaming videos, discover shorts, livestream gameplay, participate in tournaments, build communities, chat with friends, showcase your profile, and grow your audience through a modern, high-performance platform.

This pre-launch landing page focuses on the brand's vision, utilizing high-performance GSAP scroll triggers, gravity-defying interactive parallax animations, and futuristic typography.

---

## 🚀 Features

- **Futuristic Rebranding**: Customized with the official **Critexan** logo, typography, and styling.
- **Antigravity Interactive Parallax**: Floating SVG gaming elements (controller, headset, keyboard) that dynamically drift and react to your mouse cursor.
- **GSAP Scroll-Trigger Shape Morphing**: The main landing container smoothly morphs between rounded polygons and full-screen layouts on scroll.
- **Scroll Flyaway Physics**: Elements float up and off-screen at staggered intervals as the user scrolls, creating a unique gravity-defying theme.
- **Smart Adaptive Contrast Navbar**: The navigation bar automatically shifts links and logo elements between dark and light states to preserve perfect readability on any background.
- **Pre-Registration Portal**: Live portal for early adopters to secure their tags.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (TypeScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 (Vanilla CSS)
- **Animations**: GSAP (GreenSock Animation Platform) + `@gsap/react`
- **Typography**: Ethnocentric Rg & General Sans (via CDN Fonts), circular-web (local webfont)

---

## 📂 Folder Structure

```bash
game-website-main/
  |- public/
     |-- fonts/            # Local circular web fonts
     |-- img/              # Custom brand logo graphics & SVG monogram
  |- src/
     |-- components/       # Custom React interactive components (Hero, About, Pre-Registration, etc.)
     |-- constants/        # Mapped config files (Nav links)
     |-- lib/              # UI utilities
     |-- app.tsx           # Base layout wrapper
     |-- index.css         # Styling system & custom animations
     |-- main.tsx          # Application entry point
  |- index.html            # Main HTML document
  |- vite.config.ts        # Bundler configuration
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have **Node.js** installed on your system.

### Installation

1. Clone or extract the folder to your local machine.
2. Open your terminal in the root directory.
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the local hot-reloading development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### Production Build

To compile the production-ready optimized build:
```bash
npm run build
```
The output assets will be generated inside the `dist/` directory.
