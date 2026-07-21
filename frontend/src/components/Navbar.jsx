import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Vote, ShieldCheck, BarChart3, Lock, LogOut, User as UserIcon, Menu, X, ShieldAlert } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">Super Admin</span>;
      case 'election_admin':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">Election Admin</span>;
      case 'election_officer':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Officer</span>;
      case 'auditor':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Auditor</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Voter</span>;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Vote, roles: ['voter', 'election_admin', 'super_admin', 'election_officer', 'auditor'] },
    { id: 'ballot', label: 'Cast Vote', icon: ShieldCheck, roles: ['voter', 'election_admin', 'super_admin'] },
    { id: 'results', label: 'Live Results', icon: BarChart3, roles: ['voter', 'election_admin', 'super_admin', 'election_officer', 'auditor'] },
    { id: 'audit', label: 'Audit Ledger', icon: Lock, roles: ['voter', 'election_admin', 'super_admin', 'election_officer', 'auditor'] },
    { id: 'admin', label: 'Admin Portal', icon: ShieldAlert, roles: ['super_admin', 'election_admin', 'election_officer', 'auditor'] },
  ];

  const filteredItems = navItems.filter(item => !user || item.roles.includes(user.role));

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                CIVIC<span className="text-blue-400">VOTE</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold block">Enterprise E-Voting Platform</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Section / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-900/80 p-2 pl-4 rounded-2xl border border-white/10">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold text-white leading-tight">{user.name}</span>
                  <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
                >
                  Register Voter
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/60"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-white/10 px-4 pt-3 pb-6 space-y-2">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          {user ? (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMobileOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setMobileOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
