import { useAuth } from '../../hooks/useAuth';
import { ChatWindow } from './ChatWindow';
import { MessageSquare, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientChat = () => {
  const { user } = useAuth();
  const associateId = (user as any)?.assignedAssociate;

  if (!associateId) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center animate-fade-in">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">No active conversation</h2>
        <p className="text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
          You need an active subscription to access the chat feature. Once you subscribe, you'll be assigned an associate to communicate with here.
        </p>
        <Link
          to="/dashboard/client/subscription"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
        >
          <CreditCard className="w-4 h-4" />
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Chat securely with your dedicated associate.</p>
      </div>
      <ChatWindow contactId={associateId} contactName="Your Associate" />
    </div>
  );
};

export default ClientChat;
