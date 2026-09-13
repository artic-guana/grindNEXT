# GrindNEXT

**GrindNEXT** is a gamified productivity RPG that turns real work into progression. Users complete tasks and projects, improve skills, maintain streaks, unlock achievements, earn XP and coins, collect anime characters and Pokémon, and equip their favorite collectibles.

> **Turn your grind into progression.**

## Features

### RPG Progression Engine
- Earn XP by completing productive activities.
- Level up as XP accumulates.
- Uses increasing XP requirements so higher levels are progressively harder.
- Tracks current XP, total XP, level, and XP required for the next level.
- Supports a non-linear RPG progression curve.

```js
export function xpRequiredForLevel(level) {
  const safeLevel = Math.max(1, level);
  return Math.floor(400 + 100 * safeLevel + 15 * safeLevel * safeLevel);
}
```

### Task Management
- Create, update, complete, and delete tasks.
- Statuses: `todo`, `in-progress`, `done`.
- Priorities: `low`, `medium`, `high`, `urgent`.
- Completing tasks awards XP and contributes to streaks and achievements.
- Filter tasks by status.

### Project Tracking
- Create and manage larger goals.
- Track project progress and completion.
- Earn larger XP rewards for completed projects.
- Project milestones contribute to achievements.

### Skill Progression
- Create skills you want to improve.
- Track individual skill XP and levels.
- Skill XP requirements increase as skills progress.
- Skill levels can unlock achievements.

### Achievements
Achievement definitions are global while progress is stored independently for every user.

Examples include **First Step**, **Task Slayer**, **Project Master**, **Week Warrior**, **Rising Hero**, **Skill Master**, and **Collector**.

Achievements can reward XP and coins and can use animated Lottie artwork in the frontend.

### Streak System
- First active day starts a streak.
- Activity on the same day keeps the streak unchanged.
- Activity on the next consecutive day increments it.
- Missing a day resets the active streak.
- Maximum streak is tracked separately.

### Coins & Rewards
Users earn coins through progression and achievements. Coins can be spent on collectibles, adding a reward loop alongside XP and levels.

### Collectibles
GrindNEXT supports anime characters and Pokémon with rarity levels:

```text
Common → Rare → Epic → Legendary → Mythic
```

Collectibles can include artwork, animated artwork, source metadata, anime information, Pokémon types, and base stats.

### Equip System
Owned collectibles can be equipped in two profile slots:

```text
equippedCharacter → Anime character
equippedPokemon   → Pokémon
```

Equipping changes the active collectible without deleting or consuming previously owned collectibles.

### External APIs
- **AniList GraphQL API** for anime character information.
- **PokéAPI** for Pokémon metadata and artwork.

### Activity Feed
Important progression events can be stored as activities, including achievement unlocks and other productivity events.

### Notion-style Pages
Rich productivity pages are designed around TipTap JSON content for flexible note taking and structured planning.

### Authentication
Authentication is handled by **Better Auth** using email/password login and cookie-based sessions. Better Auth owns authentication data while GrindNEXT stores application-specific progression separately.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Zustand
- Axios
- React Router
- Lucide React
- TipTap
- Chart.js
- Lottie animations

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Better Auth

### External Services
- AniList
- PokéAPI

## Architecture

```text
React Frontend
      │
      │ Axios + Cookies
      ▼
Express REST API
      │
      ├── Better Auth
      ├── Tasks
      ├── Projects
      ├── Skills
      ├── Achievements
      ├── Gamification
      ├── Collectibles
      ├── Activity
      └── Pages
      │
      ▼
   MongoDB
```

## Backend Structure

```text
Backend/
├── .env
├── .env.example
├── package.json
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   ├── db.js
    │   └── env.js
    ├── controllers/
    ├── middleware/
    ├── models/
    │   ├── User.js
    │   ├── Profile.js
    │   ├── Skill.js
    │   ├── Achievement.js
    │   ├── UserAchievement.js
    │   ├── Activity.js
    │   ├── Collectible.js
    │   ├── UserCollectible.js
    │   ├── Page.js
    │   ├── Project.js
    │   └── Task.js
    ├── routes/
    ├── services/
    │   ├── auth.service.js
    │   ├── profile.service.js
    │   ├── xp.service.js
    │   ├── coin.service.js
    │   ├── skill.service.js
    │   ├── achievement.service.js
    │   ├── activity.service.js
    │   ├── collectible.service.js
    │   ├── gamification.service.js
    │   ├── streak.service.js
    │   ├── anilist.service.js
    │   └── pokeapi.service.js
    ├── utils/
    └── seeds/
        ├── achievements.seed.js
        ├── collectibles.seed.js
        └── seed.js
```

## Core Models

### Profile

```text
userId
name
bio
avatar
level
currentXp
totalXp
nextLevelXp
coins
streak
maxStreak
lastActiveDate
equippedCharacter
equippedPokemon
```

### UserAchievement

```text
userId
achievement
progress
unlocked
unlockedAt
```

### UserCollectible

```text
userId
collectible
level
xp
nickname
shiny
acquiredFrom
acquiredAt
```

The equipped profile fields reference `UserCollectible`, not the global collectible definition.

## API Endpoints

### Authentication

```http
POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
POST /api/auth/sign-out
GET  /api/auth/get-session
GET  /api/v1/auth/me
```

### Profile

```http
GET   /api/v1/profile/me
PATCH /api/v1/profile/me
```

### Tasks

```http
GET    /api/v1/tasks
POST   /api/v1/tasks
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id/complete
```

### Projects

```http
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
PATCH  /api/v1/projects/:id/progress
PATCH  /api/v1/projects/:id/complete
```

### Skills

```http
GET    /api/v1/skills
POST   /api/v1/skills
PATCH  /api/v1/skills/:id
DELETE /api/v1/skills/:id
PATCH  /api/v1/skills/:id/xp
```

### Achievements

```http
GET  /api/v1/achievements
GET  /api/v1/achievements/me
POST /api/v1/achievements/check
```

### Collectibles

```http
GET   /api/v1/collectibles
GET   /api/v1/collectibles/me
POST  /api/v1/collectibles/:id/buy
PATCH /api/v1/collectibles/owned/:id/equip
```

For the equip endpoint, `:id` is the **UserCollectible ID**.

### Activity & Gamification

```http
GET  /api/v1/activity?limit=20
GET  /api/v1/gamification/overview
POST /api/v1/gamification/daily-activity
```

### Pages

```http
GET    /api/v1/pages
POST   /api/v1/pages
GET    /api/v1/pages/:id
PATCH  /api/v1/pages/:id
DELETE /api/v1/pages/:id
```

## RPG Progression

A quadratic XP curve can be used so each subsequent level becomes increasingly expensive:

```text
XP(level) = 400 + 100(level) + 15(level²)
```

| Level | XP Required |
| ---: | ---: |
| 1 | 515 |
| 2 | 660 |
| 3 | 835 |
| 4 | 1,040 |
| 5 | 1,275 |
| 10 | 2,900 |

This creates quick early progression while making higher levels increasingly challenging.

## Achievement Engine

An achievement definition can look like:

```js
{
  key: "week_warrior",
  name: "Week Warrior",
  category: "streak",
  requirement: 7,
  xpReward: 250,
  coinReward: 100
}
```

Supported metrics include tasks completed, projects completed, streak, account level, skill level, and collectibles owned.

```text
Week Warrior
Current streak: 4
Requirement:    7
Progress:       4 / 7
```

When the requirement is reached, the achievement is unlocked once and its configured rewards are granted.

## Setup

### Prerequisites
- Node.js
- npm
- MongoDB

### Clone

```bash
git clone <your-repository-url>
cd GrindNEXT
```

### Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/grindNEXT
CLIENT_URL=http://localhost:5173
BETTER_AUTH_SECRET=replace-with-a-secure-secret-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

### Seed Game Data

```bash
npm run seed
```

The seed process creates global game definitions such as achievements and collectibles. User-specific progression is created separately.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

The Vite development server normally runs at `http://localhost:5173`.

## Authentication Flow

```text
Credentials
    ↓
Better Auth
    ↓
Session Cookie
    ↓
Browser sends cookie automatically
    ↓
Express Authentication Middleware
    ↓
Protected GrindNEXT API
```

Axios should use credentials:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});
```

## Core Game Loop

```text
Create task/project
       ↓
Do real work
       ↓
Complete objective
       ↓
Earn XP
       ↓
Maintain streak
       ↓
Check achievements
       ↓
Earn rewards
       ↓
Level up
       ↓
Buy collectibles
       ↓
Equip character / Pokémon
       ↓
Keep grinding
```

## Future Improvements

- Leaderboards
- Daily and weekly quests
- Boss challenges
- Friends and social profiles
- Seasonal achievements
- Character/profile themes
- More collectible animations
- Skill trees
- Calendar heatmaps
- Productivity analytics
- Notifications and reminders
- PWA/mobile support

## Project Philosophy

Traditional productivity applications primarily record what a user has completed. GrindNEXT adds a second layer: **progression**.

Tasks become quests, consistent work builds streaks, milestones unlock achievements, XP increases levels, and coins unlock collectibles. The aim is to make long-term personal development visible, rewarding, and engaging.

## Author

**Suryodipta Pradhan**  
Electronics and Communication Engineering  
National Institute of Technology Raipur
