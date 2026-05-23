import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import {
  FileText, Search, RefreshCw, XCircle, Calendar, Eye, EyeOff, Info,
} from 'lucide-react';

interface AuditLog {
  _id: string;
  action: string;
  performedBy: { _id: string; name: string; email: string; role: string } | null;
  targetUser: { _id: string; name: string; email: string; role: string } | null;
  details: any;
  createdAt: string;
}

interface AuditLogsResponse {
  success: boolean;
  count: number;
  data: AuditLog[];
}

const SkeletonRow = ({ cols }: { cols: number }) => (
  <tr className="border-b border-slate-100">
    {[...Array(cols)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-slate-200 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
);

const actionMetaMap: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  ASSOCIATE_AVAILABILITY_CHANGED: {
    label: 'Availability Changed',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  ASSOCIATE_REASSIGNED: {
    label: 'Associate Reassigned',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  PAYMENT_SUCCESS: {
    label: 'Payment Succeeded',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  SUBSCRIPTION_EXPIRED: {
    label: 'Subscription Expired',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
};

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Fetch audit logs
  const { data: logsRes, isLoading, isError, refetch } = useQuery<AuditLogsResponse>({
    queryKey: ['admin', 'audit-logs'],
    queryFn: async () => {
      const { data } = await api.get('/admin/audit-logs');
      return data;
    },
  });

  const logs = logsRes?.data || [];

  // Get all unique actions for filtering dropdown
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const actorName = log.performedBy?.name || '';
    const actorEmail = log.performedBy?.email || '';
    const targetName = log.targetUser?.name || '';
    const targetEmail = log.targetUser?.email || '';
    const actionLabel = actionMetaMap[log.action]?.label || log.action;

    const matchesSearch =
      actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      targetEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actionLabel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const renderDetails = (details: any) => {
    if (!details || Object.keys(details).length === 0) {
      return <span className="text-slate-400 italic">No additional details</span>;
    }

    return (
      <div className="bg-slate-55/60 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 overflow-x-auto max-w-full">
        {Object.entries(details).map(([key, val]) => {
          let valString = '';
          if (typeof val === 'object' && val !== null) {
            valString = JSON.stringify(val);
          } else {
            valString = String(val);
          }
          return (
            <div key={key} className="flex gap-2">
              <span className="font-bold text-slate-550 min-w-32">{key}:</span>
              <span className="text-slate-800 break-all">{valString}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const getActionMeta = (action: string) => {
    return (
      actionMetaMap[action] || {
        label: action.replace(/_/g, ' '),
        color: 'text-slate-700',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200',
      }
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-600" />
            Audit Logs Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track system changes, security events, payments, and workflow modifications.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4 justify-between animate-scale-in">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by actor, target user, or action name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {getActionMeta(action).label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-scale-in">
        {isError && (
          <div className="p-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold text-sm">Failed to load audit logs. Please check backend connection.</p>
            </div>
          </div>
        )}

        {!isError && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Performed By</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Target User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  [...Array(6)].map((_, i) => <SkeletonRow key={i} cols={5} />)
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-base text-slate-500 font-bold">No logs found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const meta = getActionMeta(log.action);
                    const isExpanded = expandedLogId === log._id;

                    return (
                      <>
                        <tr
                          key={log._id}
                          className={`hover:bg-slate-50/40 transition-colors cursor-pointer ${
                            isExpanded ? 'bg-indigo-50/10' : ''
                          }`}
                          onClick={() => setExpandedLogId(isExpanded ? null : log._id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span>{formatDate(log.createdAt)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${meta.bgColor} ${meta.color} ${meta.borderColor}`}
                            >
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log.performedBy ? (
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 text-sm">{log.performedBy.name}</span>
                                <span className="text-xs text-slate-500">{log.performedBy.email}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic font-semibold">System Cron</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log.targetUser ? (
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 text-sm">{log.targetUser.name}</span>
                                <span className="text-xs text-slate-500">
                                  {log.targetUser.email} ({log.targetUser.role})
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedLogId(isExpanded ? null : log._id);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition"
                            >
                              {isExpanded ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  View Details
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-50/30">
                            <td colSpan={5} className="px-8 py-4">
                              <div className="flex flex-col gap-2">
                                <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                                  Log Details (ID: {log._id})
                                </h4>
                                {renderDetails(log.details)}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;