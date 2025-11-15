const axios = require('axios');
const xml2js = require('xml2js');
const { v4: uuidv4 } = require('uuid');

/**
 * Fetch brand mentions from Google News RSS
 * Parse XML to JSON and normalize
 */
async function fetchGoogleNewsMentions(brand) {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(brand)}&hl=en-US&gl=US&ceid=US:en`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    
    const items = result.rss?.channel?.[0]?.item || [];
    
    return items.map(item => ({
      id: `news_${uuidv4()}`,
      platform: 'news',
      title: item.title?.[0] || '',
      text: item.description?.[0]?.replace(/<[^>]*>/g, '') || item.title?.[0] || '',
      url: item.link?.[0] || '',
      timestamp: new Date(item.pubDate?.[0] || Date.now()).toISOString()
    }));
  } catch (error) {
    console.error('Google News API Error:', error.message);
    return [];
  }
}

module.exports = { fetchGoogleNewsMentions };
