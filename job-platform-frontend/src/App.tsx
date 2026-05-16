import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import AuthLayout from './components/layout/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import AssociateDashboard from './pages/dashboard/AssociateDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AddJob from './pages/dashboard/AddJob';
import Subscription from './pages/dashboard/Subscription';
import JobDetails from './pages/dashboard/JobDetails';
import MyClients from './pages/dashboard/MyClients';
import ClientChat from './pages/dashboard/ClientChat';
import AssociateChat from './pages/dashboard/AssociateChat';

const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? `/dashboard/${user.role}` : '/login'} replace />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            
            <Route element={<RoleRoute allowedRoles={['client']} />}>
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              <Route path="/dashboard/client/subscription" element={<Subscription />} />
              <Route path="/dashboard/client/jobs/:id" element={<JobDetails />} />
              <Route path="/dashboard/client/chat" element={<ClientChat />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['associate']} />}>
              <Route path="/dashboard/associate" element={<AssociateDashboard />} />
              <Route path="/dashboard/associate/jobs/new" element={<AddJob />} />
              <Route path="/dashboard/associate/jobs/:id" element={<JobDetails />} />
              <Route path="/dashboard/associate/clients" element={<MyClients />} />
              <Route path="/dashboard/associate/chat" element={<AssociateChat />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Route>
            
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
