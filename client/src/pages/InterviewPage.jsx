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
import useVoiceSynthesis from '../hooks/useVoiceSynthesis';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import {
  Send,
  ArrowRight,
  Tag,
  Loader2,
  AlertCircle,
  Video,
  Volume2,
  Mic,
  Square,
  HelpCircle,
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

  // Voice Hooks
  const { speak, stop: stopVoice, isSpeaking, hasSupport: hasTtsSupport } = useVoiceSynthesis();
  const {
    startListening,
    stopListening,
    isListening,
    transcript,
    hasSupport: hasSttSupport,
  } = useSpeechRecognition();

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

      if (q.questionText && q.score === null && hasTtsSupport) {
        speak(q.questionText);
      }
    }
    return () => {
      stopVoice();
    };
  }, [activeSession, currentQuestionIndex, speak, stopVoice, hasTtsSupport]);

  useEffect(() => {
    if (transcript) {
      setAnswerText(transcript);
    }
  }, [transcript]);

  if (isLoading || !activeSession) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-bold text-sm">Preparing your AI interview session...</p>
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

    if (isListening) stopListening();
    stopVoice();

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
    stopVoice();
    if (isListening) stopListening();

    if (isLastQuestion) {
      await dispatch(finishSession(sessionId));
      navigate(`/report/${sessionId}`);
    } else {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleReplayQuestion = () => {
    if (isSpeaking) {
      stopVoice();
    } else if (currentQuestion?.questionText) {
      speak(currentQuestion.questionText);
    }
  };

  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Session Progress Header */}
        <div>
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
            <span>{activeSession.role} &bull; {activeSession.type}</span>
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border-2 border-blue-500">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-center space-x-3 text-rose-700 text-sm font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Question & Mic Response Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-500">
                  {currentQuestion?.category || 'General Domain'}
                </span>

                {/* AI TTS Audio Control */}
                {hasTtsSupport && (
                  <button
                    onClick={handleReplayQuestion}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-xl text-xs font-extrabold border-2 transition-all ${
                      isSpeaking
                        ? 'bg-blue-600 text-white border-blue-700 animate-pulse'
                        : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className="p-1 rounded-md border border-current bg-blue-50 text-blue-600">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{isSpeaking ? 'Speaking Question...' : 'Listen to AI Voice'}</span>
                  </button>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {currentQuestion?.questionText}
              </h2>

              {/* Target Concepts */}
              {currentQuestion?.expectedKeywords && currentQuestion.expectedKeywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-slate-100">
                  <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-blue-600" />
                    <span>Target Concepts:</span>
                  </span>
                  {currentQuestion.expectedKeywords.map((kw, i) => (
                    <span key={i} className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-400">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Answer Input Form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Your Response
                    </label>

                    {/* Microphone Voice STT Input Button */}
                    {!isCurrentAnswered && hasSttSupport && (
                      <button
                        type="button"
                        onClick={handleToggleMic}
                        className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold border-2 transition-all ${
                          isListening
                            ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                            : 'bg-blue-50 text-blue-600 border-blue-500 hover:bg-blue-100'
                        }`}
                      >
                        {isListening ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop Recording</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5" />
                            <span>Deliver Answer via Mic</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <span className={`text-xs font-mono font-bold ${wordCount >= 30 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {wordCount} words
                  </span>
                </div>

                {/* Speech Recording Status Banner */}
                {isListening && (
                  <div className="p-3 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-center justify-between text-xs text-rose-700 font-extrabold">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                      <span>Microphone Active. Speak clearly into your mic...</span>
                    </div>
                    <span className="font-mono text-[10px] uppercase">STT Speech Engine</span>
                  </div>
                )}

                <textarea
                  rows={6}
                  disabled={isCurrentAnswered || isSubmitting}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your response or use the mic button to deliver your answer verbally..."
                  className="w-full bg-white border-2 border-slate-300 focus:border-blue-600 rounded-xl p-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all resize-y disabled:bg-slate-50"
                />

                {!isCurrentAnswered && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-slate-500 font-medium">
                      You can deliver your answer via mic or type in the text box before submitting.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting || !answerText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-5 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-md space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border-2 border-blue-500">
                      {currentQuestion.score}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Question Score & Facial Verification</h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-600 font-bold mt-0.5">
                        <span>Tone: {currentQuestion.sentiment || 'Objective'}</span>
                        <span>&bull;</span>
                        <span className="text-emerald-700">Visual Engagement: {currentQuestion.visualMetrics?.presenceScore || 90}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">Feedback & Recommendations</h4>
                  <p className="text-sm text-slate-800 font-medium leading-relaxed bg-blue-50/50 p-4 rounded-xl border-2 border-blue-200">
                    {currentQuestion.feedback}
                  </p>
                </div>

                {/* Advancement Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextOrFinish}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl border-2 border-blue-700 shadow-md flex items-center space-x-2 text-sm transition-all"
                  >
                    <span>{isLastQuestion ? 'Complete Interview & View Report' : 'Proceed to Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Webcam Monitor (1 col) */}
          <div className="space-y-6">
            <WebcamMonitor onMetricsUpdate={handleMetricsUpdate} />

            {/* Quick Guidance Box */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
              <h4 className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                <div className="p-1 rounded-md border border-blue-500 bg-blue-50 text-blue-600">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <span>Proctoring & Voice Tips</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 font-medium text-slate-600 leading-relaxed">
                <li>Click 🔊 <strong>Listen to AI Voice</strong> to hear the question.</li>
                <li>Click 🎙️ <strong>Deliver Answer via Mic</strong> to speak your response.</li>
                <li>Keep your webcam on for visual presence scoring.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
