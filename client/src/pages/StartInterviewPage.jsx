import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startNewSession } from '../features/interview/interviewSlice';
import { Sparkles, Code, Users, PlayCircle, Loader2, CheckCircle2, Target } from 'lucide-react';

const StartInterviewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.interview);

  const [role, setRole] = useState(user?.targetRole || 'Full Stack Engineer');
  const [type, setType] = useState('technical');
  const [questionCount, setQuestionCount] = useState(3);

  const handleStart = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(startNewSession({ role, type, questionCount }));
    if (startNewSession.fulfilled.match(resultAction)) {
      const session = resultAction.payload;
      navigate(`/interview/${session._id}`);
    }
  };

  const rolesList = [
    'Full Stack Engineer',
    'Backend Engineer',
    'Frontend Engineer',
    'Data Scientist',
    'DevOps Engineer',
    'Product Manager',
  ];

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10 space-y-3">
          <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-500">
            <Target className="w-3.5 h-3.5" />
            <span>AI Mock Interview Configuration</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Configure Your Interview Session</h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select your target role and interview category. Our AI microservice will generate tailored real-world questions and score your answers in real time.
          </p>
        </div>

        {/* Configuration Form with Crisp Blue Borders */}
        <form onSubmit={handleStart} className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          {/* Step 1: Target Role Selection */}
          <div>
            <label className="block text-sm font-extrabold text-slate-900 mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold border border-blue-700">1</span>
              <span>Select Target Role</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rolesList.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                    role === r
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm font-extrabold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-bold'
                  }`}
                >
                  <span className="text-sm">{r}</span>
                  {role === r && <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Category (Technical vs Behavioral) */}
          <div>
            <label className="block text-sm font-extrabold text-slate-900 mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold border border-blue-700">2</span>
              <span>Interview Category</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('technical')}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  type === 'technical'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-600">
                    <Code className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-base text-slate-900">Technical Deep-Dive</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  System architecture, database optimization, algorithm trade-offs, and code quality.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setType('behavioral')}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  type === 'behavioral'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-base text-slate-900">Behavioral & Leadership</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Conflict resolution, incident management, project ownership, and STAR technique.
                </p>
              </button>
            </div>
          </div>

          {/* Step 3: Question Count */}
          <div>
            <label className="block text-sm font-extrabold text-slate-900 mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold border border-blue-700">3</span>
              <span>Session Length ({questionCount} Questions)</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    questionCount === num
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
                  }`}
                >
                  {num} Questions ({num * 3} mins)
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t-2 border-slate-100">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Generating AI Questions...</span>
                </>
              ) : (
                <>
                  <div className="p-1 rounded-md border border-white/40 bg-white/20 text-white">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <span>Launch Mock Interview Session</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartInterviewPage;
