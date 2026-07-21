import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../api/client';
import { Vote, CheckCircle2, AlertCircle, ShieldCheck, Lock, User, FileText, ArrowRight, X } from 'lucide-react';

export const BallotPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [ballotData, setBallotData] = useState(null);
  const [selections, setSelections] = useState({}); // { categoryId: candidateId }
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [receiptResult, setReceiptResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await apiClient('/elections');
      if (res.success && res.elections.length > 0) {
        setElections(res.elections);
        const active = res.elections.find(e => e.status === 'active') || res.elections[0];
        setSelectedElectionId(active.id);
        fetchBallot(active.id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load elections.', 'error');
      setLoading(false);
    }
  };

  const fetchBallot = async (electionId) => {
    setLoading(true);
    try {
      const res = await apiClient(`/elections/${electionId}/ballot`);
      if (res.success) {
        setBallotData(res);
        setSelections({});
      }
    } catch (err) {
      addToast(err.message || 'Failed to load ballot.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (categoryId, candidateId) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: candidateId,
    }));
  };

  const handleOpenConfirm = () => {
    if (!ballotData || !ballotData.categories) return;

    // Ensure voter made a selection for all unvoted categories
    const unvotedCategories = ballotData.categories.filter(c => !c.has_voted);
    for (let cat of unvotedCategories) {
      if (!selections[cat.id]) {
        addToast(`Please select a candidate for category: ${cat.name}`, 'error');
        return;
      }
    }

    setConfirmModal(true);
  };

  const handleSubmitBallot = async () => {
    if (!selectedElectionId) return;
    setSubmitting(true);

    try {
      const res = await apiClient(`/elections/${selectedElectionId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ votes: selections }),
      });

      if (res.success) {
        addToast('Vote cast successfully! Receipt generated.', 'success');
        setReceiptResult(res);
        setConfirmModal(false);
        fetchBallot(selectedElectionId); // Refresh ballot state
      } else {
        addToast(res.message || 'Vote submission failed.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit vote.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 glass-panel p-8 rounded-3xl text-center space-y-4">
        <Lock className="w-12 h-12 text-blue-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Authentication Required</h2>
        <p className="text-xs text-slate-400">Please sign in with your registered voter account to cast your vote.</p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Election Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">Official Electronic Ballot</span>
          <h1 className="text-2xl font-bold text-white">{ballotData?.election?.title || 'Loading Ballot...'}</h1>
          <p className="text-xs text-slate-400 mt-1">Select exactly one candidate per position category below.</p>
        </div>

        {elections.length > 1 && (
          <select
            value={selectedElectionId || ''}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedElectionId(id);
              fetchBallot(id);
            }}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none"
          >
            {elections.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        )}
      </div>

      {/* Success Receipt Modal */}
      {receiptResult && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/40 space-y-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">Ballot Submitted & Cryptographically Sealed</h3>
              <p className="text-xs text-emerald-300">Your selections have been anonymized and appended to the immutable election ledger.</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/20 space-y-3">
            <p className="text-xs font-semibold uppercase text-slate-400">Official Vote Receipt Codes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(receiptResult.receipts || {}).map(([categoryName, code]) => (
                <div key={categoryName} className="p-3 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-300">{categoryName}</p>
                    <p className="text-xs font-mono font-bold text-emerald-400">{code}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">VERIFIED</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onNavigate('audit')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Verify Receipts on Public Audit Ledger
            </button>
            <button
              onClick={() => setReceiptResult(null)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white"
            >
              Close Receipt Banner
            </button>
          </div>
        </div>
      )}

      {/* Category Ballot Cards */}
      {loading ? (
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl animate-pulse h-64"></div>
          <div className="glass-card p-8 rounded-3xl animate-pulse h-64"></div>
        </div>
      ) : ballotData?.categories?.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No active candidate positions for this election.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {ballotData?.categories?.map((category) => (
            <div key={category.id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{category.name}</h2>
                    {category.has_voted && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        VOTE RECORDED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{category.description}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/5">
                  Select {category.max_selections} Candidate
                </span>
              </div>

              {/* Candidates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.candidates.map((candidate) => {
                  const isSelected = selections[category.id] === candidate.id;
                  const disabled = category.has_voted;

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => !disabled && handleCandidateSelect(category.id, candidate.id)}
                      className={`glass-card p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50'
                          : 'border-white/10 hover:border-white/20'
                      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={candidate.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="space-y-1 flex-1">
                          <h3 className="text-base font-bold text-white flex items-center justify-between">
                            {candidate.name}
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-600'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </h3>
                          <p className="text-xs font-semibold text-blue-400">{candidate.party_affiliation}</p>
                          <p className="text-xs text-slate-400 mt-2 line-clamp-2">{candidate.biography}</p>
                          {candidate.manifesto && (
                            <p className="text-[11px] text-slate-300 italic mt-2 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                              "{candidate.manifesto}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}

          {/* Submit Ballot Bar */}
          {!ballotData?.voter_has_completed && (
            <div className="sticky bottom-6 glass-panel p-4 sm:p-6 rounded-2xl border border-blue-500/30 shadow-2xl flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white">Ready to Seal Ballot?</p>
                <p className="text-xs text-slate-400">Review your selections carefully. Votes cannot be edited after submission.</p>
              </div>
              <button
                onClick={handleOpenConfirm}
                className="px-8 py-3.5 rounded-2xl font-bold text-white gradient-button flex items-center gap-2 shadow-xl shadow-blue-600/30 hover:scale-105 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" /> Submit Ballot
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 text-blue-400">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">Confirm Ballot Submission</h3>
              </div>
              <button onClick={() => setConfirmModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              You are about to cast your vote for the following candidate selections. Once submitted, your selections are permanent:
            </p>

            <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-white/5">
              {ballotData?.categories?.filter(c => !c.has_voted).map((cat) => {
                const selectedCandId = selections[cat.id];
                const cand = cat.candidates.find(c => c.id === selectedCandId);
                return (
                  <div key={cat.id} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                    <span className="text-slate-400 font-medium">{cat.name}:</span>
                    <span className="text-white font-bold">{cand ? cand.name : 'None Selected'}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmModal(false)}
                className="w-1/2 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800"
              >
                Back to Edit
              </button>
              <button
                onClick={handleSubmitBallot}
                disabled={submitting}
                className="w-1/2 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30"
              >
                {submitting ? 'Encrypting & Transmitting...' : 'Confirm & Cast Vote'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
