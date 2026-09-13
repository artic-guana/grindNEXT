import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/common/AppLayout.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetailsPage from './pages/ProjectDetailsPage.jsx';
import SkillsPage from './pages/SkillsPage.jsx';
import WorkspacePage from './pages/WorkspacePage.jsx';
import AchievementsPage from './pages/AchievementsPage.jsx';
import CollectionPage from './pages/CollectionPage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProfileDashboard from './pages/ProfileDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { useGrindNextStore } from './store/useGrindNextStore.js';

const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

export default function AppRoutes() {
  const hydrate = useGrindNextStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={protect(<DashboardPage />)} />
        <Route path="/tasks" element={protect(<TasksPage />)} />
        <Route path="/projects" element={protect(<ProjectsPage />)} />
        <Route path="/projects/:id" element={protect(<ProjectDetailsPage />)} />
        <Route path="/skills" element={protect(<SkillsPage />)} />
        <Route path="/workspace" element={protect(<WorkspacePage />)} />
        <Route path="/achievements" element={protect(<AchievementsPage />)} />
        <Route path="/collection" element={protect(<CollectionPage />)} />
        <Route path="/shop" element={protect(<ShopPage />)} />
        <Route path="/profile" element={protect(<ProfileDashboard />)} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}
