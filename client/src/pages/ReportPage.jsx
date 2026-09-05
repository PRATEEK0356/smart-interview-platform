import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSessionByIdApi } from '../api/sessionApi';
import {
  Award,
  Calendar,
  CheckCircle2,
  Tag,
  ArrowLeft,
  PlayCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  FileText,
} from 'lucide-react';

const ReportPage = () => {
  const { id: sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await getSessionByIdApi(sessionId);
        setSession(data.session);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) {
      loadReport();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium text-sm">Compiling interview session report...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm mb-6 inline-block">
          {error || 'Session report not found.'}
        </div>
        <div>
          <Link to="/dashboard" className="text-blue-400 font-semibold hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const score = session.overallScore || 0;
  const getScoreColor = (s) => {
    if (s >= 80) return 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/30';
    if (s >= 65) return 'from-blue-500 to-indigo-600 text-blue-400 border-blue-500/30';
    return 'from-amber-500 to-orange-600 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/dashboard" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <Link
          to="/start"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl text-sm shadow-md shadow-blue-600/20 flex items-center space-x-2 transition-all"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Start New Interview</span>
        </Link>
      </div>

      {/* Overview Banner Card */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interview Session Report</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{session.role}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="capitalize font-semibold text-slate-300">{session.type} Interview</span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(session.completedAt || session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </span>
              <span>&bull;</span>
              <span>{session.questions.length} Questions Evaluated</span>
            </div>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center space-x-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${getScoreColor(score)} flex items-center justify-center font-extrabold text-2xl shadow-xl text-white`}>
              {score}
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Overall Score</span>
              <span className="text-sm font-bold text-white">
                {score >= 80 ? 'Strong Performance' : score >= 65 ? 'Good Foundation' : 'Needs Practice'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Breakdown Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span>Detailed Question Breakdown</span>
        </h2>

        {session.questions.map((q, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  Q{idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-400">{q.category || 'General'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                  Tone: {q.sentiment || 'Objective'}
                </span>
                <span className={`text-sm font-extrabold px-3 py-1 rounded-lg border ${
                  (q.score || 0) >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  (q.score || 0) >= 65 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  Score: {q.score ?? 'N/A'}/100
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-semibold text-white leading-relaxed">
              {q.questionText}
            </h3>

            {/* Candidate's Answer */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Candidate Answer</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {q.answerText || 'No answer provided.'}
              </p>
            </div>

            {/* AI Feedback */}
            <div className="bg-blue-950/20 p-4 rounded-xl border border-blue-500/20">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">AI Qualitative Feedback</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {q.feedback || 'Answer evaluated.'}
              </p>
            </div>

            {/* Extracted Keywords */}
            {q.keywords && q.keywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-medium text-slate-500 flex items-center space-x-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>Key Terms Covered:</span>
                </span>
                {q.keywords.map((kw, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportPage;
