import axios from 'axios';
import { config } from '../config/env.js';

const aiClient = axios.create({
  baseURL: config.aiServiceUrl,
  timeout: 15000,
});

export const fetchGeneratedQuestions = async (role, type, count = 3) => {
  try {
    const response = await aiClient.post('/generate-questions', {
      role,
      type,
      count,
    });
    if (response.data && response.data.questions) {
      return response.data.questions;
    }
    throw new Error('Invalid format returned from AI Service');
  } catch (error) {
    console.error('[AI Service Client] Question generation error:', error.message);
    // Graceful server fallback if AI service is temporarily offline
    return [
      {
        questionText: `Describe how you approach system design and state management as a ${role}.`,
        category: 'Architecture',
        expectedKeywords: ['scalability', 'state', 'tradeoffs', 'testing']
      },
      {
        questionText: `Explain a challenging technical problem you solved recently and how you debugged it.`,
        category: 'Problem Solving',
        expectedKeywords: ['root cause', 'profiling', 'resolution', 'monitoring']
      },
      {
        questionText: `How do you ensure code quality and maintainability in a team environment?`,
        category: 'Quality & Collaboration',
        expectedKeywords: ['code review', 'ci/cd', 'documentation', 'testing']
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
    // Graceful fallback evaluation if microservice is offline
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
