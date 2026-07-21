import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Vote, CheckCircle2, Clock, ShieldCheck, ArrowRight, Award, Lock, FileText } from 'lucide-react';

export const VoterDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const elecRes = await apiClient('/elections');
      if (elecRes.success) {
        setElections(elecRes.elections);
      }

      if (user) {
        const histRes = await apiClient('/voter/history');
        if (histRes.success) {
          setHistory(histRes.participations);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="relative glass-panel rounded-3xl p-8 overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Cryptographic Integrity Verified
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{user ? user.name : 'Eligible Voter'}</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Participate in active elections, submit cryptographically sealed votes, inspect live turnout analytics, and verify your immutable vote receipts on the public ledger.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigate('ballot')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-white gradient-button flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 hover:scale-105 transition-transform cursor-pointer"
            >
              <Vote className="w-5 h-5" />
              Go to Voting Ballot
            </button>
            <button
              onClick={() => onNavigate('audit')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl font-semibold text-slate-200 bg-slate-900/80 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              Verify Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Feature Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Vote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Elections</p>
            <p className="text-2xl font-bold text-white mt-1">
              {elections.filter(e => e.status === 'active').length} Available
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Votes Cast</p>
            <p className="text-2xl font-bold text-white mt-1">{history.length} Receipts Sealed</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Protocol</p>
            <p className="text-2xl font-bold text-white mt-1">SHA-256 Ledger</p>
          </div>
        </div>
      </div>

      {/* Active Elections Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Active & Scheduled Elections</h2>
            <p className="text-xs text-slate-400">Select an active election to view candidate manifestos and cast your vote</p>
          </div>
          <button
            onClick={() => onNavigate('results')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            View Live Results <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl animate-pulse h-48"></div>
            <div className="glass-card p-6 rounded-2xl animate-pulse h-48"></div>
          </div>
        ) : elections.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center">
            <Clock className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No active elections currently open</p>
            <p className="text-xs text-slate-500 mt-1">Check back soon when administrators open the next voting session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {elections.map((election) => (
              <div key={election.id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      election.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {election.status === 'active' ? '● Live Voting Open' : election.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Ends: {new Date(election.end_time).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">{election.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{election.description}</p>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                    <span>{election.categories ? election.categories.length : 0} Election Categories</span>
                    <span>One Vote per Category</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('ballot')}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Vote className="w-4 h-4" /> Cast Vote Now
                  </button>
                  <button
                    onClick={() => onNavigate('results')}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voter History Receipts Section */}
      {user && history.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> My Verified Vote Receipts
          </h2>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">Election & Position</th>
                    <th className="p-4">Cryptographic Receipt Code</th>
                    <th className="p-4">Voted Timestamp</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-white">{item.election?.title || 'General Election'}</p>
                        <p className="text-[11px] text-slate-400">{item.category?.name}</p>
                      </td>
                      <td className="p-4 font-mono text-emerald-400 font-semibold">{item.receipt_code}</td>
                      <td className="p-4 text-slate-400">{new Date(item.voted_at).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          SEALED & AUDITED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
