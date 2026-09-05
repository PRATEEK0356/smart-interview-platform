import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
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
  Zap,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();
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
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Loading your candidate dashboard...</p>
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
      {/* AI Hero Banner Container with Generated Illustration */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-purple-100 dark:border-slate-800 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4 z-10">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>AI-Powered Prep Platform</span>
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Accelerate Your Career with <span className="bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent">AI Mock Interviews</span>
            </h1>

            <p className="text-sm text-purple-100/90 leading-relaxed max-w-xl">
              Welcome back, <strong className="text-white">{user?.name || 'Candidate'}</strong>! Practice role-specific technical questions, receive instant speech/NLP feedback, and track your facial engagement.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/start"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-purple-900/40 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Launch Mock Interview</span>
              </Link>
            </div>
          </div>

          {/* Right Hero AI Illustration */}
          <div className="lg:col-span-5 relative h-56 sm:h-72 lg:h-full min-h-[260px] overflow-hidden">
            <img
              src="/interview_hero_banner.jpg"
              alt="AI Holographic Interview Analytics"
              className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-purple-950/80 lg:to-transparent" />
          </div>
        </div>
      </div>

      {/* Metric Cards Grid (Purple & White / Dark Mode responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="bg-white dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completed Sessions</span>
            <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{totalSessions}</span>
            <span className="text-xs text-slate-500 font-medium">{technicalSessionsCount} Tech / {behavioralSessionsCount} Behav</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Average Overall Score</span>
            <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{averageScore}<span className="text-sm text-slate-400 font-normal">/100</span></span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${averageScore >= 75 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600'}`}>
              {averageScore >= 75 ? 'Strong' : 'In Progress'}
            </span>
          </div>
        </div>

        {/* Technical Mastery */}
        <div className="bg-white dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Technical Sessions</span>
            <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <Code className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{technicalSessionsCount}</span>
            <span className="text-xs text-slate-500 font-medium">System & Code</span>
          </div>
        </div>

        {/* Behavioral Mastery */}
        <div className="bg-white dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Behavioral Sessions</span>
            <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{behavioralSessionsCount}</span>
            <span className="text-xs text-slate-500 font-medium">Leadership & STAR</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Row: Score History Chart + Strengths/Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score History Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Score Performance Trend</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Session score overall history over practice time</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {scoreHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="date" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} />
                  <YAxis domain={[0, 100]} stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                      borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      borderRadius: '0.75rem',
                      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                    itemStyle={{ color: '#9333ea' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">No completed sessions yet.</p>
                <p className="text-xs text-slate-400">Complete your first mock interview to generate score trends.</p>
              </div>
            )}
          </div>
        </div>

        {/* Topic Strengths & Focus Areas (1 col) */}
        <div className="space-y-6">
          {/* Strengths Card */}
          <div className="bg-white dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Top Strengths</span>
            </h3>
            <div className="space-y-3">
              {strengths.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-purple-100 dark:border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.category}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {item.averageScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Areas Card */}
          <div className="bg-white dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Focus Areas for Improvement</span>
            </h3>
            <div className="space-y-3">
              {focusAreas.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-purple-100 dark:border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.category}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {item.averageScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-white dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Practice Sessions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review your past performance reports and question evaluations</p>
          </div>
          <Link to="/start" className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center space-x-1">
            <span>New Session</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Role & Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 dark:divide-slate-800/60 text-sm">
                {recentSessions.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{s.role}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{s.type} Interview &bull; {new Date(s.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        s.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      }`}>
                        {s.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                      {s.questions?.length || 0} Questions
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-black text-slate-900 dark:text-white text-base">
                        {s.overallScore || 0}
                      </span>
                      <span className="text-xs text-slate-400">/100</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={s.status === 'completed' ? `/report/${s._id}` : `/interview/${s._id}`}
                        className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 inline-flex items-center space-x-1"
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
          <div className="text-center py-10 border border-dashed border-purple-100 dark:border-slate-800 rounded-2xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No interview sessions found.</p>
            <Link
              to="/start"
              className="inline-flex items-center space-x-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white py-2.5 px-4 rounded-xl transition-all shadow-md shadow-purple-600/20"
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
