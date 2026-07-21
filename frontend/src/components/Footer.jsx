import React from 'react';
import { ShieldCheck, Lock, Activity, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CIVICVOTE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise-grade digital voting platform engineered for extreme transparency, auditability, and tamper-evident elections.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-4">Security Standards</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-emerald-400" /> SHA-256 Receipt Hashes</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Argon2id Password Encryption</li>
              <li className="flex items-center gap-2"><Award className="w-3.5 h-3.5 text-purple-400" /> Immutable Audit Ledger</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-4">System Status</h4>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <p className="text-xs font-semibold text-white">All Systems Operational</p>
                <p className="text-[10px] text-slate-400">Cryptographic Node Online</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-4">Compliance</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully compliant with international electronic voting standards, voter privacy protocols, and zero-knowledge participation validation.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CivicVote Platform Inc. All rights reserved.</p>
          <div className="flex gap-6 text-slate-400">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Security Whitepaper</span>
            <span className="hover:text-white cursor-pointer">Public API</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
