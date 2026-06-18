import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import AuthForm from './components/AuthForm';
import Layout from './app/MainLayout.tsx';
import LandingPage from './app/landing/LandingPage.tsx';
import AuthCallbackPage from './app/auth/callback/callback.tsx';

// Lazy load non-critical routes for better performance
const DashboardPage = React.lazy(() => import('./app/Dashboard.tsx'));
const KanbanPage = React.lazy(() => import('./app/kanban/Kanban.tsx'));
const ApplicationsPage = React.lazy(() => import('./app/applications/ApplicationPage.tsx'));
const CompaniesPage = React.lazy(() => import('./app/companies/CompaniesLayout.tsx'));
const AnalyticsPage = React.lazy(() => import('./app/analytics/Analytics.tsx'));
const RemindersPage = React.lazy(() => import('./app/reminders/Reminder.tsx'));
const AtsPage = React.lazy(() => import('./app/ATS/LayoutATS.tsx'));
const PlannerPage = React.lazy(() => import('./app/planner/PlannerPage.tsx'));

function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}

function PublicRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

function AppRoutes() {
    return (
        <Suspense fallback={
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        }>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth/login" element={<AuthForm defaultIsSignUp={false} />} />
                    <Route path="/auth/register" element={<AuthForm defaultIsSignUp={true} />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route path="/planner" element={<PlannerPage />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/kanban" element={<KanbanPage />} />
                    <Route path="/applications" element={<ApplicationsPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/reminders" element={<RemindersPage />} />
                    <Route path="/ats" element={<AtsPage />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
