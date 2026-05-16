import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { ChatWindow } from './ChatWindow';
import { MessageSquare, Users } from 'lucide-react';

const AssociateChat = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['assignedClients'],
    queryFn: () => usersApi.getAssignedClients(),
  });

  const clients = clientsData?.data || [];
  const selectedClient = clients.find((c: any) => c._id === selectedClientId);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar */}
      <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Users className="w-5 h-5 mr-2" /> My Clients
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <p className="p-4 text-sm text-slate-500 text-center">Loading clients...</p>
          ) : clients.length === 0 ? (
            <p className="p-4 text-sm text-slate-500 text-center">No assigned clients yet.</p>
          ) : (
            clients.map((client: any) => (
              <button
                key={client._id}
                onClick={() => setSelectedClientId(client._id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedClientId === client._id
                    ? 'bg-indigo-50 border border-indigo-100'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3 shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${selectedClientId === client._id ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {client.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{client.email}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0">
        {selectedClientId ? (
          <ChatWindow contactId={selectedClientId} contactName={selectedClient?.name || 'Client'} />
        ) : (
          <div className="h-full bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Select a client</h2>
            <p className="text-slate-500 max-w-sm">
              Choose a client from the sidebar to view your conversation and send messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssociateChat;
