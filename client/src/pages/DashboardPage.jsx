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
  Target,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-bold text-sm">Loading your candidate dashboard...</p>
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
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Banner Card - Clean White with Blue Border */}
        <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-500 text-blue-600 text-xs font-bold">
              <Target className="w-3.5 h-3.5" />
              <span>Target Role: {user?.targetRole || 'Full Stack Engineer'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Track your practice performance, monitor AI evaluation metrics, and launch mock interviews.
            </p>
          </div>

          <Link
            to="/start"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all self-start sm:self-auto"
          >
            <div className="p-1 rounded-md border border-white/40 bg-white/20 text-white">
              <PlayCircle className="w-4 h-4" />
            </div>
            <span>Start Mock Interview</span>
          </Link>
        </div>

        {/* Metric Cards Grid - White Background with Crisp Blue Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Sessions Card */}
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-5 shadow-sm hover:border-blue-600 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Completed Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border-2 border-blue-500 text-blue-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{totalSessions}</span>
              <span className="text-xs font-bold text-slate-500">{technicalSessionsCount} Tech / {behavioralSessionsCount} Behav</span>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-5 shadow-sm hover:border-blue-600 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Average Overall Score</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border-2 border-blue-500 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{averageScore}<span className="text-sm text-slate-400 font-normal">/100</span></span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${
                averageScore >= 75
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                  : 'bg-amber-50 text-amber-700 border-amber-500'
              }`}>
                {averageScore >= 75 ? 'Strong' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* Technical Sessions Card */}
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-5 shadow-sm hover:border-blue-600 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Technical Practice</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border-2 border-blue-500 text-blue-600 flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{technicalSessionsCount}</span>
              <span className="text-xs font-bold text-slate-500">System & Code</span>
            </div>
          </div>

          {/* Behavioral Sessions Card */}
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-5 shadow-sm hover:border-blue-600 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Behavioral Practice</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border-2 border-blue-500 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{behavioralSessionsCount}</span>
              <span className="text-xs font-bold text-slate-500">Leadership & STAR</span>
            </div>
          </div>
        </div>

        {/* Analytics Row: Score History Chart + Topic Strengths */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Score History Graph (2 cols) */}
          <div className="lg:col-span-2 bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <div className="p-1 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span>Score Performance Trend</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">Session score overall history over practice time</p>
              </div>
            </div>

            <div className="h-64 w-full">
              {scoreHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#2563eb',
                        borderWidth: '2px',
                        borderRadius: '0.75rem',
                        color: '#0f172a',
                        fontWeight: 'bold'
                      }}
                      itemStyle={{ color: '#2563eb' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#blueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 text-center space-y-2">
                  <Clock className="w-8 h-8 text-blue-400" />
                  <p className="text-sm font-bold text-slate-700">No completed sessions yet.</p>
                  <p className="text-xs text-slate-500">Complete your first mock interview to generate score trends.</p>
                </div>
              )}
            </div>
          </div>

          {/* Topic Strengths & Focus Areas (1 col) */}
          <div className="space-y-6">
            {/* Strengths Card */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <div className="p-1 rounded-md border border-emerald-500 bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Top Strengths</span>
              </h3>
              <div className="space-y-3">
                {strengths.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border-2 border-blue-200">
                    <span className="text-xs font-bold text-slate-800">{item.category}</span>
                    <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-500">
                      {item.averageScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Areas Card */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <div className="p-1 rounded-md border border-amber-500 bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span>Focus Areas for Improvement</span>
              </h3>
              <div className="space-y-3">
                {focusAreas.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border-2 border-blue-200">
                    <span className="text-xs font-bold text-slate-800">{item.category}</span>
                    <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-500">
                      {item.averageScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Practice Sessions Table */}
        <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Recent Practice Sessions</h2>
              <p className="text-xs text-slate-500 font-medium">Review your past performance reports and question evaluations</p>
            </div>
            <Link to="/start" className="text-xs text-blue-600 font-extrabold hover:underline flex items-center space-x-1">
              <span>New Session</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-200 text-slate-600 text-xs font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-4">Role & Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Overall Score</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {recentSessions.map((s) => (
                    <tr key={s._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900">{s.role}</div>
                        <div className="text-xs text-slate-500 capitalize">{s.type} Interview &bull; {new Date(s.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          s.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                            : 'bg-blue-50 text-blue-700 border-blue-500'
                        }`}>
                          {s.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-mono font-semibold text-xs">
                        {s.questions?.length || 0} Questions
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-black text-slate-900 text-base">
                          {s.overallScore || 0}
                        </span>
                        <span className="text-xs text-slate-500">/100</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={s.status === 'completed' ? `/report/${s._id}` : `/interview/${s._id}`}
                          className="text-xs font-extrabold text-blue-600 hover:text-blue-700 border-2 border-blue-500 hover:bg-blue-50 px-3 py-1 rounded-lg inline-flex items-center space-x-1 transition-all"
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
            <div className="text-center py-10 border-2 border-dashed border-blue-300 rounded-xl">
              <p className="text-sm font-bold text-slate-600 mb-3">No interview sessions found.</p>
              <Link
                to="/start"
                className="inline-flex items-center space-x-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl border border-blue-700 shadow-md transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Start Your First Interview</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
