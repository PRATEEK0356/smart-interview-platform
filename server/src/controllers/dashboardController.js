import { InterviewSession } from '../models/InterviewSession.js';

// @desc    Get aggregated dashboard summary stats & performance trends
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all user sessions sorted chronologically
    const sessions = await InterviewSession.find({ userId }).sort({ createdAt: 1 });

    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalSessionsCount = completedSessions.length;

    let averageScore = 0;
    if (totalSessionsCount > 0) {
      const totalSum = completedSessions.reduce((acc, s) => acc + (s.overallScore || 0), 0);
      averageScore = Math.round(totalSum / totalSessionsCount);
    }

    const technicalCount = completedSessions.filter(s => s.type === 'technical').length;
    const behavioralCount = completedSessions.filter(s => s.type === 'behavioral').length;

    // Score history for timeline chart
    const scoreHistory = completedSessions.map(s => ({
      id: s._id,
      date: new Date(s.completedAt || s.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: s.overallScore || 0,
      role: s.role,
      type: s.type,
    }));

    // Aggregate category strengths and focus areas from question responses
    const categoryStats = {};
    completedSessions.forEach(s => {
      s.questions.forEach(q => {
        if (q.score !== null && q.score !== undefined) {
          const category = q.category || 'General';
          if (!categoryStats[category]) {
            categoryStats[category] = { totalScore: 0, count: 0 };
          }
          categoryStats[category].totalScore += q.score;
          categoryStats[category].count += 1;
        }
      });
    });

    const categoryAverages = Object.keys(categoryStats).map(cat => ({
      category: cat,
      averageScore: Math.round(categoryStats[cat].totalScore / categoryStats[cat].count),
      count: categoryStats[cat].count,
    }));

    // Strengths: categories with avg score >= 75
    const strengths = categoryAverages
      .filter(c => c.averageScore >= 75)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 4);

    // Focus areas: categories with avg score < 75 or lowest performing
    const focusAreas = categoryAverages
      .filter(c => c.averageScore < 75)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 4);

    // Fallback defaults if user hasn't completed enough questions yet
    const finalStrengths = strengths.length > 0 ? strengths : [
      { category: 'Frontend Architecture', averageScore: 85, count: 1 },
      { category: 'REST API Design', averageScore: 80, count: 1 }
    ];
    const finalFocusAreas = focusAreas.length > 0 ? focusAreas : [
      { category: 'System Concurrency', averageScore: 60, count: 1 },
      { category: 'Database Indexing', averageScore: 65, count: 1 }
    ];

    // Recent 5 sessions
    const recentSessions = [...sessions].reverse().slice(0, 5);

    res.status(200).json({
      success: true,
      summary: {
        totalSessions: totalSessionsCount,
        averageScore,
        technicalSessionsCount: technicalCount,
        behavioralSessionsCount: behavioralCount,
        scoreHistory,
        strengths: finalStrengths,
        focusAreas: finalFocusAreas,
        recentSessions,
      },
    });
  } catch (error) {
    next(error);
  }
};
