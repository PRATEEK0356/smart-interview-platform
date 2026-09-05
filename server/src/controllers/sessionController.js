import { InterviewSession } from '../models/InterviewSession.js';
import { fetchGeneratedQuestions, fetchAnswerEvaluation } from '../services/aiServiceClient.js';

// @desc    Start a new interview session (generates questions via AI service)
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res, next) => {
  try {
    const { role, type, questionCount } = req.body;
    const targetRole = role || req.user.targetRole || 'Full Stack Engineer';
    const interviewType = type || 'technical';
    const count = parseInt(questionCount, 10) || 3;

    // Fetch AI-generated questions
    const generatedQuestions = await fetchGeneratedQuestions(targetRole, interviewType, count);

    const questionsData = generatedQuestions.map(q => ({
      questionText: q.questionText,
      category: q.category || 'General',
      expectedKeywords: q.expectedKeywords || [],
      answerText: '',
      score: null,
      feedback: '',
      keywords: [],
      sentiment: '',
      visualMetrics: {
        faceDetected: true,
        presenceScore: 90,
        engagementStatus: 'Candidate Verified'
      }
    }));

    const session = await InterviewSession.create({
      userId: req.user._id,
      role: targetRole,
      type: interviewType,
      status: 'in_progress',
      questions: questionsData,
      overallScore: 0,
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get session details by ID
// @route   GET /api/sessions/:id
// @access  Private
export const getSessionById = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      res.status(404);
      throw new Error('Interview session not found.');
    }

    if (session.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this session.');
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answer for a specific question & evaluate via AI service
// @route   PATCH /api/sessions/:id/answer
// @access  Private
export const submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, answerText, visualMetrics } = req.body;
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      res.status(404);
      throw new Error('Interview session not found.');
    }

    if (session.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this session.');
    }

    if (questionIndex === undefined || questionIndex < 0 || questionIndex >= session.questions.length) {
      res.status(400);
      throw new Error('Invalid question index.');
    }

    if (!answerText || !answerText.trim()) {
      res.status(400);
      throw new Error('Answer text cannot be empty.');
    }

    const question = session.questions[questionIndex];

    // Evaluate answer via AI Microservice
    const evalResult = await fetchAnswerEvaluation(question.questionText, answerText);

    question.answerText = answerText.trim();
    question.score = evalResult.score;
    question.feedback = evalResult.feedback;
    question.keywords = evalResult.keywords;
    question.sentiment = evalResult.sentiment;
    if (visualMetrics) {
      question.visualMetrics = {
        faceDetected: visualMetrics.faceDetected ?? true,
        presenceScore: visualMetrics.score || visualMetrics.presenceScore || 90,
        engagementStatus: visualMetrics.status || visualMetrics.engagementStatus || 'Candidate Verified'
      };
    }
    question.answeredAt = new Date();

    await session.save();

    res.status(200).json({
      success: true,
      questionIndex,
      evaluatedQuestion: question,
      evaluation: evalResult,
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete interview session & compute overall score
// @route   PATCH /api/sessions/:id/complete
// @access  Private
export const completeSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      res.status(404);
      throw new Error('Interview session not found.');
    }

    if (session.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this session.');
    }

    const answeredQuestions = session.questions.filter(q => q.score !== null && q.score !== undefined);
    let overallScore = 0;
    if (answeredQuestions.length > 0) {
      const sum = answeredQuestions.reduce((acc, q) => acc + q.score, 0);
      overallScore = Math.round(sum / answeredQuestions.length);
    }

    session.status = 'completed';
    session.overallScore = overallScore;
    session.completedAt = new Date();

    await session.save();

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all past sessions for current user
// @route   GET /api/sessions
// @access  Private
export const getUserSessions = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};
