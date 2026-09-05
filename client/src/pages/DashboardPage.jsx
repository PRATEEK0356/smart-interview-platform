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
  AlertCircle,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-slate-50">
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
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Momentum Banner: "Where Am I Now" signal in < 3 seconds */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Target Role: {user?.targetRole || 'Full Stack Engineer'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>

            <p className="text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
              Your overall preparation score is currently <strong className="text-blue-700">{averageScore}/100</strong>. Practice regularly to sharpen technical depth and delivery.
            </p>
          </div>

          {/* Primary Action Button */}
          <Link
            to="/start"
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-xl border border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all self-start sm:self-auto"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Start mock interview</span>
          </Link>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Average Score & Momentum */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Average Score</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{averageScore}<span className="text-sm text-slate-400 font-normal">/100</span></span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300">
                +8 pts trend
              </span>
            </div>
          </div>

          {/* Total Sessions Completed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Sessions Practice</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{totalSessions}</span>
              <span className="text-xs font-bold text-slate-500">{technicalSessionsCount} Tech / {behavioralSessionsCount} Behav</span>
            </div>
          </div>

          {/* Technical Sessions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Technical Depth</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <Code className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{technicalSessionsCount}</span>
              <span className="text-xs font-bold text-slate-500">System & Code</span>
            </div>
          </div>

          {/* Behavioral STAR Sessions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Behavioral STAR</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{behavioralSessionsCount}</span>
              <span className="text-xs font-bold text-slate-500">Leadership Stories</span>
            </div>
          </div>
        </div>

        {/* Performance Graph + Strengths & Growth Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Score History Graph (2 cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Performance Score History</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">Session scores over practice timeline</p>
              </div>
            </div>

            <div className="h-64 w-full">
              {scoreHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#1D4ED8',
                        borderWidth: '1.5px',
                        borderRadius: '0.75rem',
                        color: '#0f172a',
                        fontWeight: 'bold'
                      }}
                      itemStyle={{ color: '#1D4ED8' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#1D4ED8" strokeWidth={3} fillOpacity={1} fill="url(#blueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <p className="text-sm font-bold text-slate-800">Ready for your first mock interview?</p>
                  <p className="text-xs text-slate-500">Complete your first practice session to build your performance trend.</p>
                  <Link
                    to="/start"
                    className="mt-2 inline-flex items-center space-x-1.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Start mock interview</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Strengths & Growth Areas (1 col) */}
          <div className="space-y-6">
            {/* Top Strengths */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Top Performance Strengths</span>
              </h3>
              <div className="space-y-3">
                {strengths.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <span className="text-xs font-bold text-slate-800">{item.category}</span>
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                      {item.averageScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Areas (Ochre/Amber - NOT punitive red) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Room for Growth</span>
              </h3>
              <div className="space-y-3">
                {focusAreas.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                    <span className="text-xs font-bold text-slate-800">{item.category}</span>
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-amber-600 text-white">
                      {item.averageScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Practice Sessions Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Recent Practice Sessions</h2>
              <p className="text-xs text-slate-500 font-medium">Review your past performance reports and mentor feedback</p>
            </div>
            <Link to="/start" className="text-xs text-blue-600 font-extrabold hover:underline flex items-center space-x-1">
              <span>Start mock interview</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-4">Role & Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {recentSessions.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900">{s.role}</div>
                        <div className="text-xs text-slate-500 capitalize">{s.type} Interview &bull; {new Date(s.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                          s.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-blue-50 text-blue-700 border border-blue-300'
                        }`}>
                          {s.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-mono font-bold text-xs">
                        {s.questions?.length || 0} Questions
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-black text-slate-900 text-base">
                          {s.overallScore || 0}
                        </span>
                        <span className="text-xs text-slate-400">/100</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={s.status === 'completed' ? `/report/${s._id}` : `/interview/${s._id}`}
                          className="text-xs font-extrabold text-blue-600 hover:text-blue-700 border border-blue-300 hover:bg-blue-50 px-3 py-1 rounded-lg inline-flex items-center space-x-1 transition-all"
                        >
                          <span>{s.status === 'completed' ? 'View feedback report' : 'Resume'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
              <p className="text-sm font-bold text-slate-700 mb-3">Ready for your first mock interview?</p>
              <Link
                to="/start"
                className="inline-flex items-center space-x-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl shadow-sm transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Start mock interview</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
