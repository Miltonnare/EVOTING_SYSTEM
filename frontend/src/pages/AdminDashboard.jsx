import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../api/client';
import { ShieldAlert, Users, Vote, Activity, Plus, CheckCircle2, Lock, Clock, Settings, FileText, X } from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [elections, setElections] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Election Form Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    status: 'scheduled',
    is_published: true,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await apiClient('/admin/stats');
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      const usersRes = await apiClient('/admin/users');
      if (usersRes.success) {
        setUsers(usersRes.users.data || usersRes.users);
      }

      const elecRes = await apiClient('/elections');
      if (elecRes.success) {
        setElections(elecRes.elections);
      }

      const auditRes = await apiClient('/admin/audit-logs');
      if (auditRes.success) {
        setAuditLogs(auditRes.audit_logs.data || auditRes.audit_logs);
      }

      const healthRes = await apiClient('/health');
      setHealth(healthRes);

    } catch (err) {
      addToast(err.message || 'Failed to fetch admin data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient('/elections', {
        method: 'POST',
        body: JSON.stringify(newElection),
      });

      if (res.success) {
        addToast('Election created successfully!', 'success');
        setShowCreateModal(false);
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create election.', 'error');
    }
  };

  const handleToggleStatus = async (electionId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'completed' : 'active';
    try {
      const res = await apiClient(`/elections/${electionId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.success) {
        addToast(`Election status updated to ${nextStatus}`, 'success');
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update election status.', 'error');
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      const res = await apiClient(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      if (res.success) {
        addToast('User role updated successfully.', 'success');
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update user role.', 'error');
    }
  };

  if (!user || !['super_admin', 'election_admin', 'election_officer', 'auditor'].includes(user.role)) {
    return (
      <div className="max-w-md mx-auto my-20 glass-panel p-8 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-slate-400">You must be logged in as an Administrator or Auditor to view this portal.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Portal Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-1">Administrative Operations Suite</span>
          <h1 className="text-3xl font-extrabold text-white">Electoral System Management</h1>
          <p className="text-xs text-slate-400 mt-1">Configure elections, oversee voter roles, review audit events, and monitor platform health.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl font-bold text-white gradient-button flex items-center gap-2 shadow-xl shadow-blue-600/30 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Create New Election
        </button>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex gap-2 overflow-x-auto p-1.5 bg-slate-900/80 rounded-2xl border border-white/10 w-fit">
        {[
          { id: 'overview', label: 'System Overview', icon: Activity },
          { id: 'elections', label: 'Elections Wizard', icon: Vote },
          { id: 'users', label: 'Voter & User Roles', icon: Users },
          { id: 'audit', label: 'Security Audit Logs', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: System Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats?.total_users || 0}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase">Active Elections</p>
              <p className="text-3xl font-bold text-emerald-400">{stats?.active_elections || 0}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase">Total Votes Cast</p>
              <p className="text-3xl font-bold text-blue-400">{stats?.total_votes_cast || 0}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase">Audit Log Events</p>
              <p className="text-3xl font-bold text-purple-400">{stats?.total_audit_events || 0}</p>
            </div>
          </div>

          {/* System Health */}
          {health && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <h4 className="text-sm font-bold text-white">System Status: {health.status?.toUpperCase()}</h4>
                  <p className="text-xs text-slate-400">Database Engine: {health.database} | Version: {health.version}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">{health.timestamp}</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Elections Wizard */}
      {activeTab === 'elections' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-lg font-bold text-white">Configured Elections</h3>
          <div className="space-y-4">
            {elections.map((election) => (
              <div key={election.id} className="p-4 bg-slate-900/80 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{election.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      election.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {election.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{election.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleStatus(election.id, election.status)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    {election.status === 'active' ? 'Close Voting' : 'Open Election'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Voter & User Roles */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-lg font-bold text-white">Registered Voters & Administrators</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">National ID</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="p-3">
                      <p className="font-semibold text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="p-3 font-mono">{u.national_id || 'N/A'}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value="voter">Voter</option>
                        <option value="election_officer">Election Officer</option>
                        <option value="election_admin">Election Admin</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="auditor">Auditor</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-[10px] text-slate-400">ID #{u.id}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Security Audit Stream */}
      {activeTab === 'audit' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-lg font-bold text-white">System Security Audit Trail</h3>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-blue-400">{log.action}</span>
                  <span className="text-slate-400 ml-2">by User #{log.user_id || 'System'}</span>
                </div>
                <span className="text-slate-400 font-mono">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Election Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">Create New Election</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateElection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Election Title</label>
                <input
                  type="text"
                  required
                  value={newElection.title}
                  onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                  placeholder="2026 Student Union Elections"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newElection.description}
                  onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                  placeholder="Official election for..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newElection.start_time}
                    onChange={(e) => setNewElection({ ...newElection, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newElection.end_time}
                    onChange={(e) => setNewElection({ ...newElection, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg"
              >
                Save & Initialize Election
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
