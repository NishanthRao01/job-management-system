import { Shield, Users, Briefcase, BarChart3, Settings, Database } from 'lucide-react';

const AdminDashboard = () => {
  const placeholderStats = [
    { label: 'Total Users', value: '—', icon: Users, gradient: 'from-indigo-500 to-indigo-600' },
    { label: 'Active Jobs', value: '—', icon: Briefcase, gradient: 'from-violet-500 to-purple-600' },
    { label: 'Subscriptions', value: '—', icon: BarChart3, gradient: 'from-amber-500 to-orange-500' },
    { label: 'System Health', value: 'OK', icon: Database, gradient: 'from-emerald-500 to-green-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Platform overview and management controls.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {placeholderStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 card-hover shadow-sm" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Features Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Management Tools
          </h3>
        </div>
        <div className="p-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'User Management', desc: 'View and manage all platform users', icon: Users },
              { title: 'Role Assignment', desc: 'Assign and modify user roles', icon: Shield },
              { title: 'Analytics', desc: 'Platform-wide usage analytics', icon: BarChart3 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                    <Icon className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-slate-400">
            Full admin features coming soon. This is a placeholder interface.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
