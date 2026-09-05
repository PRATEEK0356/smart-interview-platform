import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSessionByIdApi } from '../api/sessionApi';
import {
  Calendar,
  Tag,
  ArrowLeft,
  PlayCircle,
  Loader2,
  FileText,
  UserCheck,
  Award,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-bold text-sm">Compiling interview session report...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center bg-white">
        <div className="p-6 bg-rose-50 border-2 border-rose-500 rounded-2xl text-rose-700 font-bold text-sm mb-6 inline-block">
          {error || 'Session report not found.'}
        </div>
        <div>
          <Link to="/dashboard" className="text-blue-600 font-extrabold hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const score = session.overallScore || 0;

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors text-sm font-bold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <Link
            to="/start"
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-4 rounded-xl text-sm border-2 border-blue-700 shadow-md flex items-center space-x-2 transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start New Interview</span>
          </Link>
        </div>

        {/* Overview Banner Card - White with Blue Border */}
        <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-500">
                <Award className="w-3.5 h-3.5" />
                <span>AI Session Performance Report</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{session.role}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-bold">
                <span className="capitalize text-blue-700">{session.type} Interview</span>
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
            <div className="flex items-center space-x-4 bg-blue-50 p-5 rounded-xl border-2 border-blue-500 self-start md:self-auto">
              <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl border-2 border-blue-700 shadow-md">
                {score}
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-slate-600 block tracking-wider">Overall Score</span>
                <span className="text-sm font-black text-slate-900">
                  {score >= 80 ? 'Strong Performance' : score >= 65 ? 'Good Foundation' : 'Needs Practice'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <div className="p-1 rounded-md border-2 border-blue-500 bg-blue-50 text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <span>Detailed Question Breakdown</span>
          </h2>

          {session.questions.map((q, idx) => (
            <div key={idx} className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs border border-blue-700">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-slate-700">{q.category || 'General'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-500 font-bold flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Camera Score: {q.visualMetrics?.presenceScore || 90}%</span>
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                    Tone: {q.sentiment || 'Objective'}
                  </span>
                  <span className="text-sm font-black px-3 py-1 rounded-lg border-2 bg-blue-50 text-blue-700 border-blue-500">
                    Score: {q.score ?? 'N/A'}/100
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base font-extrabold text-slate-900 leading-relaxed">
                {q.questionText}
              </h3>

              {/* Candidate's Answer */}
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">Candidate Response</h4>
                <p className="text-xs text-slate-800 font-mono font-bold leading-relaxed whitespace-pre-wrap">
                  {q.answerText || 'No answer provided.'}
                </p>
              </div>

              {/* AI Feedback */}
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-300">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 mb-1">AI Qualitative Feedback</h4>
                <p className="text-xs text-slate-900 font-bold leading-relaxed">
                  {q.feedback || 'Answer evaluated.'}
                </p>
              </div>

              {/* Extracted Keywords */}
              {q.keywords && q.keywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-blue-600" />
                    <span>Key Terms Covered:</span>
                  </span>
                  {q.keywords.map((kw, i) => (
                    <span key={i} className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-400">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
