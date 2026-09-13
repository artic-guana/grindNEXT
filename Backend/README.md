# Gamified Productivity Backend

Express + MongoDB + Better Auth backend for a Notion-style productivity app with
profiles, XP/levels, streaks, skills, tasks, projects, achievements and collectibles.

## Install

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

## Better Auth endpoints

Better Auth is mounted at `/api/auth/*`.

Useful built-in endpoints:

```text
POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
POST /api/auth/sign-out
GET  /api/auth/get-session
```

Example sign-up JSON:

```json
{
  "name": "Suryodipta",
  "email": "user@example.com",
  "password": "strong-password"
}
```

From the browser, send credentials/cookies:

```js
fetch("http://localhost:5000/api/v1/profile/me", {
  credentials: "include"
});
```

## App API

### Auth / Profile
- `GET /api/v1/auth/me`
- `GET /api/v1/profile/me`
- `PATCH /api/v1/profile/me`

### Skills
- `GET /api/v1/skills`
- `POST /api/v1/skills`
- `PATCH /api/v1/skills/:id`
- `PATCH /api/v1/skills/:id/xp`
- `DELETE /api/v1/skills/:id`

`GET /api/v1/gamification/overview` returns Chart.js-ready skill data:

```json
{
  "skillChart": {
    "labels": ["DSA", "React"],
    "datasets": [
      {
        "label": "Skill Level",
        "data": [6, 4]
      }
    ]
  }
}
```

### Tasks
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id/complete`
- `DELETE /api/v1/tasks/:id`

Task fields:
- title
- description
- status
- priority
- dueDate
- tags
- xpReward
- optional `project`

Completing a task grants XP, updates streak and checks achievements.

### Projects
- `GET /api/v1/projects`
- `GET /api/v1/projects/:id`
- `POST /api/v1/projects`
- `PATCH /api/v1/projects/:id`
- `PATCH /api/v1/projects/:id/progress`
- `PATCH /api/v1/projects/:id/complete`
- `DELETE /api/v1/projects/:id`

Project fields:
- name
- description
- progress
- priority
- xpReward
- status
- dueDate

Tasks reference their project. Project responses include task lists.

### Pages
- `GET /api/v1/pages`
- `GET /api/v1/pages/:id`
- `POST /api/v1/pages`
- `PATCH /api/v1/pages/:id`
- `DELETE /api/v1/pages/:id`

`content` is `Mixed`, so Tiptap JSON can be saved directly.

### Gamification
- `GET /api/v1/gamification/overview`
- `POST /api/v1/gamification/daily-activity`

Profile progression:
- lifetime `totalXp`
- current `level`
- `currentXp`
- `nextLevelXp`
- `coins`
- `streak`
- `maxStreak`

### Achievements
- `GET /api/v1/achievements`
- `GET /api/v1/achievements/me`
- `POST /api/v1/achievements/check`

### Collectibles
- `GET /api/v1/collectibles`
- `GET /api/v1/collectibles/me`
- `POST /api/v1/collectibles/:id/buy`
- `PATCH /api/v1/collectibles/owned/:id/equip`

Filter:
```text
/api/v1/collectibles?category=pokemon
/api/v1/collectibles?type=waifu
/api/v1/collectibles?rarity=legendary
```

### Activity
- `GET /api/v1/activity?limit=20`

## Chart.js frontend packages

These are frontend dependencies, not backend dependencies:

```bash
npm install chart.js react-chartjs-2
```
