import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { messagesApi } from '../../api/messages';
import { useAuth } from '../../hooks/useAuth';
import { Send } from 'lucide-react';

// socket.io-client is loaded via script tag in index.html
declare const io: any;

interface ChatWindowProps {
  contactId: string;
  contactName: string;
}

export const ChatWindow = ({ contactId, contactName }: ChatWindowProps) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['messages', contactId],
    queryFn: () => messagesApi.getMessages(contactId),
  });

  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }
  }, [data]);

  useEffect(() => {
    // Get the base URL (strip /api from the end for socket connection)
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
    
    // Initialize Socket
    socketRef.current = io(baseUrl, {
      auth: { token }
    });

    socketRef.current.on('receiveMessage', (message: any) => {
      setMessages(prev => {
        // avoid duplicates (server echoes back to sender too)
        if (prev.some(m => m._id === message._id)) return prev;
        // only append messages from this conversation
        const inConversation =
          (message.senderId === contactId && message.receiverId === user?.id) ||
          (message.senderId === user?.id && message.receiverId === contactId);
        return inConversation ? [...prev, message] : prev;
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [contactId, token, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('sendMessage', {
      receiverId: contactId,
      text: newMessage.trim(),
    });

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3 shrink-0">
          {contactName.charAt(0)}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{contactName}</h3>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
        {isLoading ? (
          <div className="text-center text-slate-500 text-sm">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-500 text-sm h-full flex items-center justify-center">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-slate-300 rounded-full py-2 px-4 border bg-slate-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="inline-flex items-center justify-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 shrink-0"
          >
            <Send className="h-5 w-5 -ml-0.5 mt-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
