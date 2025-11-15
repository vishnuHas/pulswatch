const axios = require('axios');

/**
 * Fetch brand mentions from Reddit
 * Uses public Reddit JSON API (no authentication required)
 */
async function fetchRedditMentions(brand, limit = 25) {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(brand)}&sort=new&limit=${limit}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const posts = response.data.data.children;
    
    return posts.map(post => {
      const data = post.data;
      return {
        id: `reddit_${data.id}`,
        platform: 'reddit',
        author: data.author,
        title: data.title,
        text: data.selftext || data.title,
        url: `https://reddit.com${data.permalink}`,
        timestamp: new Date(data.created_utc * 1000).toISOString(),
        score: data.score,
        commentCount: data.num_comments
      };
    });
  } catch (error) {
    console.error('Reddit API Error:', error.message);
    return [];
  }
}

module.exports = { fetchRedditMentions };
