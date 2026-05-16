import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { User as UserIcon, Mail } from 'lucide-react';

const MyClients = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['assignedClients'],
    queryFn: () => usersApi.getAssignedClients(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Failed to load clients. Please try again.
      </div>
    );
  }

  const clients = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-medium leading-6 text-slate-900">My Assigned Clients</h3>
          <p className="mt-1 text-sm text-slate-500">
            A list of all clients currently assigned to you for job tracking.
          </p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {clients.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              You don't have any assigned clients yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {clients.map((client: any) => (
                <li key={client._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">{client.name}</h4>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <Mail className="w-4 h-4 mr-1" />
                          {client.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      Client ID: {client._id}
                    </div>
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
