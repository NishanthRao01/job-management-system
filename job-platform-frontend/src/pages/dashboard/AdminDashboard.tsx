import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Users, UserCheck, BarChart3, CreditCard, FileText, ArrowRight, IndianRupee,
  AlertCircle, Sparkles, ShieldCheck
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface Associate {
  _id: string;
  name: string;
  isAvailable: boolean;
  clientsCount: number;
}

interface Client {
  _id: string;
  assignedAssociate: any;
}

interface Subscription {
  _id: string;
  status: 'active' | 'expired';
}

interface Payment {
  _id: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
}

interface PaymentsResponse {
  success: boolean;
  metrics: { totalPayments: number; successfulPayments: number; totalRevenue: number };
  data: Payment[];
}

interface AuditLog {
  _id: string;
  action: string;
  performedBy: { name: string; email: string; role: string } | null;
  createdAt: string;
}

interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
}

const actionMetaMap: Record<string, { label: string; color: string; bgColor: string }> = {
  ASSOCIATE_AVAILABILITY_CHANGED: { label: 'Availability Update', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  ASSOCIATE_REASSIGNED: { label: 'Reassignment', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  PAYMENT_SUCCESS: { label: 'Payment Success', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  SUBSCRIPTION_EXPIRED: { label: 'Subscription Expired', color: 'text-rose-600', bgColor: 'bg-rose-50' },
};

const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <div className="h-4 w-20 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded" />
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-200" />
    </div>
  </div>
);

const AdminDashboard = () => {
  // ── Queries ──────────────────────────────────────────────────────
  const { data: usersRes, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data;
    },
  });

  const { data: associatesRes, isLoading: loadingAssociates } = useQuery({
    queryKey: ['admin', 'associates'],
    queryFn: async () => {
      const { data } = await api.get('/admin/associates');
      return data;
    },
  });

  const { data: clientsRes, isLoading: loadingClients } = useQuery({
    queryKey: ['admin', 'clients'],
    queryFn: async () => {
      const { data } = await api.get('/admin/clients');
      return data;
    },
  });

  const { data: subsRes, isLoading: loadingSubs } = useQuery({
    queryKey: ['admin', 'subscriptions'],
    queryFn: async () => {
      const { data } = await api.get('/admin/subscriptions');
      return data;
    },
  });

  const { data: paymentsRes, isLoading: loadingPayments } = useQuery<PaymentsResponse>({
    queryKey: ['admin', 'payments'],
    queryFn: async () => {
      const { data } = await api.get('/admin/payments');
      return data;
    },
  });

  const { data: logsRes, isLoading: loadingLogs } = useQuery<AuditLogsResponse>({
    queryKey: ['admin', 'audit-logs'],
    queryFn: async () => {
      const { data } = await api.get('/admin/audit-logs');
      return data;
    },
  });

  const associates: Associate[] = associatesRes?.data || [];
  const clients: Client[] = clientsRes?.data || [];
  const subscriptions: Subscription[] = subsRes?.data || [];
  const logs: AuditLog[] = logsRes?.data || [];

  const activeSubsCount = subscriptions.filter((s) => s.status === 'active').length;
  const metrics = paymentsRes?.metrics || { totalPayments: 0, successfulPayments: 0, totalRevenue: 0 };

  const isStatsLoading = loadingUsers || loadingAssociates || loadingSubs || loadingPayments;

  const statCards = [
    {
      label: 'Total Platform Users',
      value: usersRes?.count ?? '—',
      icon: Users,
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Staff Associates',
      value: associatesRes?.count ?? '—',
      icon: UserCheck,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      label: 'Active Subscriptions',
      value: loadingSubs ? '—' : activeSubsCount,
      icon: BarChart3,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Total Platform Revenue',
      value: paymentsRes?.metrics ? `₹${metrics.totalRevenue.toLocaleString('en-IN')}` : '—',
      icon: IndianRupee,
      gradient: 'from-emerald-500 to-green-600',
    },
  ];

  const quickActions = [
    {
      title: 'Associates Management',
      description: 'Control availability toggles, track staff client workload, and monitor eligibility.',
      icon: UserCheck,
      path: '/dashboard/admin/associates',
      color: 'text-indigo-600 bg-indigo-50',
      borderColor: 'hover:border-indigo-300',
    },
    {
      title: 'Clients & Assignments',
      description: 'View clients, check plan details, and reassign support associates to distribute workload.',
      icon: Users,
      path: '/dashboard/admin/clients',
      color: 'text-violet-600 bg-violet-50',
      borderColor: 'hover:border-violet-300',
    },
    {
      title: 'Subscriptions Dashboard',
      description: 'Track pricing levels, check active plan validity, and monitor upcoming expirations.',
      icon: BarChart3,
      path: '/dashboard/admin/subscriptions',
      color: 'text-amber-600 bg-amber-50',
      borderColor: 'hover:border-amber-300',
    },
    {
      title: 'Payments Dashboard',
      description: 'Track order transactions, success/failure metrics, and Razorpay receipts.',
      icon: CreditCard,
      path: '/dashboard/admin/payments',
      color: 'text-emerald-600 bg-emerald-50',
      borderColor: 'hover:border-emerald-300',
    },
    {
      title: 'Audit Logs Feed',
      description: 'Review full traceability logs, administrative changes, and system automated cron events.',
      icon: FileText,
      path: '/dashboard/admin/audit-logs',
      color: 'text-slate-700 bg-slate-100',
      borderColor: 'hover:border-slate-350',
    },
  ];

  // Helper to format date
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = new Date().getTime() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return '—';
    }
  };

  const getActionLabel = (action: string) => {
    return actionMetaMap[action]?.label || action.replace(/_/g, ' ');
  };

  const getActionStyle = (action: string) => {
    return actionMetaMap[action] || { color: 'text-slate-650', bgColor: 'bg-slate-50' };
  };

  // Extra metric computation
  const availableAssociates = associates.filter((a) => a.isAvailable).length;
  const assignedClients = clients.filter((c) => c.assignedAssociate).length;
  const assignmentRate = clients.length ? Math.round((assignedClients / clients.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            System Control Panel
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome back, System Admin
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Manage your workforce assignment engine, track system payments, audit administrative actions, and monitor platform health metrics in real-time.
          </p>
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isStatsLoading
          ? [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white p-6 rounded-2xl border border-slate-200 card-hover shadow-sm flex items-center justify-between"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-950">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md text-white`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                </div>
              );
            })}
      </div>

      {/* Main Sections: Quick Actions + Secondary Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Operational Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Operational Admin Panels</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover flex flex-col justify-between transition group ${action.borderColor}`}
                >
                  <div className="space-y-4">
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                        {action.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-indigo-600 mt-4 group-hover:translate-x-1 transition-transform self-start">
                    Open Panel
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Platform Health & Quick Feed */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Workforce & Activities</h3>

          {/* Workforce Summary Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Workforce Allocation
            </h4>
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-550">Client Assignment Rate</span>
                  <span className="text-indigo-650 font-bold">{loadingClients ? '—' : `${assignmentRate}%`}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${assignmentRate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Available Staff</span>
                  <span className="font-bold text-slate-900 text-sm">{loadingAssociates ? '—' : `${availableAssociates} / ${associates.length}`}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assigned Clients</span>
                  <span className="font-bold text-slate-900 text-sm">{loadingClients ? '—' : `${assignedClients} / ${clients.length}`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Audit Feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              Recent Actions Feed
            </h4>

            <div className="space-y-4">
              {loadingLogs ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 bg-slate-100 rounded" />
                      <div className="h-2.5 w-1/3 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))
              ) : logs.length === 0 ? (
                <div className="text-center py-6">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-semibold">No audit logs found</p>
                </div>
              ) : (
                logs.slice(0, 5).map((log) => {
                  const style = getActionStyle(log.action);
                  return (
                    <div key={log._id} className="flex items-start gap-3 text-xs">
                      <div className={`w-8 h-8 rounded-lg ${style.bgColor} flex-shrink-0 flex items-center justify-center font-bold`}>
                        <FileText className={`w-3.5 h-3.5 ${style.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {getActionLabel(log.action)}
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5 flex justify-between">
                          <span>by {log.performedBy?.name || 'System'}</span>
                          <span className="text-slate-400 font-medium">{formatTimeAgo(log.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Link
              to="/dashboard/admin/audit-logs"
              className="block text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 border-t border-slate-100 pt-3.5 transition"
            >
              View All System Logs →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
