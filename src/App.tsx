import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import AuthForm from './components/AuthForm';
import Layout from './app/layout';
import LandingPage from './app/landing/page';
import AuthCallbackPage from './app/auth/callback/page';

// Lazy load non-critical routes for better performance
const DashboardPage = React.lazy(() => import('./app/page'));
const KanbanPage = React.lazy(() => import('./app/kanban/page'));
const ApplicationsPage = React.lazy(() => import('./app/applications/page'));
const CompaniesPage = React.lazy(() => import('./app/companies/page'));
const AnalyticsPage = React.lazy(() => import('./app/analytics/page'));
const RemindersPage = React.lazy(() => import('./app/reminders/page'));
const AtsPage = React.lazy(() => import('./app/ats/page'));

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
