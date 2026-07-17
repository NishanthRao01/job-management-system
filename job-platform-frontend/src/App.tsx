import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import AuthLayout from './components/layout/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HowItWorks from './pages/HowItWorks';
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
import AdminLayout from './components/layout/AdminLayout';
import Associates from './pages/admin/Associates';
import Clients from './pages/admin/Clients';
import Subscriptions from './pages/admin/Subscriptions';
import Payments from './pages/admin/Payments';
import AuditLogs from './pages/admin/AuditLogs';

const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? `/dashboard/${user.role}` : '/how-it-works'} replace />} />
        
        {/* Public Routes */}
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
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

            <Route
            element={
              <RoleRoute allowedRoles={['admin']} />
            }
          >

            <Route
              path="/dashboard/admin"
              element={<AdminLayout />}
            >

              <Route
                index
                element={<AdminDashboard />}
              />

              <Route
                path="associates"
                element={<Associates />}
              />

              <Route
                path="clients"
                element={<Clients />}
              />

              <Route
                path="subscriptions"
                element={<Subscriptions />}
              />

              <Route
                path="payments"
                element={<Payments />}
              />

              <Route
                path="audit-logs"
                element={<AuditLogs />}
              />

            </Route>

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
