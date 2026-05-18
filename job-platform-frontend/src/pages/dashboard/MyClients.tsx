import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { User as UserIcon, Mail, Users } from 'lucide-react';

const MyClients = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['assignedClients'],
    queryFn: () => usersApi.getAssignedClients(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200"><div className="skeleton h-6 w-48"></div></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border-b border-slate-100 flex items-center gap-4">
              <div className="skeleton w-12 h-12 rounded-full"></div>
              <div>
                <div className="skeleton h-5 w-32 mb-2"></div>
                <div className="skeleton h-4 w-48"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 animate-scale-in">
        Failed to load clients. Please try again.
      </div>
    );
  }

  const clients = data?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">My Assigned Clients</h3>
          <p className="mt-1 text-sm text-slate-500">
            All clients currently assigned to you for job tracking.
          </p>
        </div>
        
        <div className="divide-y divide-slate-100">
          {clients.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No assigned clients</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Clients will appear here once they subscribe and get assigned to you.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {clients.map((client: any) => (
                <li key={client._id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{client.name}</h4>
                        <div className="flex items-center text-sm text-slate-500 mt-0.5 gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {client.email}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 hidden sm:inline-flex">
                      ID: {client._id.slice(-6)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClients;
