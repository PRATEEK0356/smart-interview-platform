import axios from 'axios';
import { config } from '../config/env.js';

const aiClient = axios.create({
  baseURL: config.aiServiceUrl,
  timeout: 15000,
});

export const fetchGeneratedQuestions = async (role, type, count = 3, language = 'Java', difficulty = 'Intermediate') => {
  try {
    const response = await aiClient.post('/generate-questions', {
      role,
      type,
      count,
      language,
      difficulty,
    });
    if (response.data && response.data.questions) {
      return response.data.questions;
    }
    throw new Error('Invalid format returned from AI Service');
  } catch (error) {
    console.error('[AI Service Client] Question generation error:', error.message);
    return [
      {
        questionText: `Explain core ${language} ${difficulty}-level concepts and architecture trade-offs in your target projects.`,
        category: `${language} Fundamentals`,
        expectedKeywords: ['architecture', 'memory', 'concurrency', 'testing']
      },
      {
        questionText: `How do you diagnose performance bottlenecks and memory usage in ${language}?`,
        category: `${language} Optimization`,
        expectedKeywords: ['profiling', 'memory leak', 'garbage collection', 'monitoring']
      },
      {
        questionText: `Describe a complex ${language} project you built and how you ensured code quality.`,
        category: 'Software Design',
        expectedKeywords: ['design patterns', 'refactoring', 'unit tests', 'ci/cd']
      }
    ].slice(0, count);
  }
};

export const fetchAnswerEvaluation = async (question, answer) => {
  try {
    const response = await aiClient.post('/evaluate-answer', {
      question,
      answer,
    });
    return response.data;
  } catch (error) {
    console.error('[AI Service Client] Answer evaluation error:', error.message);
    const wordCount = answer.trim().split(/\s+/).length;
    const score = Math.min(100, Math.max(30, wordCount * 2 + 30));
    return {
      score,
      feedback: 'Answer processed. Consider elaborating on specific technical trade-offs and implementation choices.',
      keywords: ['architecture', 'structure'],
      sentiment: 'Objective & Technical',
      structuralScore: 70,
      qualitativeAnalysis: 'Response contains foundational structure.'
    };
  }
};

export const fetchSessionFeedbackReport = async (sessionData) => {
  try {
    const response = await aiClient.post('/generate-session-feedback', {
      role: sessionData.role,
      language: sessionData.language || 'Java',
      difficulty: sessionData.difficulty || 'Intermediate',
      type: sessionData.type || 'technical',
      overallScore: sessionData.overallScore || 0,
      questions: sessionData.questions.map(q => ({
        questionText: q.questionText,
        answerText: q.answerText,
        score: q.score || 0,
        feedback: q.feedback || ''
      }))
    });
    return response.data;
  } catch (error) {
    console.error('[AI Service Client] Session feedback generation error:', error.message);
    return {
      executiveSummary: `Solid foundation demonstrated across core technical requirements for ${sessionData.role}.`,
      strengths: [
        `Strong grasp of fundamental ${sessionData.language || 'language'} syntax and structure.`,
        'Direct and articulate answer delivery.'
      ],
      areasToFocus: [
        `Elaborate deeper on memory management and internal concurrency mechanics in ${sessionData.language || 'language'}.`,
        'Quantify performance metrics and trade-offs in real-world deployments.'
      ],
      actionPlan: [
        `Review advanced ${sessionData.language || 'language'} architecture patterns.`,
        'Practice articulating system trade-offs aloud using the Speech-to-Text mic feature.',
        'Schedule a follow-up mock session to build instant technical recall.'
      ]
    };
  }
};
