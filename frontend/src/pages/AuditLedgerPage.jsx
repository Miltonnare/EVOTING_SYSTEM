import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Lock, Search, CheckCircle2, AlertCircle, ShieldCheck, FileCheck } from 'lucide-react';

export const AuditLedgerPage = () => {
  const [receiptCode, setReceiptCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!receiptCode.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await apiClient(`/votes/verify/${encodeURIComponent(receiptCode.trim())}`);
      if (res.success) {
        setResult(res.receipt);
      } else {
        setError(res.message || 'Receipt code not found in cryptographic audit stream.');
      }
    } catch (err) {
      setError(err.message || 'Receipt code invalid or unverified.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl text-center space-y-3 relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Public Cryptographic Audit Ledger</h1>
        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          Verify vote inclusion in the immutable ledger using your unique receipt code. This verification validates that your ballot was counted without revealing candidate choices.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-xs font-semibold text-slate-300">Enter Cryptographic Receipt Code</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                required
                value={receiptCode}
                onChange={(e) => setReceiptCode(e.target.value)}
                placeholder="e.g. VOTE-A1B2-C3D4-E5F6"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-white text-sm font-mono focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify Receipt'}
            </button>
          </div>
        </form>
      </div>

      {/* Verification Result display */}
      {result && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/30 space-y-6 animate-slide-up">
          <div className="flex items-center gap-3 text-emerald-400 border-b border-emerald-500/20 pb-4">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">Cryptographically Verified</h3>
              <p className="text-xs text-emerald-300">Receipt matches authentic entry in the ballot ledger stream.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-slate-400 font-medium">Receipt Code:</span>
              <p className="font-mono text-emerald-400 font-bold">{result.receipt_code}</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-slate-400 font-medium">Status:</span>
              <p className="font-bold text-emerald-300">{result.status}</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-slate-400 font-medium">Election:</span>
              <p className="font-semibold text-white">{result.election}</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-slate-400 font-medium">Position Category:</span>
              <p className="font-semibold text-white">{result.category}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Timestamp: {new Date(result.voted_at).toLocaleString()}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Zero-Knowledge Verified
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-rose-950/30 flex items-center gap-3 text-rose-300">
          <AlertCircle className="w-6 h-6 shrink-0 text-rose-400" />
          <div>
            <p className="font-bold text-white text-sm">Receipt Verification Failed</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

    </div>
  );
};
