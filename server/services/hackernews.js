const axios = require('axios');

/**
 * Fetch brand mentions from Hacker News
 * Uses Algolia HN Search API
 */
async function fetchHackerNewsMentions(brand) {
  try {
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(brand)}&hitsPerPage=25`;
    
    const response = await axios.get(url);
    const hits = response.data.hits;
    
    return hits.map(hit => ({
      id: `hn_${hit.objectID}`,
      platform: 'hackernews',
      author: hit.author,
      title: hit.title || hit.story_title || '',
      text: hit.comment_text || hit.story_text || hit.title || '',
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      timestamp: new Date(hit.created_at).toISOString(),
      score: hit.points || 0
    }));
  } catch (error) {
    console.error('Hacker News API Error:', error.message);
    return [];
  }
}

module.exports = { fetchHackerNewsMentions };
