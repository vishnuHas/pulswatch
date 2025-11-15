const { fetchRedditMentions } = require('./reddit');
const { fetchHackerNewsMentions } = require('./hackernews');
const { fetchGoogleNewsMentions } = require('./googlenews');

/**
 * Fetch and combine mentions from all sources
 * Returns unified dataset sorted by timestamp
 */
async function fetchAllMentions(brand) {
  try {
    console.log(`Fetching mentions for: ${brand}`);
    
    // Fetch from all sources in parallel
    const [redditData, hnData, newsData] = await Promise.all([
      fetchRedditMentions(brand),
      fetchHackerNewsMentions(brand),
      fetchGoogleNewsMentions(brand)
    ]);

    // Combine all mentions
    const allMentions = [...redditData, ...hnData, ...newsData];
    
    // Sort by timestamp (newest first)
    allMentions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    console.log(`Total mentions found: ${allMentions.length} (Reddit: ${redditData.length}, HN: ${hnData.length}, News: ${newsData.length})`);
    
    return {
      brand,
      total: allMentions.length,
      sources: {
        reddit: redditData.length,
        hackernews: hnData.length,
        news: newsData.length
      },
      mentions: allMentions,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error combining mentions:', error.message);
    throw error;
  }
}

module.exports = { fetchAllMentions };
