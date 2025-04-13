
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton'; 

// Lazy load pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Properties = React.lazy(() => import('@/pages/Properties'));
const Calculator = React.lazy(() => import('@/pages/Calculator'));
const Finances = React.lazy(() => import('@/pages/Finances'));
const About = React.lazy(() => import('@/pages/About'));
const Backup = React.lazy(() => import('@/pages/Backup'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
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
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
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
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
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
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
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
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
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
              <Suspense fallback={<div className="flex items-center justify-center h-screen"><Skeleton className="h-32 w-32 rounded-full" /></div>}>
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
