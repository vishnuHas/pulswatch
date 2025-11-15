const { analyzeSentimentLocal, analyzeBatchSentimentLocal } = require('./localAI');

/**
 * Analyze sentiment using local transformers model
 * 100% offline, no API required
 * Returns sentiment (Positive/Neutral/Negative) and confidence score
 */
async function analyzeSentiment(text) {
  return await analyzeSentimentLocal(text);
}


/**
 * Batch analyze sentiment for multiple mentions
 * Uses local model - no rate limits!
 */
async function analyzeBatchSentiment(mentions) {
  const results = [];
  
  console.log(`Analyzing sentiment for ${mentions.length} mentions using local AI...`);
  
  for (const mention of mentions) {
    const sentiment = await analyzeSentiment(mention.text || mention.title);
    results.push({
      ...mention,
      sentiment: sentiment.sentiment,
      confidence: sentiment.confidence
    });
  }
  
  console.log('✅ Local sentiment analysis complete');
  return results;
}

/**
 * Calculate sentiment statistics
 */
function calculateSentimentStats(mentionsWithSentiment) {
  const stats = {
    positive: 0,
    neutral: 0,
    negative: 0,
    total: mentionsWithSentiment.length
  };
  
  mentionsWithSentiment.forEach(mention => {
    const sentiment = mention.sentiment.toLowerCase();
    if (sentiment === 'positive') stats.positive++;
    else if (sentiment === 'negative') stats.negative++;
    else stats.neutral++;
  });
  
  stats.positivePercent = Math.round((stats.positive / stats.total) * 100);
  stats.neutralPercent = Math.round((stats.neutral / stats.total) * 100);
  stats.negativePercent = Math.round((stats.negative / stats.total) * 100);
  
  return stats;
}

module.exports = {
  analyzeSentiment,
  analyzeBatchSentiment,
  calculateSentimentStats
};
