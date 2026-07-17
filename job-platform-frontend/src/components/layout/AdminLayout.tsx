import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogOut } from "lucide-react";

const navItems = [
  {
    name: "Overview",
    path: "/dashboard/admin",
    end: true,
  },
  {
    name: "Associates",
    path: "/dashboard/admin/associates",
  },
  {
    name: "Clients",
    path: "/dashboard/admin/clients",
  },
  {
    name: "Subscriptions",
    path: "/dashboard/admin/subscriptions",
  },
  {
    name: "Payments",
    path: "/dashboard/admin/payments",
  },
  {
    name: "Audit Logs",
    path: "/dashboard/admin/audit-logs",
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#fafafa]">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-zinc-100 p-5 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Brand with Admin indicator */}
        <div className="h-16 flex items-center px-2 mb-6 border-b border-zinc-100/60 justify-between">
          <Link to="/" className="flex items-center group transition-opacity hover:opacity-90">
            <img 
              src="/brand/logos/handlr-logo-black.svg" 
              alt="Handlr Logo" 
              className="h-5.5 w-auto select-none"
            />
          </Link>
          <span className="text-[9px] font-bold tracking-wider uppercase text-zinc-400 border border-zinc-200 px-1.5 py-0.5 rounded bg-zinc-50">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1 px-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="pt-4 border-t border-zinc-100 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-bold text-xs select-none">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2.5 overflow-hidden">
                <p className="text-xs font-bold text-zinc-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-zinc-400 truncate capitalize flex items-center gap-1 mt-0.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 ml-60 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;