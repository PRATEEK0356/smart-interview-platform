import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDashboardSummaryApi } from '../api/sessionApi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Clock,
  Code,
  Users,
  ChevronRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await getDashboardSummaryApi();
        setData(res.summary);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard summary.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium text-sm">Loading your candidate dashboard...</p>
      </div>
    );
  }

  const {
    totalSessions = 0,
    averageScore = 0,
    technicalSessionsCount = 0,
    behavioralSessionsCount = 0,
    scoreHistory = [],
    strengths = [],
    focusAreas = [],
    recentSessions = [],
  } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target Role: {user?.targetRole || 'Full Stack Engineer'}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Track your interview performance trends, analyze topic strengths, and launch AI mock interview sessions.
          </p>
        </div>

        <Link
          to="/start"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center space-x-2 transition-all self-start sm:self-auto"
        >
          <PlayCircle className="w-5 h-5" />
          <span>Start Mock Interview</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Sessions</span>
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{totalSessions}</span>
            <span className="text-xs text-slate-400">{technicalSessionsCount} Tech / {behavioralSessionsCount} Behav</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Overall Score</span>
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{averageScore}<span className="text-sm text-slate-500 font-normal">/100</span></span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${averageScore >= 75 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {averageScore >= 75 ? 'Strong' : 'In Progress'}
            </span>
          </div>
        </div>

        {/* Technical Mastery */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Technical Sessions</span>
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400">
              <Code className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{technicalSessionsCount}</span>
            <span className="text-xs text-slate-400">System & Code</span>
          </div>
        </div>

        {/* Behavioral Mastery */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Behavioral Sessions</span>
            <div className="p-2 rounded-xl bg-purple-600/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{behavioralSessionsCount}</span>
            <span className="text-xs text-slate-400">Leadership & STAR</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Row: Score History Chart + Strengths/Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score History Chart (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span>Score Performance Trend</span>
              </h2>
              <p className="text-xs text-slate-400">Session overall score history over time</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {scoreHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-600" />
                <p className="text-sm text-slate-400">No completed sessions yet.</p>
                <p className="text-xs text-slate-500">Complete your first mock interview to generate score trends.</p>
              </div>
            )}
          </div>
        </div>

        {/* Topic Strengths & Focus Areas (1 col) */}
        <div className="space-y-6">
          {/* Strengths Card */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Top Strengths</span>
            </h3>
            <div className="space-y-3">
              {strengths.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-200">{item.category}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.averageScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Areas Card */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Focus Areas for Improvement</span>
            </h3>
            <div className="space-y-3">
              {focusAreas.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-200">{item.category}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.averageScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Interview Sessions</h2>
            <p className="text-xs text-slate-400">Review your past performance reports and question evaluations</p>
          </div>
          <Link to="/start" className="text-xs text-blue-400 font-semibold hover:underline flex items-center space-x-1">
            <span>New Session</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Role & Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {recentSessions.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{s.role}</div>
                      <div className="text-xs text-slate-400 capitalize">{s.type} Interview &bull; {new Date(s.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        s.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {s.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-mono text-xs">
                      {s.questions?.length || 0} Questions
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-white text-base">
                        {s.overallScore || 0}
                      </span>
                      <span className="text-xs text-slate-500">/100</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={s.status === 'completed' ? `/report/${s._id}` : `/interview/${s._id}`}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1"
                      >
                        <span>{s.status === 'completed' ? 'View Report' : 'Resume'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-sm text-slate-400 mb-3">No interview sessions found.</p>
            <Link
              to="/start"
              className="inline-flex items-center space-x-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start Your First Interview</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
