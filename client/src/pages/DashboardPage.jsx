import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDashboardSummaryApi, deleteSessionApi } from '../api/sessionApi';
import { updateUserProfile } from '../features/auth/authSlice';
import { useTheme } from '../context/ThemeContext';
import { UGC_VERIFIED_UNIVERSITIES } from '../data/ugcUniversities';
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
  Target,
  Trash2,
  AlertCircle,
  X,
  GraduationCap,
  Github,
  Edit3,
  ExternalLink,
  BookOpen,
  Check,
  Building2,
  Sun,
  Moon,
} from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Profile Edit Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    degree: user?.degree || 'B.Tech Computer Science & Engineering',
    currentYear: user?.currentYear || '3rd Year',
    currentSemester: user?.currentSemester || 'Semester 6',
    university: user?.university || 'Delhi Technological University (DTU)',
    leetcodeUrl: user?.leetcodeUrl || '',
    githubUrl: user?.githubUrl || '',
  });

  // UGC Autocomplete State
  const [uniInput, setUniInput] = useState(user?.university || 'Delhi Technological University (DTU)');
  const [uniSuggestions, setUniSuggestions] = useState([]);
  const [showUniDropdown, setShowUniDropdown] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await getDashboardSummaryApi();
      setData(res.summary);
    } catch (err) {
      console.error('Failed to load summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        degree: user.degree || 'B.Tech Computer Science & Engineering',
        currentYear: user.currentYear || '3rd Year',
        currentSemester: user.currentSemester || 'Semester 6',
        university: user.university || 'Delhi Technological University (DTU)',
        leetcodeUrl: user.leetcodeUrl || '',
        githubUrl: user.githubUrl || '',
      });
      setUniInput(user.university || 'Delhi Technological University (DTU)');
    }
  }, [user]);

  const handleUniInputChange = (e) => {
    const val = e.target.value;
    setUniInput(val);
    setProfileForm({ ...profileForm, university: val });

    if (val.trim().length > 1) {
      const matches = UGC_VERIFIED_UNIVERSITIES.filter((u) =>
        u.toLowerCase().includes(val.toLowerCase())
      );
      setUniSuggestions(matches);
      setShowUniDropdown(true);
    } else {
      setUniSuggestions([]);
      setShowUniDropdown(false);
    }
  };

  const selectUniversity = (uniName) => {
    setUniInput(uniName);
    setProfileForm({ ...profileForm, university: uniName });
    setShowUniDropdown(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await dispatch(updateUserProfile(profileForm));
      setIsEditProfileOpen(false);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    try {
      setDeleting(true);
      await deleteSessionApi(sessionToDelete._id);
      setSessionToDelete(null);
      await fetchSummary();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete interview session.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-900 font-baskerville">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 dark:text-slate-300 font-bold text-sm">Loading your candidate dashboard...</p>
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
    <div className="bg-white dark:bg-slate-900 min-h-screen py-8 font-baskerville transition-colors text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Student Academic & Developer Profile Banner Card */}
        <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Candidate Info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 font-sans">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 text-xs font-bold">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{user?.degree || 'B.Tech Computer Science & Engineering'}</span>
                </span>

                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{user?.currentYear || '3rd Year'} &bull; {user?.currentSemester || 'Semester 6'}</span>
                </span>

                {/* Theme Switcher Badge on Dashboard */}
                <button
                  onClick={toggleTheme}
                  className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-xs font-bold hover:border-blue-500 transition-colors"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Dark Theme</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Theme</span>
                    </>
                  )}
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-baskerville">
                {user?.name || 'Candidate'}
              </h1>

              {/* UGC Verified University Tag */}
              <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                <span className="inline-flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-200 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{user?.university || 'Delhi Technological University (DTU)'}</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-extrabold text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-800/60 px-1.5 py-0.5 rounded">UGC Verified</span>
                </span>
              </div>
            </div>

            {/* Developer Profiles & Actions */}
            <div className="flex flex-wrap items-center gap-3 font-sans">
              {user?.leetcodeUrl ? (
                <a
                  href={user.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-400 dark:border-amber-700 hover:bg-amber-100 font-bold text-xs transition-colors shadow-sm"
                >
                  <span className="w-4 h-4 rounded bg-amber-500 text-white font-black text-[10px] flex items-center justify-center">LC</span>
                  <span>LeetCode Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  <span className="w-4 h-4 rounded bg-slate-400 text-white font-black text-[10px] flex items-center justify-center">LC</span>
                  <span>+ Add LeetCode</span>
                </button>
              )}

              {user?.githubUrl ? (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 font-bold text-xs transition-colors shadow-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  <Github className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>+ Add GitHub</span>
                </button>
              )}

              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border-2 border-blue-500 dark:border-blue-400 font-extrabold text-xs transition-all shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Student Profile</span>
              </button>

              <Link
                to="/start"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 text-xs transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Start Mock Interview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-baskerville">
          <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:border-blue-600 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-sans">Completed Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-500 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-baskerville">{totalSessions}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">{technicalSessionsCount} Tech / {behavioralSessionsCount} Behav</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:border-blue-600 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-sans">Average Overall Score</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-500 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-baskerville">{averageScore}<span className="text-sm text-slate-400 font-normal">/100</span></span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border font-sans ${
                averageScore >= 75
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-500'
                  : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-500'
              }`}>
                {averageScore >= 75 ? 'Strong' : 'In Progress'}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:border-blue-600 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-sans">Technical Practice</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-500 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-baskerville">{technicalSessionsCount}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">System & Code</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:border-blue-600 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-sans">Behavioral Practice</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-500 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-baskerville">{behavioralSessionsCount}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">Leadership & STAR</span>
            </div>
          </div>
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2 font-baskerville">
                  <div className="p-1 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span>Score Performance Trend</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-baskerville">Session score overall history over practice time</p>
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
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={11} />
                    <YAxis domain={[0, 100]} stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                        borderColor: '#2563eb',
                        borderWidth: '2px',
                        borderRadius: '0.75rem',
                        color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                        fontWeight: 'bold'
                      }}
                      itemStyle={{ color: '#2563eb' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#blueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-blue-300 dark:border-slate-700 rounded-xl p-6 text-center space-y-2 font-baskerville">
                  <Clock className="w-8 h-8 text-blue-400" />
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300 font-baskerville">No completed sessions yet.</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-baskerville">Complete your first mock interview to generate score trends.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 font-baskerville">
            <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2 font-baskerville">
                <div className="p-1 rounded-md border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Top Strengths</span>
              </h3>
              <div className="space-y-3">
                {strengths.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border-2 border-blue-200 dark:border-slate-600">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-baskerville">{item.category}</span>
                    <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500 font-sans">
                      {item.averageScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2 font-baskerville">
                <div className="p-1 rounded-md border border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span>Focus Areas for Improvement</span>
              </h3>
              <div className="space-y-3">
                {focusAreas.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border-2 border-blue-200 dark:border-slate-600">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-baskerville">{item.category}</span>
                    <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-500 font-sans">
                      {item.averageScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Practice Sessions Table */}
        <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 font-baskerville">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-baskerville">Recent Practice Sessions</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-baskerville">Review your past performance reports or remove previous practice attempts</p>
            </div>
            <Link to="/start" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1 font-sans">
              <span>New Session</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-baskerville">
                <thead>
                  <tr className="border-b-2 border-blue-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-extrabold uppercase tracking-wider font-sans">
                    <th className="py-3 px-4">Role & Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Overall Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                  {recentSessions.map((s) => (
                    <tr key={s._id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white text-base">{s.role}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{s.type} Interview &bull; {s.language || 'Tech'} ({s.difficulty || 'Mid'}) &bull; {new Date(s.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-4 font-sans">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          s.status === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-500'
                            : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-500'
                        }`}>
                          {s.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs">
                        {s.questions?.length || 0} Questions
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-black text-slate-900 dark:text-white text-base">
                          {s.overallScore || 0}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">/100</span>
                      </td>
                      <td className="py-4 px-4 text-right font-sans">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={s.status === 'completed' ? `/report/${s._id}` : `/interview/${s._id}`}
                            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 border-2 border-blue-500 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 px-3 py-1 rounded-lg inline-flex items-center space-x-1 transition-all"
                          >
                            <span>{s.status === 'completed' ? 'View Report' : 'Resume'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => setSessionToDelete(s)}
                            title="Delete Session"
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-blue-300 dark:border-slate-700 rounded-xl">
              <p className="text-base font-bold text-slate-600 dark:text-slate-400 mb-3 font-baskerville">No interview sessions found.</p>
              <Link
                to="/start"
                className="inline-flex items-center space-x-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl border border-blue-700 shadow-md transition-all font-sans"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Start Your First Interview</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white dark:bg-slate-800 border-2 border-rose-500 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-fadeIn">
            <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <div className="p-1.5 rounded-lg border-2 border-rose-600 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span>Confirm Session Deletion</span>
              </h3>
              <button
                onClick={() => setSessionToDelete(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed font-baskerville">
                Are you sure you want to delete this <strong className="text-slate-900 dark:text-white">{sessionToDelete.role}</strong> session ({sessionToDelete.questions?.length || 0} Questions, Score: {sessionToDelete.overallScore || 0}/100)?
              </p>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                This action is permanent and will remove the session from your performance analytics.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setSessionToDelete(null)}
                className="w-1/2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 transition-colors text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteSession}
                disabled={deleting}
                className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 px-4 rounded-xl border-2 border-rose-700 shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 text-sm"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-blue-400 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <div className="p-1.5 rounded-lg border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span>Edit Student & Developer Profile</span>
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                  Degree / Academic Program
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.degree}
                  onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  className="w-full bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-600 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                    Current Year
                  </label>
                  <select
                    value={profileForm.currentYear}
                    onChange={(e) => setProfileForm({ ...profileForm, currentYear: e.target.value })}
                    className="w-full bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-600 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduated">Graduated / Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                    Current Semester
                  </label>
                  <select
                    value={profileForm.currentSemester}
                    onChange={(e) => setProfileForm({ ...profileForm, currentSemester: e.target.value })}
                    className="w-full bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-600 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>University / Institute</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700 font-bold">
                    ✔ UGC Verified Suggestions
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={uniInput}
                  onChange={handleUniInputChange}
                  placeholder="Type university name (e.g. Parul University, DTU, IIT, BITS)..."
                  className="w-full bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-600 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                />

                {showUniDropdown && uniSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                    {uniSuggestions.map((uni, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectUniversity(uni)}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors text-xs font-bold text-slate-800 dark:text-slate-200"
                      >
                        <span>{uni}</span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-extrabold bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">UGC Verified</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <span className="w-3.5 h-3.5 rounded bg-amber-500 text-white font-black text-[9px] flex items-center justify-center">LC</span>
                  <span>LeetCode Profile Link</span>
                </label>
                <input
                  type="url"
                  value={profileForm.leetcodeUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, leetcodeUrl: e.target.value })}
                  placeholder="https://leetcode.com/your-username"
                  className="w-full bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-600 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Github className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                  <span>GitHub Profile Link</span>
                </label>
                <input
                  type="url"
                  value={profileForm.githubUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/your-username"
                  className="w-full bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-600 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t-2 border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="w-1/2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 transition-colors text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-4 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 text-sm"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Profile Info</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
