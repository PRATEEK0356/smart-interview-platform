import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero_bg.jpg';
import candidatePractice from '../assets/candidate_practice.jpg';
import {
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Mic,
  ArrowRight,
  Target,
  ShieldCheck,
  Award,
  Video,
  FileCheck,
  Star,
  Users,
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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-blue-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-blue-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight font-baskerville">SmartPrep</span>
              <span className="text-[11px] text-blue-600 block font-bold font-sans">Interview Practice Studio</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-extrabold text-slate-700 hover:text-blue-600 transition-colors font-sans"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all border-2 border-blue-700 font-sans"
            >
              Start Practice Session
            </Link>
          </div>
        </div>
      </header>

      {/* Realistic Hero Section with High-Visibility Background Studio Image */}
      <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden shadow-2xl mx-4 my-2 border-2 border-blue-500">
          <img
            src={heroBg}
            alt="Technical Interview Studio Background"
            className="w-full h-full object-cover opacity-65 filter contrast-110 brightness-95"
          />
          {/* Subtle gradient overlay to keep text crisp while keeping studio image highly visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-slate-50/80 to-slate-50/65" />
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-blue-50/90 border-2 border-blue-600 text-blue-800 text-xs font-black font-sans shadow-md backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Real-time Voice, Camera & Speech Evaluation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight font-baskerville drop-shadow-sm">
              Walk into your next technical call with <span className="text-blue-600 underline decoration-blue-400 decoration-wavy decoration-2">absolute clarity.</span>
            </h1>

            <p className="text-lg text-slate-800 font-medium leading-relaxed font-baskerville max-w-xl">
              Practice real technical and behavioral interview questions in a quiet, authentic studio environment. Get instant speech transcription, question reading, webcam posture feedback, and detailed mentor critiques.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-sans">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-7 py-4 rounded-xl text-base shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all border-2 border-blue-700"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Practice Session</span>
              </Link>
              <a
                href="#how-it-works"
                className="bg-white/90 hover:bg-white text-slate-900 font-extrabold px-6 py-4 rounded-xl text-base border-2 border-slate-300 flex items-center justify-center space-x-2 transition-all shadow-md backdrop-blur-sm"
              >
                <span>See Studio Features</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-900 font-extrabold font-sans">
              <span className="flex items-center space-x-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No credit card needed</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Java, Python, C++, Go, SQL & web stacks</span>
              </span>
            </div>
          </div>

          {/* Right Live Interactive Sample Preview Card */}
          <div className="lg:col-span-6 font-baskerville">
            <div className="bg-white/95 backdrop-blur-md border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                <div className="flex items-center space-x-2 font-sans">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">Interactive Studio Preview</span>
                </div>
                <div className="flex space-x-1 font-sans">
                  {SAMPLE_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSampleIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                        activeSampleIndex === idx
                          ? 'bg-blue-600 text-white border-blue-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                      }`}
                    >
                      Sample {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Question Box */}
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-blue-200 space-y-2">
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 border border-blue-300 font-sans">
                  {sample.category} &bull; {sample.role}
                </span>
                <p className="text-lg font-black text-slate-900 leading-snug font-baskerville">
                  "{sample.question}"
                </p>
              </div>

              {/* Sample Answer Box */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 font-sans">
                  <span>Candidate Verbal Response</span>
                  <span className="text-blue-600 flex items-center space-x-1">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Microphone Transcribed</span>
                  </span>
                </div>
                <div className="p-3.5 bg-white border-2 border-slate-300 rounded-xl text-xs text-slate-800 font-mono leading-relaxed">
                  {sample.sampleAnswer}
                </div>
              </div>

              {/* Mentor Feedback Preview */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl space-y-2">
                <div className="flex items-center justify-between font-sans">
                  <span className="text-xs font-extrabold text-emerald-900 flex items-center space-x-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Mentor Qualitative Feedback</span>
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-600 text-white shadow-sm">
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

      {/* Realistic Practice Experience Preview Showcase */}
      <section className="py-16 bg-white border-t-2 border-slate-200 font-baskerville">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Image Preview Box */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border-2 border-blue-500 shadow-2xl relative group">
                <img
                  src={candidatePractice}
                  alt="Candidate Practice Session Real-time Studio"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-blue-400 shadow-lg font-sans flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Quiet Room Environment</h4>
                      <p className="text-[11px] text-slate-600 font-semibold">Video posture & speech analysis active</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-400">
                    Live Session
                  </span>
                </div>
              </div>
            </div>

            {/* Showcase Copy */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg border border-blue-300 font-sans">
                Realistic Practice Standard
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-snug font-baskerville">
                Engineered to replicate real technical interview calls.
              </h2>
              <p className="text-base text-slate-700 leading-relaxed font-baskerville">
                No artificial timers or abstract puzzle games. SmartPrep places you in a realistic interview setting with spoken questions, speech-to-text response recording, and structured mentor feedback.
              </p>

              <div className="space-y-3 font-sans pt-2">
                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Voice Speech-to-Text Input</h4>
                    <p className="text-xs text-slate-600 font-medium">Deliver answers naturally using your microphone to practice speaking out loud.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Language & Difficulty Selection</h4>
                    <p className="text-xs text-slate-600 font-medium">Configure practice sets for Java, Python, C++, Go, SQL across Basic to Senior difficulty levels.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-t-2 border-slate-200 font-baskerville">
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
            <div className="bg-white border-2 border-blue-500 p-6 rounded-2xl space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-sans border-2 border-blue-700">
                1
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-baskerville">Pick Stack & Difficulty</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-baskerville">
                Choose Java, Python, C++, Go, or SQL and set your target difficulty level.
              </p>
            </div>

            <div className="bg-white border-2 border-blue-500 p-6 rounded-2xl space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-sans border-2 border-blue-700">
                2
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-baskerville">Spoken Questions</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-baskerville">
                Listen to natural spoken questions tailored to your domain and target engineering role.
              </p>
            </div>

            <div className="bg-white border-2 border-blue-500 p-6 rounded-2xl space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-sans border-2 border-blue-700">
                3
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-baskerville">Microphone & Video Monitor</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-baskerville">
                Answer out loud via your microphone while video posture evaluation keeps you focused.
              </p>
            </div>

            <div className="bg-white border-2 border-blue-500 p-6 rounded-2xl space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-sans border-2 border-blue-700">
                4
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-baskerville">Mentor Action Plan</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-baskerville">
                Receive specific feedback notes, strong command highlights, and an actionable 3-step study plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Outcomes */}
      <section className="py-16 bg-white border-t-2 border-slate-200 font-baskerville">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 font-baskerville">Built for Serious Engineering Candidates</h2>
            <p className="text-base text-slate-600 font-baskerville">
              Designed to help developers structure high-impact technical answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-blue-200 space-y-3 shadow-sm">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed font-baskerville">
                "The speech-to-text mic feature let me practice speaking out loud without freezing. The keyword coverage feedback showed me exactly which architectural terms I forgot."
              </p>
              <div className="text-xs font-bold text-slate-900 pt-2 border-t border-slate-200 font-sans">
                — Senior Frontend Engineer
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-blue-200 space-y-3 shadow-sm">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed font-baskerville">
                "Having spoken questions made it feel like a real technical screening call. My average score improved from 68 to 88 in 4 practice sessions."
              </p>
              <div className="text-xs font-bold text-slate-900 pt-2 border-t border-slate-200 font-sans">
                — Java / Backend Candidate
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-blue-200 space-y-3 shadow-sm">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed font-baskerville">
                "I used the STAR behavioral practice to structure my story around team trade-offs. The video monitor helped me stay focused on the camera."
              </p>
              <div className="text-xs font-bold text-slate-900 pt-2 border-t border-slate-200 font-sans">
                — Lead Product Manager
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-blue-600 text-white text-center font-baskerville">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight font-baskerville">Ready for your next technical call?</h2>
          <p className="text-base text-blue-100 font-baskerville max-w-xl mx-auto">
            Launch a mock interview session now. No credit card required.
          </p>
          <div>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-blue-600 font-extrabold px-8 py-4 rounded-xl text-base shadow-xl transition-all font-sans"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Start Practice Session</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-xs border-t border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white font-baskerville text-sm">SmartPrep Studio</span>
            <span>&bull;</span>
            <span>Technical & Behavioral Practice</span>
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
