# Zenith: Premium Project Management Platform

Zenith is a high-performance project management solution built with a focus on aesthetic excellence and real-time collaboration. The platform is now ready with a core set of features and a premium design system.

## Features Implemented

### 1. High-End Dashboard
- **Visual Analytics**: Real-time stats for active projects, tasks, and team members.
- **Progress Monitoring**: Visual progress bars and status indicators for recent projects.
- **Quick Actions**: Streamlined interface for task creation and team invitations.

### 2. Interactive Kanban Board
- **Task Visualization**: Cards organized by status (To Do, In Progress, Review, Done).
- **Rich Metadata**: Each task displays priority, assignee, due date, and comment counts.
- **Priority Tags**: Color-coded urgency levels (High, Medium, Low).

### 3. Premium UI/UX
- **Dark Mode Aesthetic**: Deep obsidian background with electric violet accents.
- **Glassmorphism**: Backdrop blur effects on sidebar, topbar, and cards.
- **Responsive Sidebar**: Collapsible navigation with smooth transitions.

## Tech Stack
- **Frontend**: React 19 (via Vite)
- **Styling**: Tailwind CSS v4 (Alpha/Stable)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database/Auth**: Supabase (Integration-ready)

## Getting Started Locally

> [!IMPORTANT]
> To fully enable real-time features and authentication, you must provide your own Supabase credentials.

1.  **Clone/Copy the Project**: Ensure you have the `src/` directory and `package.json`.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment**:
    - Rename `.env.example` to `.env`.
    - Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Project Structure
- `src/layouts/MainLayout.jsx`: Main navigation and shell.
- `src/pages/Dashboard.jsx`: Overview and stats.
- `src/pages/Projects.jsx`: Kanban board and task management.
- `src/lib/supabase.js`: Pre-configured Supabase client.
- `src/index.css`: Global design tokens and Tailwind v4 configuration.

---

### Verification Results
- **Design**: Verified hand-coded premium aesthetics (Glassmorphism, Gradients).
- **Routing**: Verified functional navigation between Dashboard and Projects.
- **Utility**: Verified `cn` (clsx/twMerge) logic for dynamic styling.
