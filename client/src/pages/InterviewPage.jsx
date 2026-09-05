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
  Volume2,
  Mic,
  Square,
  LogOut,
  Code2,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-slate-50 font-baskerville">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-bold text-sm">Entering interview session quiet room...</p>
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
    <div className="bg-slate-50 min-h-screen py-8 font-baskerville">
      {/* Quiet Room Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between font-sans">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider bg-white px-3 py-1 rounded-lg border border-slate-300">
            {activeSession.role} &bull; {activeSession.type}
          </span>
          {activeSession.language && (
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-300 flex items-center space-x-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>{activeSession.language} ({activeSession.difficulty || 'Intermediate'})</span>
            </span>
          )}
          <span className="text-xs font-bold text-slate-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center space-x-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit room</span>
        </button>
      </div>

      {/* Main Quiet Room Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 font-baskerville">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-center space-x-3 text-rose-700 text-sm font-bold font-sans">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Focal Question & Answer Textarea (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Question Card */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 font-sans">
                  {currentQuestion?.category || `${activeSession.language || 'Technical'} Domain`}
                </span>

                {hasTtsSupport && (
                  <button
                    onClick={handleReplayQuestion}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold border transition-all font-sans ${
                      isSpeaking
                        ? 'bg-blue-600 text-white border-blue-700 animate-pulse'
                        : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Speaking Question...' : 'Listen to AI Voice'}</span>
                  </button>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug font-baskerville">
                "{currentQuestion?.questionText}"
              </h2>

              {currentQuestion?.expectedKeywords && currentQuestion.expectedKeywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 font-sans">
                  <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-blue-600" />
                    <span>Expected Key Concepts:</span>
                  </span>
                  {currentQuestion.expectedKeywords.map((kw, i) => (
                    <span key={i} className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Focal Answer Response Form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-sm space-y-4 font-baskerville">
                <div className="flex flex-wrap items-center justify-between gap-2 font-sans">
                  <div className="flex items-center space-x-3">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Candidate Response Input
                    </label>

                    {!isCurrentAnswered && hasSttSupport && (
                      <button
                        type="button"
                        onClick={handleToggleMic}
                        className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-extrabold border transition-all ${
                          isListening
                            ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                            : 'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100'
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

                  <span className={`text-xs font-mono font-bold ${wordCount >= 30 ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {wordCount} words
                  </span>
                </div>

                {isListening && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center justify-between text-xs text-rose-700 font-extrabold font-sans">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                      <span>Microphone Active. Speak your response clearly...</span>
                    </div>
                  </div>
                )}

                <textarea
                  rows={8}
                  disabled={isCurrentAnswered || isSubmitting}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder={`Type your response here or click 'Deliver Answer via Mic' to speak into your microphone...`}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl p-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all leading-relaxed resize-y disabled:bg-slate-50 font-baskerville"
                />

                {!isCurrentAnswered && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-slate-500 font-medium font-baskerville">
                      Take your time. Maintain eye contact with the video monitor on your right.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting || !answerText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-md flex items-center justify-center space-x-2 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Evaluating response...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit answer for review</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Evaluation Result Feedback */}
            {isCurrentAnswered && (
              <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-md space-y-4 font-baskerville">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-sm border border-blue-700">
                      {currentQuestion.score}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base font-baskerville">Question Evaluation</h3>
                      <p className="text-xs text-slate-500 font-bold font-sans">
                        Tone: {currentQuestion.sentiment || 'Objective'} &bull; Visual Engagement: {currentQuestion.visualMetrics?.presenceScore || 90}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-800 font-sans">Mentor Notes</h4>
                  <p className="text-base text-slate-800 font-medium leading-relaxed font-baskerville">
                    {currentQuestion.feedback}
                  </p>
                </div>

                <div className="flex justify-end pt-2 font-sans">
                  <button
                    onClick={handleNextOrFinish}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-md flex items-center space-x-2 text-sm transition-all"
                  >
                    <span>{isLastQuestion ? 'Complete interview & view report' : 'Proceed to next question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Video Monitor Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <WebcamMonitor onMetricsUpdate={handleMetricsUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
