
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton'; 
import AppLayout from '@/components/layout/AppLayout';

// Lazy load pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Properties = React.lazy(() => import('@/pages/Properties'));
const Calculator = React.lazy(() => import('@/pages/Calculator'));
const Finances = React.lazy(() => import('@/pages/Finances'));
const About = React.lazy(() => import('@/pages/About'));
const Backup = React.lazy(() => import('@/pages/Backup'));
const Auth = React.lazy(() => import('@/pages/Auth'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Authentication route - should not be protected */}
      <Route 
        path="/auth" 
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
            <Auth />
          </Suspense>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
                <Dashboard />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/imoveis/*" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
                <Properties />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calculator" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
                <Calculator />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/financas" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
                <Finances />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/about" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
                <About />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/backup" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
                <Backup />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Default routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
