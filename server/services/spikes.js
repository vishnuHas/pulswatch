/**
 * Detect positive/negative spikes in mentions
 * Compare last 5 minutes vs average of previous 20 minutes
 */
function detectSpikes(mentionsWithSentiment) {
  const now = new Date();
  const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);
  const twentyFiveMinutesAgo = new Date(now - 25 * 60 * 1000);
  
  // Split mentions into time windows
  const last5Minutes = mentionsWithSentiment.filter(m => 
    new Date(m.timestamp) >= fiveMinutesAgo
  );
  
  const previous20Minutes = mentionsWithSentiment.filter(m => {
    const time = new Date(m.timestamp);
    return time >= twentyFiveMinutesAgo && time < fiveMinutesAgo;
  });
  
  // Calculate sentiment counts for each window
  const recent = calculateSentimentCounts(last5Minutes);
  const baseline = calculateSentimentCounts(previous20Minutes);
  
  // Detect spikes (>40% increase)
  const spikes = [];
  
  // Negative spike detection
  if (baseline.negative > 0) {
    const negativeIncrease = ((recent.negative - baseline.negative) / baseline.negative) * 100;
    if (negativeIncrease > 40) {
      spikes.push({
        type: 'negative',
        severity: 'high',
        increase: Math.round(negativeIncrease),
        current: recent.negative,
        baseline: baseline.negative,
        message: `Negative sentiment surged by ${Math.round(negativeIncrease)}%`,
        timestamp: new Date().toISOString()
      });
    }
  } else if (recent.negative > 3) {
    // Spike from zero baseline
    spikes.push({
      type: 'negative',
      severity: 'medium',
      increase: 100,
      current: recent.negative,
      baseline: 0,
      message: `Sudden increase in negative mentions detected`,
      timestamp: new Date().toISOString()
    });
  }
  
  // Positive spike detection
  if (baseline.positive > 0) {
    const positiveIncrease = ((recent.positive - baseline.positive) / baseline.positive) * 100;
    if (positiveIncrease > 40) {
      spikes.push({
        type: 'positive',
        severity: 'good',
        increase: Math.round(positiveIncrease),
        current: recent.positive,
        baseline: baseline.positive,
        message: `Positive sentiment surged by ${Math.round(positiveIncrease)}%`,
        timestamp: new Date().toISOString()
      });
    }
  } else if (recent.positive > 3) {
    spikes.push({
      type: 'positive',
      severity: 'good',
      increase: 100,
      current: recent.positive,
      baseline: 0,
      message: `Sudden increase in positive mentions detected`,
      timestamp: new Date().toISOString()
    });
  }
  
  // Volume spike detection
  const totalRecent = recent.total;
  const totalBaseline = baseline.total;
  
  if (totalBaseline > 0) {
    const volumeIncrease = ((totalRecent - totalBaseline) / totalBaseline) * 100;
    if (volumeIncrease > 50) {
      spikes.push({
        type: 'volume',
        severity: 'info',
        increase: Math.round(volumeIncrease),
        current: totalRecent,
        baseline: totalBaseline,
        message: `Mention volume increased by ${Math.round(volumeIncrease)}%`,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // If no time-based spikes detected, check overall sentiment distribution
  if (spikes.length === 0 && mentionsWithSentiment.length > 10) {
    const allCounts = calculateSentimentCounts(mentionsWithSentiment);
    const negativePercent = (allCounts.negative / allCounts.total) * 100;
    const positivePercent = (allCounts.positive / allCounts.total) * 100;
    
    // Alert if high negative sentiment
    if (negativePercent > 40) {
      spikes.push({
        type: 'negative',
        severity: 'high',
        increase: Math.round(negativePercent),
        current: allCounts.negative,
        baseline: allCounts.total,
        message: `High negative sentiment detected: ${Math.round(negativePercent)}% of mentions`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Alert if very high positive sentiment
    if (positivePercent > 70) {
      spikes.push({
        type: 'positive',
        severity: 'good',
        increase: Math.round(positivePercent),
        current: allCounts.positive,
        baseline: allCounts.total,
        message: `Excellent positive sentiment: ${Math.round(positivePercent)}% of mentions`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Alert if unusual activity (very high volume)
    if (allCounts.total > 100) {
      spikes.push({
        type: 'volume',
        severity: 'info',
        increase: allCounts.total,
        current: allCounts.total,
        baseline: 0,
        message: `High activity: ${allCounts.total} mentions detected`,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return {
    spikes,
    recent,
    baseline,
    hasSpikes: spikes.length > 0
  };
}

/**
 * Calculate sentiment counts for a set of mentions
 */
function calculateSentimentCounts(mentions) {
  const counts = {
    positive: 0,
    neutral: 0,
    negative: 0,
    total: mentions.length
  };
  
  mentions.forEach(mention => {
    const sentiment = (mention.sentiment || 'Neutral').toLowerCase();
    if (sentiment === 'positive') counts.positive++;
    else if (sentiment === 'negative') counts.negative++;
    else counts.neutral++;
  });
  
  return counts;
}

/**
 * Generate timeline data for charting
 */
function generateTimeline(mentions, intervalMinutes = 60) {
  const timeline = [];
  const now = new Date();
  const intervals = 24; // Last 24 hours
  
  for (let i = intervals - 1; i >= 0; i--) {
    const endTime = new Date(now - i * intervalMinutes * 60 * 1000);
    const startTime = new Date(endTime - intervalMinutes * 60 * 1000);
    
    const intervalMentions = mentions.filter(m => {
      const time = new Date(m.timestamp);
      return time >= startTime && time < endTime;
    });
    
    const counts = calculateSentimentCounts(intervalMentions);
    
    timeline.push({
      timestamp: endTime.toISOString(),
      time: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      total: counts.total,
      positive: counts.positive,
      neutral: counts.neutral,
      negative: counts.negative
    });
  }
  
  return timeline;
}

module.exports = {
  detectSpikes,
  generateTimeline,
  calculateSentimentCounts
};
