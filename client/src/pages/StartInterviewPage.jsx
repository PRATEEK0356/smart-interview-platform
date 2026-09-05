import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startNewSession } from '../features/interview/interviewSlice';
import { PlayCircle, Loader2, CheckCircle2, Target, RotateCcw, XCircle } from 'lucide-react';

const StartInterviewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.interview);

  const [role, setRole] = useState(user?.targetRole || 'Full Stack Engineer');
  const [language, setLanguage] = useState('Java');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [type, setType] = useState('technical');
  const [questionCount, setQuestionCount] = useState(3);

  const handleStart = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(
      startNewSession({
        role: role || 'General Engineer',
        type,
        questionCount,
        language: language || 'General Tech',
        difficulty: difficulty || 'Intermediate',
      })
    );
    if (startNewSession.fulfilled.match(resultAction)) {
      const session = resultAction.payload;
      navigate(`/interview/${session._id}`);
    }
  };

  const handleResetAll = () => {
    setRole(null);
    setLanguage(null);
    setDifficulty(null);
    setType('technical');
    setQuestionCount(3);
  };

  const toggleLanguage = (langId) => {
    setLanguage((prev) => (prev === langId ? null : langId));
  };

  const toggleDifficulty = (lvlId) => {
    setDifficulty((prev) => (prev === lvlId ? null : lvlId));
  };

  const toggleRole = (roleName) => {
    setRole((prev) => (prev === roleName ? null : roleName));
  };

  const languagesList = [
    { id: 'Java', name: 'Java', desc: 'JVM, Multithreading, Spring Boot, Collections' },
    { id: 'Python', name: 'Python', desc: 'Asyncio, Generators, Metaprogramming, Data Structures' },
    { id: 'JavaScript', name: 'JavaScript', desc: 'Event Loop, Promises, V8 engine, Prototypes' },
    { id: 'TypeScript', name: 'TypeScript', desc: 'Generics, Utility Types, Type System Architecture' },
    { id: 'C++', name: 'C++', desc: 'RAII, Pointers, Memory Management, Move Semantics' },
    { id: 'Go', name: 'Go (Golang)', desc: 'Goroutines, Channels, Interfaces, Garbage Collection' },
    { id: 'Rust', name: 'Rust', desc: 'Ownership, Borrow Checker, Lifetimes, Concurrency' },
    { id: 'SQL', name: 'SQL & Relational DB', desc: 'Window Functions, Indexing, Transactions, Optimization' },
  ];

  const difficultyLevels = [
    { id: 'Basic', label: 'Basic (Junior)', desc: 'Syntax, core data structures, OOP fundamentals' },
    { id: 'Intermediate', label: 'Intermediate (Mid-Level)', desc: 'Framework internals, design patterns, DB queries' },
    { id: 'Advanced', label: 'Standard & Advanced (Senior)', desc: 'JVM/Memory tuning, concurrency, internal mechanics' },
  ];

  const rolesList = [
    'Full Stack Engineer',
    'Backend Engineer',
    'Frontend Engineer',
    'Data Scientist',
    'DevOps Engineer',
    'Product Manager',
  ];

  return (
    <div className="bg-white min-h-screen py-10 font-baskerville">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header with Reset All Selections Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b-2 border-slate-100 pb-6">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-500 font-sans">
              <Target className="w-3.5 h-3.5" />
              <span>Language & Difficulty Specific Mock Test</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-baskerville">
              Configure Your Mock Interview
            </h1>
            <p className="text-sm text-slate-600 font-baskerville">
              Click any selected option again to deselect, or use the reset button to start fresh.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl border-2 border-slate-300 transition-colors text-xs self-start sm:self-auto font-sans"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>Reset All Selections</span>
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleStart} className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 font-baskerville">
          
          {/* Step 1: Programming Language Selection (Click again to Deselect) */}
          <div>
            <div className="flex items-center justify-between mb-3 font-sans">
              <label className="text-base font-extrabold text-slate-900 flex items-center space-x-2 font-baskerville">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-sans">1</span>
                <span>Select Programming Language / Tech Stack</span>
              </label>
              {language && (
                <button
                  type="button"
                  onClick={() => setLanguage(null)}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center space-x-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Deselect Language ({language})</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {languagesList.map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => toggleLanguage(lang.id)}
                    className={`p-3.5 rounded-xl border-2 text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-extrabold ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-bold'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-extrabold text-slate-900 font-baskerville">{lang.name}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium font-baskerville leading-snug">{lang.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Difficulty Level Selector (Click again to Deselect) */}
          <div>
            <div className="flex items-center justify-between mb-3 font-sans">
              <label className="text-base font-extrabold text-slate-900 flex items-center space-x-2 font-baskerville">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-sans">2</span>
                <span>Select Difficulty Level</span>
              </label>
              {difficulty && (
                <button
                  type="button"
                  onClick={() => setDifficulty(null)}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center space-x-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Deselect Difficulty ({difficulty})</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {difficultyLevels.map((lvl) => {
                const isSelected = difficulty === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => toggleDifficulty(lvl.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-extrabold ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-bold'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-extrabold text-slate-900 font-baskerville">{lvl.label}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium font-baskerville leading-snug">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Target Role Selection (Click again to Deselect) */}
          <div>
            <div className="flex items-center justify-between mb-3 font-sans">
              <label className="text-base font-extrabold text-slate-900 flex items-center space-x-2 font-baskerville">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-sans">3</span>
                <span>Target Engineering Role</span>
              </label>
              {role && (
                <button
                  type="button"
                  onClick={() => setRole(null)}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center space-x-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Deselect Role ({role})</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rolesList.map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRole(r)}
                    className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-extrabold ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-bold'
                    }`}
                  >
                    <span className="text-sm font-baskerville">{r}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Question Count */}
          <div>
            <label className="block text-base font-extrabold text-slate-900 mb-3 flex items-center space-x-2 font-baskerville">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-sans">4</span>
              <span>Session Question Length</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-3 rounded-xl border-2 font-bold text-sm transition-all font-sans ${
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans"
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
                  <span>
                    Launch {language || 'General'} {difficulty ? `(${difficulty})` : ''} Mock Interview
                  </span>
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
