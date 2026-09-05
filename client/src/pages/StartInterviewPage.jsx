import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startNewSession } from '../features/interview/interviewSlice';
import { Sparkles, Code, Users, Sliders, PlayCircle, Loader2, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Interview Simulation</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Configure Your Mock Interview</h1>
        <p className="mt-2 text-base text-slate-400 max-w-2xl mx-auto">
          Select your target role and interview focus. Our AI microservice will generate tailored real-world questions and evaluate your responses in real-time.
        </p>
      </div>

      {/* Main Configuration Card */}
      <form onSubmit={handleStart} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-8">
        {/* Step 1: Target Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
            <span>Select Target Role</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rolesList.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                  role === r
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="font-medium text-sm">{r}</span>
                {role === r && <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Interview Type (Technical vs Behavioral) */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
            <span>Interview Category</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType('technical')}
              className={`p-5 rounded-xl border text-left transition-all ${
                type === 'technical'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${type === 'technical' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Code className="w-5 h-5" />
                </div>
                <span className="font-bold text-base">Technical Deep-Dive</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                System architecture, database optimization, framework concepts, algorithmic reasoning, and code quality.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setType('behavioral')}
              className={`p-5 rounded-xl border text-left transition-all ${
                type === 'behavioral'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${type === 'behavioral' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-base">Behavioral & Leadership</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conflict resolution, project ownership, incident management, teamwork, and STAR technique execution.
              </p>
            </button>
          </div>
        </div>

        {/* Step 3: Question Count */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
            <span>Session Length ({questionCount} Questions)</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[3, 5, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionCount(num)}
                className={`py-3 rounded-xl border font-medium text-sm transition-all ${
                  questionCount === num
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {num} Questions ({num * 3} mins approx)
              </button>
            ))}
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-blue-600/25 flex items-center justify-center space-x-2 text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Generating AI Questions...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-6 h-6" />
                <span>Launch Mock Interview Session</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StartInterviewPage;
