
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Spinner from '@/components/ui/spinner'; 

// Lazy load pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Properties = React.lazy(() => import('@/pages/Properties'));
const Calculator = React.lazy(() => import('@/pages/Calculator'));
const Finances = React.lazy(() => import('@/pages/Finances'));
const About = React.lazy(() => import('@/pages/About'));
const Backup = React.lazy(() => import('@/pages/Backup')); // Novo!

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Suspense fallback={<Spinner />}>
                <Dashboard />
              </Suspense>
            </SidebarLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/imoveis/*" 
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Suspense fallback={<Spinner />}>
                <Properties />
              </Suspense>
            </SidebarLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calculator" 
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Suspense fallback={<Spinner />}>
                <Calculator />
              </Suspense>
            </SidebarLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/financas" 
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Suspense fallback={<Spinner />}>
                <Finances />
              </Suspense>
            </SidebarLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/about" 
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Suspense fallback={<Spinner />}>
                <About />
              </Suspense>
            </SidebarLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/backup" 
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Suspense fallback={<Spinner />}>
                <Backup />
              </Suspense>
            </SidebarLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
