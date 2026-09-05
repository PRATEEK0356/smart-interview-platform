import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Mic,
  ArrowRight,
  Target,
} from 'lucide-react';

const SAMPLE_QUESTIONS = [
  {
    role: 'Full Stack Engineer',
    question: 'How do you optimize rendering performance in a large-scale React SPA with frequent state updates?',
    category: 'Frontend Architecture',
    sampleAnswer: 'I use useMemo and useCallback to prevent unnecessary re-renders of expensive child components, implement list virtualization for large datasets, and collocate state near where it is consumed.',
    score: 88,
    feedback: 'Strong answer covering key React optimization primitives. Mentioning state collocation demonstrates mature architectural judgment.',
    keywords: ['useMemo', 'useCallback', 'virtualization', 'state collocation'],
  },
  {
    role: 'Backend Engineer',
    question: 'How do you prevent race conditions when two concurrent DB transactions attempt to decrement an account balance?',
    category: 'Database & Concurrency',
    sampleAnswer: 'I use database transactions with optimistic locking via version numbers, or pessimistic row-level locking (SELECT FOR UPDATE) depending on contention levels.',
    score: 92,
    feedback: 'Excellent distinction between optimistic and pessimistic locking models based on traffic contention.',
    keywords: ['optimistic locking', 'SELECT FOR UPDATE', 'isolation level', 'atomic transaction'],
  },
  {
    role: 'Product Manager',
    question: 'Tell me about a time you had to pivot product strategy mid-sprint due to unexpected technical constraints.',
    category: 'Behavioral & Leadership',
    sampleAnswer: 'When our backend team identified a 2-second API latency bottleneck, I re-scoped our MVP to focus on asynchronous processing and communicated trade-offs to key business stakeholders.',
    score: 85,
    feedback: 'Good STAR technique execution. Work on quantifying the business impact of the asynchronous trade-off in future answers.',
    keywords: ['STAR method', 're-scoping', 'stakeholder alignment', 'trade-off analysis'],
  },
];

const LandingPage = () => {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const sample = SAMPLE_QUESTIONS[activeSampleIndex];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-baskerville">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900 tracking-tight font-baskerville">SmartPrep</span>
              <span className="text-[11px] text-blue-600 block font-bold font-sans">AI Interview Platform</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors font-sans"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md transition-all border border-blue-700 font-sans"
            >
              Start mock interview
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold font-sans">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Realistic Technical & Behavioral Practice</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-baskerville">
              Walk into your next interview knowing <span className="text-blue-600">exactly what to say.</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed font-baskerville">
              Practice real technical and behavioral interview questions in a quiet, low-pressure environment. Get real-time Speech-to-Text transcription, AI voice question reading, live camera posture analysis, and actionable mentor feedback.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-sans">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-4 rounded-xl text-base shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all border border-blue-700"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start mock interview</span>
              </Link>
              <a
                href="#how-it-works"
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold px-6 py-4 rounded-xl text-base border-2 border-slate-200 flex items-center justify-center space-x-2 transition-all"
              >
                <span>See how it works</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-4 flex items-center space-x-6 text-xs text-slate-500 font-bold font-sans">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No credit card required</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant Speech & Vision proctoring</span>
              </span>
            </div>
          </div>

          {/* Right Live Interactive Sample Preview Card */}
          <div className="lg:col-span-6 font-baskerville">
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2 font-sans">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Live AI Interview Simulator</span>
                </div>
                <div className="flex space-x-1 font-sans">
                  {SAMPLE_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSampleIndex(idx)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                        activeSampleIndex === idx
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Sample {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Question Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-sans">
                  {sample.category} &bull; {sample.role}
                </span>
                <p className="text-base font-bold text-slate-900 leading-snug font-baskerville">
                  "{sample.question}"
                </p>
              </div>

              {/* Sample Answer Box */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 font-sans">
                  <span>Candidate Verbal Response</span>
                  <span className="text-blue-600 flex items-center space-x-1">
                    <Mic className="w-3 h-3" />
                    <span>Microphone Transcribed</span>
                  </span>
                </div>
                <div className="p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-mono leading-relaxed">
                  {sample.sampleAnswer}
                </div>
              </div>

              {/* AI Feedback Preview */}
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between font-sans">
                  <span className="text-xs font-extrabold text-emerald-800 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mentor Qualitative Feedback</span>
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-600 text-white">
                    Score: {sample.score}/100
                  </span>
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed font-baskerville">
                  {sample.feedback}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white border-t border-slate-200 font-baskerville">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 font-sans">
              Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-baskerville">How SmartPrep Prepares You</h2>
            <p className="text-base text-slate-600 font-medium font-baskerville">
              Four structured steps to turn interview anxiety into confident execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-sans">
                1
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-baskerville">Pick Target Role</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-baskerville">
                Choose from Full Stack, Backend, Frontend, Data Science, DevOps, or Product Management.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-sans">
                2
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-baskerville">AI Question Reader</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-baskerville">
                Our AI microservice generates high-value questions and reads them aloud using natural TTS synthesis.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-sans">
                3
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-baskerville">Mic & Camera Proctor</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-baskerville">
                Deliver answers verbally via microphone while real-time AI canvas proctoring tracks posture and presence.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-sans">
                4
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-baskerville">Mentor Feedback</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-baskerville">
                Receive specific qualitative feedback, keyword coverage analysis, and score-over-time trend tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Social Proof & Outcomes */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 font-baskerville">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 font-baskerville">Built for Serious Candidates</h2>
            <p className="text-base text-slate-600 font-baskerville">
              Designed to help developers and product leaders structure high-impact answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
              <p className="text-sm text-slate-700 italic leading-relaxed font-baskerville">
                "The Speech-to-Text mic feature let me practice speaking out loud without freezing. The keyword coverage feedback showed me exactly which architectural terms I forgot."
              </p>
              <div className="text-xs font-bold text-slate-900 pt-2 border-t border-slate-100 font-sans">
                — Senior Frontend Engineer
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
              <p className="text-sm text-slate-700 italic leading-relaxed font-baskerville">
                "Having the AI voice read the questions aloud made it feel like a real technical screening call. My average score improved from 68 to 88 in 4 practice sessions."
              </p>
              <div className="text-xs font-bold text-slate-900 pt-2 border-t border-slate-100 font-sans">
                — Backend Engineer Candidate
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
              <p className="text-sm text-slate-700 italic leading-relaxed font-baskerville">
                "I used the behavioral STAR practice to structure my story around team conflicts. The visual proctoring helped me stay focused on the camera."
              </p>
              <div className="text-xs font-bold text-slate-900 pt-2 border-t border-slate-100 font-sans">
                — Lead Product Manager
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-blue-600 text-white text-center font-baskerville">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight font-baskerville">Ready for your next technical interview?</h2>
          <p className="text-base text-blue-100 font-baskerville max-w-xl mx-auto">
            Launch a mock interview session now. No credit card required.
          </p>
          <div>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-blue-600 font-bold px-8 py-4 rounded-xl text-base shadow-lg transition-all font-sans"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Start mock interview</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-xs border-t border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white font-baskerville text-sm">SmartPrep AI</span>
            <span>&bull;</span>
            <span>Technical & Behavioral Interview Practice</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} SmartPrep. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
