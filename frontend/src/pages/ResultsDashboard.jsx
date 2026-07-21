import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { BarChart3, Download, Trophy, Users, Activity, CheckCircle2, RefreshCw } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ResultsDashboard = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await apiClient('/elections');
      if (res.success && res.elections.length > 0) {
        setElections(res.elections);
        setSelectedElectionId(res.elections[0].id);
        fetchResults(res.elections[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchResults = async (electionId) => {
    setLoading(true);
    try {
      const res = await apiClient(`/elections/${electionId}/results`);
      if (res.success) {
        setResultsData(res.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    if (!selectedElectionId) return;
    window.open(`/api/v1/elections/${selectedElectionId}/export/${format}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Results Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Real-Time Election Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Live Turnout & Vote Tally</h1>
          <p className="text-xs text-slate-400 mt-1">Automated vote aggregate counts & verified candidate percentage breakdowns.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {elections.length > 1 && (
            <select
              value={selectedElectionId || ''}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedElectionId(id);
                fetchResults(id);
              }}
              className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none"
            >
              {elections.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => fetchResults(selectedElectionId)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Voter Turnout Metrics Grid */}
      {resultsData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Voters</p>
              <p className="text-2xl font-bold text-white mt-1">{resultsData.turnout?.registered_voters || 0}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ballots Cast</p>
              <p className="text-2xl font-bold text-white mt-1">{resultsData.turnout?.participated_voters || 0}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Turnout Percentage</p>
              <p className="text-2xl font-bold text-white mt-1">{resultsData.turnout?.turnout_percentage || 0}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Category Results Section */}
      {loading ? (
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl animate-pulse h-64"></div>
          <div className="glass-card p-8 rounded-3xl animate-pulse h-64"></div>
        </div>
      ) : !resultsData?.categories?.length ? (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <p className="text-sm font-semibold text-slate-400">No results recorded yet for this election.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {resultsData.categories.map((category) => {
            const chartData = {
              labels: category.candidates.map(c => c.name),
              datasets: [
                {
                  label: 'Votes Received',
                  data: category.candidates.map(c => c.vote_count),
                  backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(16, 185, 129, 0.7)'],
                  borderRadius: 8,
                },
              ],
            };

            const chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
              },
            };

            return (
              <div key={category.id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{category.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Total Category Votes: {category.total_category_votes}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  
                  {/* Candidate Bars */}
                  <div className="space-y-4">
                    {category.candidates.map((cand) => (
                      <div key={cand.id} className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{cand.name}</span>
                            {cand.is_winner && (
                              <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                                <Trophy className="w-3 h-3" /> LEADING WINNER
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-blue-400">{cand.vote_count} votes ({cand.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              cand.is_winner ? 'bg-gradient-to-r from-amber-500 to-emerald-400' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.max(cand.percentage, 2)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart.js Visualization */}
                  <div className="h-64 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                    <Bar data={chartData} options={chartOptions} />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
