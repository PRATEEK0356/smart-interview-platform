import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startNewSession } from '../features/interview/interviewSlice';
import { Code2, PlayCircle, Loader2, CheckCircle2, Target, Layers } from 'lucide-react';

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
      startNewSession({ role, type, questionCount, language, difficulty })
    );
    if (startNewSession.fulfilled.match(resultAction)) {
      const session = resultAction.payload;
      navigate(`/interview/${session._id}`);
    }
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
        {/* Page Header */}
        <div className="text-center mb-10 space-y-3">
          <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-500 font-sans">
            <Target className="w-3.5 h-3.5" />
            <span>Language & Difficulty Specific Mock Test</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-baskerville">
            Configure Your Mock Interview
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-baskerville">
            Select your preferred programming language (Java, Python, C++, Go, etc.) and difficulty level to test your technical mastery.
          </p>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleStart} className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 font-baskerville">
          
          {/* Step 1: Programming Language Selection */}
          <div>
            <label className="block text-base font-extrabold text-slate-900 mb-3 flex items-center space-x-2 font-baskerville">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-sans">1</span>
              <span>Select Programming Language / Tech Stack</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {languagesList.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id)}
                  className={`p-3.5 rounded-xl border-2 text-left flex flex-col justify-between transition-all ${
                    language === lang.id
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-extrabold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-bold'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-extrabold text-slate-900 font-baskerville">{lang.name}</span>
                    {language === lang.id && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium font-baskerville leading-snug">{lang.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Difficulty Level Selector */}
          <div>
            <label className="block text-base font-extrabold text-slate-900 mb-3 flex items-center space-x-2 font-baskerville">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-sans">2</span>
              <span>Select Difficulty Level</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {difficultyLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setDifficulty(lvl.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    difficulty === lvl.id
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-extrabold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-bold'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-extrabold text-slate-900 font-baskerville">{lvl.label}</span>
                    {difficulty === lvl.id && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium font-baskerville leading-snug">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Target Role Selection */}
          <div>
            <label className="block text-base font-extrabold text-slate-900 mb-3 flex items-center space-x-2 font-baskerville">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-sans">3</span>
              <span>Target Engineering Role</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rolesList.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                    role === r
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-extrabold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 font-bold'
                  }`}
                >
                  <span className="text-sm font-baskerville">{r}</span>
                  {role === r && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                </button>
              ))}
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
                  <span>Generating {language} ({difficulty}) AI Questions...</span>
                </>
              ) : (
                <>
                  <div className="p-1 rounded-md border border-white/40 bg-white/20 text-white">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <span>Launch {language} ({difficulty}) Mock Interview</span>
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
