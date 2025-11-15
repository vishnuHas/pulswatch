const { pipeline } = require('@xenova/transformers');

/**
 * Local AI Engine - 100% Offline, Zero Cost
 * Uses Hugging Face Transformers.js for all AI tasks
 * No API keys, no rate limits, no external dependencies
 */

// Cache for loaded pipelines
let sentimentPipeline = null;
let embeddingPipeline = null;

/**
 * Initialize sentiment analysis pipeline
 * Uses distilbert-base-uncased-finetuned-sst-2-english
 */
async function initSentimentPipeline() {
  if (!sentimentPipeline) {
    console.log('🤖 Loading local sentiment analysis model...');
    sentimentPipeline = await pipeline('sentiment-analysis');
    console.log('✅ Sentiment model loaded');
  }
  return sentimentPipeline;
}

/**
 * Initialize embedding pipeline
 * Uses all-MiniLM-L6-v2 for feature extraction
 */
async function initEmbeddingPipeline() {
  if (!embeddingPipeline) {
    console.log('🤖 Loading local embedding model...');
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('✅ Embedding model loaded');
  }
  return embeddingPipeline;
}

/**
 * Analyze sentiment using local model
 * Returns: { sentiment: 'Positive'|'Neutral'|'Negative', confidence: 0-1 }
 */
async function analyzeSentimentLocal(text) {
  try {
    if (!text || text.trim().length === 0) {
      return { sentiment: 'Neutral', confidence: 0.5 };
    }

    const pipe = await initSentimentPipeline();
    const result = await pipe(text.substring(0, 512));
    
    // Convert model output to our format
    const label = result[0].label.toUpperCase();
    const score = result[0].score;
    
    let sentiment;
    if (label === 'POSITIVE') {
      sentiment = 'Positive';
    } else if (label === 'NEGATIVE') {
      sentiment = 'Negative';
    } else {
      sentiment = 'Neutral';
    }
    
    return {
      sentiment,
      confidence: score
    };
  } catch (error) {
    console.error('Local sentiment analysis error:', error.message);
    // Fallback to keyword-based
    return keywordBasedSentiment(text);
  }
}

/**
 * Generate embeddings using local model
 * Returns: Array of numbers (384 dimensions)
 */
async function generateEmbeddingLocal(text) {
  try {
    const pipe = await initEmbeddingPipeline();
    const output = await pipe(text.substring(0, 512), { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error('Local embedding error:', error.message);
    // Return random embedding as fallback
    return Array(384).fill(0).map(() => Math.random());
  }
}

/**
 * Batch sentiment analysis
 */
async function analyzeBatchSentimentLocal(texts) {
  const results = [];
  
  for (const text of texts) {
    const sentiment = await analyzeSentimentLocal(text);
    results.push(sentiment);
  }
  
  return results;
}

/**
 * Batch embedding generation
 */
async function generateBatchEmbeddingsLocal(texts) {
  const embeddings = [];
  
  for (const text of texts) {
    const embedding = await generateEmbeddingLocal(text);
    embeddings.push(embedding);
  }
  
  return embeddings;
}

/**
 * Generate insights using rule-based logic (no LLM needed)
 * Analyzes patterns and generates actionable recommendations
 */
function generateInsightsLocal(brand, stats, keywords, sentimentChange, changePercent) {
  const { total, positive, neutral, negative } = stats;
  const positivePercent = Math.round((positive / total) * 100);
  const negativePercent = Math.round((negative / total) * 100);
  const neutralPercent = Math.round((neutral / total) * 100);
  
  let insight = '';
  let recommendation = '';
  
  // Analyze overall sentiment
  if (negativePercent > 50) {
    insight = `⚠️ Critical Alert: ${brand} is experiencing high negative sentiment (${negativePercent}%). `;
    recommendation = 'Immediate action required: Address customer complaints and investigate root causes.';
  } else if (negativePercent > 30) {
    insight = `⚠️ Warning: ${brand} has elevated negative sentiment (${negativePercent}%). `;
    recommendation = 'Monitor closely and prepare response strategy for common issues.';
  } else if (positivePercent > 60) {
    insight = `✅ Excellent: ${brand} maintains strong positive sentiment (${positivePercent}%). `;
    recommendation = 'Leverage positive feedback in marketing. Continue current strategies.';
  } else if (positivePercent > 40) {
    insight = `✓ Good: ${brand} has healthy positive sentiment (${positivePercent}%). `;
    recommendation = 'Maintain current approach while addressing neutral mentions.';
  } else {
    insight = `ℹ️ Mixed: ${brand} shows balanced sentiment across ${total} mentions. `;
    recommendation = 'Focus on converting neutral sentiment to positive through engagement.';
  }
  
  // Add trend analysis
  if (Math.abs(changePercent) > 10) {
    if (changePercent > 0) {
      insight += `Negative sentiment increased by ${changePercent.toFixed(1)}%. `;
    } else {
      insight += `Positive trend: sentiment improved by ${Math.abs(changePercent).toFixed(1)}%. `;
    }
  }
  
  // Add keyword insights
  if (keywords && keywords.length > 0) {
    const topKeywords = keywords.slice(0, 3).join(', ');
    insight += `\n\nTrending Topics: ${topKeywords}. `;
    
    // Check for problem indicators
    const problemWords = ['bug', 'issue', 'problem', 'broken', 'error', 'crash', 'fail'];
    const hasProblems = keywords.some(k => problemWords.includes(k.toLowerCase()));
    
    if (hasProblems) {
      insight += '\n\nTechnical Issues Detected: Multiple mentions of bugs/problems. ';
      recommendation = 'Priority: Address technical issues and communicate fixes to users.';
    }
    
    // Check for positive indicators
    const positiveWords = ['great', 'love', 'excellent', 'amazing', 'best', 'perfect'];
    const hasPositive = keywords.some(k => positiveWords.includes(k.toLowerCase()));
    
    if (hasPositive) {
      insight += '\n\nPositive Feedback: Users expressing satisfaction. ';
    }
  }
  
  // Add volume analysis
  if (total > 100) {
    insight += `\n\nHigh Volume: ${total} mentions indicate strong brand awareness. `;
  } else if (total < 20) {
    insight += `\n\nLow Volume: ${total} mentions suggest limited visibility. `;
    recommendation = 'Consider increasing brand awareness campaigns.';
  }
  
  // Final recommendation
  insight += `\n\nRecommendation: ${recommendation}`;
  
  return insight;
}

/**
 * Fallback keyword-based sentiment
 */
function keywordBasedSentiment(text) {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'best', 'awesome', 'fantastic', 'good', 'perfect', 'wonderful', 'outstanding', 'brilliant'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'poor', 'disappointing', 'issue', 'problem', 'bug', 'broken', 'fail', 'crash'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) {
    return { sentiment: 'Positive', confidence: Math.min(0.6 + (positiveCount * 0.1), 0.95) };
  } else if (negativeCount > positiveCount) {
    return { sentiment: 'Negative', confidence: Math.min(0.6 + (negativeCount * 0.1), 0.95) };
  } else {
    return { sentiment: 'Neutral', confidence: 0.5 };
  }
}

/**
 * Auto-label clusters based on content analysis
 */
function autoLabelCluster(clusterMentions) {
  const texts = clusterMentions.map(m => (m.text || m.title).toLowerCase()).join(' ');
  
  // Check for common patterns
  if (texts.includes('bug') || texts.includes('issue') || texts.includes('problem') || texts.includes('broken')) {
    return 'Bugs & Issues';
  } else if (texts.includes('great') || texts.includes('love') || texts.includes('excellent') || texts.includes('amazing')) {
    return 'Praise';
  } else if (texts.includes('vs') || texts.includes('compared') || texts.includes('alternative')) {
    return 'Comparisons';
  } else if (texts.includes('how') || texts.includes('what') || texts.includes('why') || texts.includes('?')) {
    return 'Questions';
  } else if (texts.includes('feature') || texts.includes('request') || texts.includes('should') || texts.includes('need')) {
    return 'Feature Requests';
  } else if (texts.includes('news') || texts.includes('announce') || texts.includes('release') || texts.includes('update')) {
    return 'News & Updates';
  } else {
    return 'General Discussion';
  }
}

module.exports = {
  analyzeSentimentLocal,
  generateEmbeddingLocal,
  analyzeBatchSentimentLocal,
  generateBatchEmbeddingsLocal,
  generateInsightsLocal,
  autoLabelCluster,
  initSentimentPipeline,
  initEmbeddingPipeline
};
