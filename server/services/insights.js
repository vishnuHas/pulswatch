const { generateInsightsLocal } = require('./localAI');
const { extractBatchKeywords } = require('./embeddings');

/**
 * Generate AI insights from mentions data
 * Runs every 5 minutes to provide executive summary
 */
async function generateInsights(brand, mentionsWithSentiment, previousStats = null) {
  try {
    // Calculate current statistics
    const currentStats = calculateStats(mentionsWithSentiment);
    
    // Extract trending keywords
    const keywords = extractBatchKeywords(mentionsWithSentiment, 8);
    
    // Get recent mentions for context
    const recentMentions = mentionsWithSentiment
      .slice(0, 10)
      .map(m => `- [${m.sentiment}] ${m.title || m.text.substring(0, 100)}`)
      .join('\n');
    
    // Calculate sentiment change
    let sentimentChange = 'stable';
    let changePercent = 0;
    
    if (previousStats) {
      const currentNegativePercent = (currentStats.negative / currentStats.total) * 100;
      const previousNegativePercent = (previousStats.negative / previousStats.total) * 100;
      changePercent = currentNegativePercent - previousNegativePercent;
      
      if (changePercent > 5) sentimentChange = 'increasing negativity';
      else if (changePercent < -5) sentimentChange = 'increasing positivity';
    } else {
      // If no previous stats, calculate based on current sentiment distribution
      const positivePercent = (currentStats.positive / currentStats.total) * 100;
      const negativePercent = (currentStats.negative / currentStats.total) * 100;
      changePercent = positivePercent - negativePercent;
      
      if (positivePercent > negativePercent) sentimentChange = 'increasing positivity';
      else if (negativePercent > positivePercent) sentimentChange = 'increasing negativity';
    }
    
    // Generate insights using local rule-based logic (no LLM needed)
    const insight = generateInsightsLocal(
      brand,
      currentStats,
      keywords,
      sentimentChange,
      changePercent
    );
    
    return {
      brand,
      insight,
      stats: currentStats,
      keywords,
      sentimentChange,
      changePercent: Math.abs(changePercent) < 0.1 ? Math.round(changePercent) : parseFloat(changePercent.toFixed(1)),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Insights generation error:', error.message);
    
    // Fallback to basic insight
    const currentStats = calculateStats(mentionsWithSentiment);
    const keywords = [];
    let changePercent = 0;
    let sentimentChange = 'stable';
    
    const insight = `${brand} has ${currentStats.total} mentions. Positive: ${currentStats.positive}, Neutral: ${currentStats.neutral}, Negative: ${currentStats.negative}.`;
    
    return {
      brand,
      insight,
      stats: currentStats,
      keywords,
      sentimentChange,
      changePercent: Math.abs(changePercent) < 0.1 ? Math.round(changePercent) : parseFloat(changePercent.toFixed(1)),
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Calculate statistics from mentions
 */
function calculateStats(mentions) {
  const stats = {
    total: mentions.length,
    positive: 0,
    neutral: 0,
    negative: 0
  };
  
  mentions.forEach(m => {
    const sentiment = (m.sentiment || 'Neutral').toLowerCase();
    if (sentiment === 'positive') stats.positive++;
    else if (sentiment === 'negative') stats.negative++;
    else stats.neutral++;
  });
  
  return stats;
}

module.exports = {
  generateInsights
};
