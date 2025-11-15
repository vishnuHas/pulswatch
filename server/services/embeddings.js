const { generateEmbeddingLocal, generateBatchEmbeddingsLocal } = require('./localAI');

/**
 * Generate embeddings for text using local model
 * 100% offline, no API required
 */
async function generateEmbedding(text) {
  return await generateEmbeddingLocal(text);
}

/**
 * Generate embeddings for multiple texts using local model
 */
async function generateBatchEmbeddings(texts) {
  return await generateBatchEmbeddingsLocal(texts);
}

/**
 * Extract keywords using TF-IDF approach
 */
function extractKeywords(text, topN = 5) {
  const natural = require('natural');
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  
  tfidf.addDocument(text.toLowerCase());
  
  const keywords = [];
  tfidf.listTerms(0).slice(0, topN).forEach(item => {
    if (item.term.length > 3) {
      keywords.push(item.term);
    }
  });
  
  return keywords;
}

/**
 * Extract keywords from multiple mentions
 */
function extractBatchKeywords(mentions, topN = 8) {
  const natural = require('natural');
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  
  // Common stopwords to filter out
  const stopwords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were',
    'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'who', 'when',
    'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 'just', 'but', 'for', 'with', 'about', 'against',
    'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'from', 'up', 'down', 'in', 'out', 'off', 'over', 'under', 'again', 'further',
    'then', 'once', 'here', 'there', 'all', 'any', 'both', 'each', 'more', 'most',
    'other', 'some', 'such', 'their', 'them', 'they', 'his', 'her', 'its', 'our',
    'your', 'my', 'me', 'him', 'us', 'get', 'got', 'getting', 'like', 'really',
    'also', 'even', 'still', 'way', 'make', 'made', 'making', 'take', 'took',
    'taking', 'know', 'knew', 'known', 'think', 'thought', 'thinking', 'see',
    'saw', 'seen', 'come', 'came', 'coming', 'want', 'wanted', 'wanting', 'use',
    'used', 'using', 'find', 'found', 'finding', 'give', 'gave', 'given', 'giving',
    'tell', 'told', 'telling', 'work', 'worked', 'working', 'call', 'called',
    'calling', 'try', 'tried', 'trying', 'ask', 'asked', 'asking', 'need', 'needed',
    'needing', 'feel', 'felt', 'feeling', 'become', 'became', 'becoming', 'leave',
    'left', 'leaving', 'put', 'putting', 'mean', 'meant', 'meaning', 'keep', 'kept',
    'keeping', 'let', 'letting', 'begin', 'began', 'begun', 'beginning', 'seem',
    'seemed', 'seeming', 'help', 'helped', 'helping', 'talk', 'talked', 'talking',
    'turn', 'turned', 'turning', 'start', 'started', 'starting', 'show', 'showed',
    'shown', 'showing', 'hear', 'heard', 'hearing', 'play', 'played', 'playing',
    'run', 'ran', 'running', 'move', 'moved', 'moving', 'live', 'lived', 'living',
    'believe', 'believed', 'believing', 'bring', 'brought', 'bringing', 'happen',
    'happened', 'happening', 'write', 'wrote', 'written', 'writing', 'sit', 'sat',
    'sitting', 'stand', 'stood', 'standing', 'lose', 'lost', 'losing', 'pay',
    'paid', 'paying', 'meet', 'met', 'meeting', 'include', 'included', 'including',
    'continue', 'continued', 'continuing', 'set', 'setting', 'learn', 'learned',
    'learning', 'change', 'changed', 'changing', 'lead', 'led', 'leading', 'understand',
    'understood', 'understanding', 'watch', 'watched', 'watching', 'follow', 'followed',
    'following', 'stop', 'stopped', 'stopping', 'create', 'created', 'creating',
    'speak', 'spoke', 'spoken', 'speaking', 'read', 'reading', 'allow', 'allowed',
    'allowing', 'add', 'added', 'adding', 'spend', 'spent', 'spending', 'grow',
    'grew', 'grown', 'growing', 'open', 'opened', 'opening', 'walk', 'walked',
    'walking', 'win', 'won', 'winning', 'offer', 'offered', 'offering', 'remember',
    'remembered', 'remembering', 'love', 'loved', 'loving', 'consider', 'considered',
    'considering', 'appear', 'appeared', 'appearing', 'buy', 'bought', 'buying',
    'wait', 'waited', 'waiting', 'serve', 'served', 'serving', 'die', 'died',
    'dying', 'send', 'sent', 'sending', 'expect', 'expected', 'expecting', 'build',
    'built', 'building', 'stay', 'stayed', 'staying', 'fall', 'fell', 'fallen',
    'falling', 'cut', 'cutting', 'reach', 'reached', 'reaching', 'kill', 'killed',
    'killing', 'remain', 'remained', 'remaining', 'suggest', 'suggested', 'suggesting',
    'raise', 'raised', 'raising', 'pass', 'passed', 'passing', 'sell', 'sold',
    'selling', 'require', 'required', 'requiring', 'report', 'reported', 'reporting',
    'decide', 'decided', 'deciding', 'pull', 'pulled', 'pulling'
  ]);
  
  // Add all documents
  mentions.forEach(mention => {
    const text = (mention.text || mention.title || '').toLowerCase();
    tfidf.addDocument(text);
  });
  
  // Collect all terms across documents with better filtering
  const termFrequency = {};
  mentions.forEach((mention, idx) => {
    tfidf.listTerms(idx).forEach(item => {
      const term = item.term.toLowerCase();
      
      // Filter criteria:
      // 1. Length > 3 characters
      // 2. Not a stopword
      // 3. Not a number
      // 4. Contains at least one letter
      // 5. Not just special characters
      if (
        term.length > 3 &&
        !stopwords.has(term) &&
        !/^\d+$/.test(term) &&
        /[a-z]/.test(term) &&
        !/^[^a-z0-9]+$/.test(term)
      ) {
        termFrequency[term] = (termFrequency[term] || 0) + item.tfidf;
      }
    });
  });
  
  // Sort by frequency and return top N
  const sortedTerms = Object.entries(termFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN * 2) // Get more candidates
    .filter(([term]) => {
      // Additional filtering: prefer longer, more meaningful terms
      return term.length >= 4 && !/^(http|www|com|org|net)/.test(term);
    })
    .slice(0, topN)
    .map(([term]) => term);
  
  return sortedTerms;
}

module.exports = {
  generateEmbedding,
  generateBatchEmbeddings,
  extractKeywords,
  extractBatchKeywords
};
