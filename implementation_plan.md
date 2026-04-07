# Zenith - Premium Project Management Platform

Zenith is a high-end project management platform designed for teams that value speed, clarity, and aesthetic excellence. It focuses on intuitive task management, real-time collaboration, and visual progress tracking.

## User Flow

### 1. Authentication & Onboarding
- **Account Creation**: Secure signup with personal/business email or OAuth.
- **Initial Setup**: User creates their first 'Workspace' or joins an existing one via invite.
- **Team Formation**: Create 'Teams' within the workspace for departmental or project-specific grouping.

### 2. Workspace Dashboard
- **Overview**: A high-level view showing active projects, upcoming deadlines, and "Assigned to Me" tasks.
- **Activity Feed**: Real-time updates on task completions, mentions, and new comments.

### 3. Project & Task Management
- **Project Views**: Switchable views (Board/Kanban, List, and Timeline).
- **Task Lifecycle**: Create -> Assign -> Progress -> Review -> Complete.
- **Detail Panel**: Side-peek modal for task details including:
  - Rich text descriptions.
  - Assignment & Labels.
  - Due dates.
  - Real-time comment threads.
  - File attachments.

### 4. Collaboration & Tracking
- **Presence**: See who is active in the project.
- **Progress Tracking**: Visual indicators (completion percentages, burn-down charts for projects).
- **Notifications**: In-app and email alerts for mentions and assignments.

## Architecture

### System Design
- **Frontend**: React.js (Vite) for a fast, modern SPA experience.
- **Routing**: React Router v7 for client-side navigation.
- **Authentication**: Supabase Auth (JWT, Row Level Security).
- **Database**: PostgreSQL (via Supabase) for relational integrity between Users, Teams, Projects, and Tasks.
- **Real-time**: Supabase Realtime for instant updates on comments and task moves.
- **Storage**: Supabase Storage for project assets and profile images.

### Data Schema (High Level)
- `profiles`: User information.
- `workspaces`: High-level container for projects/teams.
- `teams`: Groups of users.
- `projects`: Collections of tasks, linked to teams.
- `tasks`: Individual work items with status, priority, and assignee.
- `comments`: Nested discussions on tasks.

## Tech Stack

- **Framework**: [React.js](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) for modern, utility-first design.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for premium, fluid transitions.
- **Icons**: [Lucide React](https://lucide.dev/) for consistent, minimalist iconography.
- **Backend/DB/Auth**: [Supabase](https://supabase.com/).
- **Typography**: *Outfit* for headings, *Inter* for body text.

## Design Aesthetics (The "Zenith" Look)
- **Theme**: Dark Mode by default with glassmorphism accents.
- **Color Palette**: Deep Obsidian (#0A0A0A), Electric Violet (#8B5CF6) for actions, and Slate Gray for secondary text.
- **Interactions**: Subtle hover scales, smooth modal transitions, and spring-based drag-and-drop.

## Proposed Implementation Steps

### Phase 1: Visual Design & Prototyping
- [NEW] `design/zenith_v1.pen`: Create high-fidelity UI/UX design using the Pencil tool.
- Define brand guides, color tokens, and core components (Buttons, Inputs, Modals).

### Phase 2: Project Initialization
- Initialize Vite React project.
- Configure Supabase client and Auth environment.
- Setup core layout and global CSS with React Router.

### Phase 3: Core Features
- Database schema migration.
- Implementation of Project/Task views.
- Real-time comment system and progress tracking logic.

### Phase 4: Polish
- Advanced animations with Framer Motion.
- Final SEO and accessibility audit.

## Open Questions
- Do you have a preferred hosting platform (Vercel, Netlify, etc.)?
- Should the platform support external guest invites to specific projects?
