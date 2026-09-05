import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSession,
  submitQuestionAnswer,
  setCurrentQuestionIndex,
  finishSession,
} from '../features/interview/interviewSlice';
import WebcamMonitor from '../components/WebcamMonitor';
import {
  Sparkles,
  Send,
  ArrowRight,
  CheckCircle,
  Tag,
  Loader2,
  AlertCircle,
  Video,
} from 'lucide-react';

const InterviewPage = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    activeSession,
    currentQuestionIndex,
    isLoading,
    isSubmitting,
    error,
  } = useSelector((state) => state.interview);

  const [answerText, setAnswerText] = useState('');
  const [liveVisualMetrics, setLiveVisualMetrics] = useState({
    faceDetected: true,
    status: 'Candidate Verified',
    score: 90,
  });

  const handleMetricsUpdate = useCallback((metrics) => {
    setLiveVisualMetrics(metrics);
  }, []);

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSession(sessionId));
    }
  }, [sessionId, dispatch]);

  useEffect(() => {
    if (activeSession && activeSession.questions[currentQuestionIndex]) {
      const q = activeSession.questions[currentQuestionIndex];
      setAnswerText(q.answerText || '');
    }
  }, [activeSession, currentQuestionIndex]);

  if (isLoading || !activeSession) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium text-sm">Preparing your AI interview session...</p>
      </div>
    );
  }

  const questions = activeSession.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCurrentAnswered = currentQuestion?.score !== null && currentQuestion?.score !== undefined;

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    await dispatch(
      submitQuestionAnswer({
        sessionId,
        questionIndex: currentQuestionIndex,
        answerText,
        visualMetrics: liveVisualMetrics,
      })
    );
  };

  const handleNextOrFinish = async () => {
    if (isLastQuestion) {
      await dispatch(finishSession(sessionId));
      navigate(`/report/${sessionId}`);
    } else {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
    }
  };

  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Session Progress Header */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          <span>{activeSession.role} &bull; {activeSession.type}</span>
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid Layout: Left Question & Answer, Right AI Webcam Video Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Question Card & Answer Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Card */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {currentQuestion?.category || 'General Domain'}
              </span>

              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                <Video className="w-3.5 h-3.5" />
                <span>Webcam AI Proctor Active</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-4">
              {currentQuestion?.questionText}
            </h2>

            {/* Target Concepts */}
            {currentQuestion?.expectedKeywords && currentQuestion.expectedKeywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/60">
                <span className="text-xs font-medium text-slate-400 flex items-center space-x-1">
                  <Tag className="w-3 h-3 text-blue-400" />
                  <span>Target Concepts:</span>
                </span>
                {currentQuestion.expectedKeywords.map((kw, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Answer Input Form */}
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Your Response (Text / Verbal)
                </label>
                <span className={`text-xs font-mono ${wordCount >= 30 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {wordCount} words
                </span>
              </div>

              <textarea
                rows={6}
                disabled={isCurrentAnswered || isSubmitting}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Explain your approach, architectural trade-offs, and implementation details while maintaining eye contact with the camera..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all resize-y disabled:opacity-80"
              />

              {!isCurrentAnswered && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    Maintain posture and camera eye contact for visual engagement scoring.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting || !answerText.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating AI & Vision...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit for Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Immediate Evaluation Result Box */}
          {isCurrentAnswered && (
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-5 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xl border border-blue-500/30">
                    {currentQuestion.score}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Question Score & Facial Verification</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                      <span>Tone: {currentQuestion.sentiment || 'Objective'}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-semibold">Visual Engagement: {currentQuestion.visualMetrics?.presenceScore || 90}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Feedback & Recommendations</h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {currentQuestion.feedback}
                </p>
              </div>

              {/* Advancement Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextOrFinish}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 text-sm transition-all"
                >
                  <span>{isLastQuestion ? 'Complete Interview & View Report' : 'Proceed to Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Webcam Video Monitor Component (1 col) */}
        <div className="space-y-6">
          <WebcamMonitor onMetricsUpdate={handleMetricsUpdate} />

          {/* Quick Guidance Box */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Camera & Proctor Tips</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400 leading-relaxed">
              <li>Position your webcam at eye level in a well-lit room.</li>
              <li>Keep your face centered inside the video monitor box.</li>
              <li>Maintain steady eye contact while structuring your answer.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
