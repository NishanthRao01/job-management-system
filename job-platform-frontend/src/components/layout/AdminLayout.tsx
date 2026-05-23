import { Outlet, NavLink } from "react-router-dom";

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

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6">

        <h1 className="text-2xl font-bold text-indigo-600 mb-10">
          Admin Panel
        </h1>

        <nav className="space-y-2">

          {navItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl font-medium transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.name}
            </NavLink>

          ))}

        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">

        <Outlet />

      </main>

    </div>
  );
};

export default AdminLayout;