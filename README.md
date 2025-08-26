# Ongea - Your AI Language Learning Companion

Ongea is a modern, AI-powered web application designed to help users learn new languages in an interactive and personalized way. It leverages generative AI to create dynamic learning materials, providing an engaging experience that goes beyond traditional methods.

## ✨ Key Features

-   **Multi-Language Support**: Choose from a wide range of spoken and learning languages to tailor your experience. Your selections are saved locally for convenience.
-   **AI-Generated Stories**: Generate beginner-friendly short stories on any topic in your target language. Click on any sentence to get an instant translation into your spoken language.
-   **AI-Powered Flashcards**: Create sets of 20 flashcards automatically with common vocabulary for your chosen language pair. Practice with an interactive flip-card interface and listen to pronunciations.
-   **AI Language Partner**: Practice conversation skills by chatting with an AI partner. It communicates primarily in your spoken language, providing translations and grammar explanations for the language you're learning upon request.
-   **Modern, Responsive UI**: A clean and intuitive interface built with ShadCN UI and Tailwind CSS, featuring a collapsible sidebar and light/dark mode support.

## 🚀 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **AI Integration**: [Genkit (Google's Generative AI Toolkit)](https://firebase.google.com/docs/genkit)
-   **AI Model**: [Google Gemini](https://deepmind.google/technologies/gemini/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **State Management**: React Context API
-   **Forms**: React Hook Form with Zod for validation

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd <project-directory>
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Google AI API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```.env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This command runs the Next.js application in development mode with Turbopack for fast refresh.

2.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📜 Available Scripts

-   `npm run dev`: Starts the Next.js development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts a production server.
-   `npm run lint`: Runs the Next.js linter to identify and fix code quality issues.
-   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
-   `npm run genkit:dev`: Starts the Genkit development server to inspect and test flows.
-   `npm run setup-db`: Sets up the MySQL database and runs migrations.
-   `npm run db:generate`: Generates the Prisma client.
-   `npm run db:push`: Pushes the database schema to your MySQL database.
-   `npm run db:studio`: Opens Prisma Studio to view and edit your data.

## 🔐 Authentication & Analytics

Ongea now includes a complete authentication system and analytics tracking:

### Features Added:
- **User Authentication**: Sign up, sign in, and session management with JWT
- **Analytics Tracking**: Track user interactions, page views, and feature usage
- **Admin Dashboard**: View user metrics, popular features, and conversion rates
- **Protected Routes**: Automatic redirection for authenticated/unauthenticated users
- **Real-time Analytics**: Live tracking of user behavior

### Database Setup:

1. **Install MySQL** and create a database for Ongea
2. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```
3. **Configure your .env file**:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/ongea_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   GEMINI_API_KEY="your-gemini-api-key"
   ANALYTICS_ENABLED="true"
   ```
4. **Run the database setup**:
   ```bash
   npm run setup-db
   ```

### Analytics Dashboard:

After setting up authentication, you can access the analytics dashboard at `/admin` to view:
- Total users and signups
- Conversion rates from landing page to signup
- Most popular features and user interactions
- Recent user activity and engagement metrics

### Tracked Events:

The system automatically tracks:
- **Page Views**: All major pages (landing, dashboard, features)
- **Button Clicks**: CTA buttons, navigation, feature access
- **Feature Usage**: Stories generation, flashcards, AI chat
- **User Actions**: Signup, signin, signout events
