import { useAuth } from '../../hooks/useAuth';
import { ChatWindow } from './ChatWindow';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientChat = () => {
  const { user } = useAuth();
  
  // Need to add assignedAssociate to the user context in the frontend
  const associateId = (user as any)?.assignedAssociate;

  if (!associateId) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">No active conversation</h2>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          You need an active subscription to access the chat feature. Once you subscribe, you'll be assigned an associate to communicate with here.
        </p>
        <Link
          to="/dashboard/client/subscribe"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Chat securely with your dedicated associate.</p>
      </div>
      <ChatWindow contactId={associateId} contactName="Your Associate" />
    </div>
  );
};

export default ClientChat;
