require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const NodeCache = require('node-cache');

// Import services
const { fetchAllMentions } = require('./services/combiner');
const { analyzeBatchSentiment, calculateSentimentStats } = require('./services/sentiment');
const { performTopicClustering } = require('./services/clustering');
const { detectSpikes, generateTimeline } = require('./services/spikes');
const { generateInsights } = require('./services/insights');
const { extractBatchKeywords } = require('./services/embeddings');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Cache for storing processed data (5 minute TTL)
const cache = new NodeCache({ stdTTL: 300 });

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (for mobile access)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for large payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Store for tracking previous stats (for insights comparison)
const previousStats = {};

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast to all connected WebSocket clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// API Routes

/**
 * GET /api/fetchAll?brand=NAME
 * Fetch all mentions from all sources
 */
app.get('/api/fetchAll', async (req, res) => {
  try {
    const { brand } = req.query;
    
    if (!brand) {
      return res.status(400).json({ error: 'Brand parameter is required' });
    }
    
    console.log(`\n=== Fetching all mentions for: ${brand} ===`);
    
    // Check cache first
    const cacheKey = `mentions_${brand}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Returning cached data');
      return res.json({ ...cached, cached: true });
    }
    
    // Fetch fresh data
    const data = await fetchAllMentions(brand);
    
    // Cache the result
    cache.set(cacheKey, data);
    
    // Broadcast to WebSocket clients
    broadcast({
      type: 'mentions_update',
      brand,
      data
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error in /api/fetchAll:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sentiment
 * Analyze sentiment for mentions
 */
app.post('/api/sentiment', async (req, res) => {
  try {
    const { brand, mentions } = req.body;
    
    if (!mentions || !Array.isArray(mentions)) {
      return res.status(400).json({ error: 'Mentions array is required' });
    }
    
    console.log(`\n=== Analyzing sentiment for ${mentions.length} mentions ===`);
    
    // Check cache
    const cacheKey = `sentiment_${brand}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Returning cached sentiment data');
      return res.json({ ...cached, cached: true });
    }
    
    // Analyze sentiment
    const mentionsWithSentiment = await analyzeBatchSentiment(mentions);
    const stats = calculateSentimentStats(mentionsWithSentiment);
    
    const result = {
      brand,
      mentions: mentionsWithSentiment,
      stats,
      timestamp: new Date().toISOString()
    };
    
    // Cache the result
    cache.set(cacheKey, result);
    
    // Broadcast to WebSocket clients
    broadcast({
      type: 'sentiment_update',
      brand,
      stats
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in /api/sentiment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/clusters
 * Perform topic clustering
 */
app.post('/api/clusters', async (req, res) => {
  try {
    const { brand, mentions } = req.body;
    
    if (!mentions || !Array.isArray(mentions)) {
      return res.status(400).json({ error: 'Mentions array is required' });
    }
    
    console.log(`\n=== Clustering ${mentions.length} mentions ===`);
    
    // Check cache
    const cacheKey = `clusters_${brand}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Returning cached cluster data');
      return res.json({ ...cached, cached: true });
    }
    
    // Perform clustering
    const k = Math.min(4, Math.max(2, Math.floor(mentions.length / 5)));
    const result = await performTopicClustering(mentions, k);
    
    result.brand = brand;
    result.timestamp = new Date().toISOString();
    
    // Cache the result
    cache.set(cacheKey, result);
    
    res.json(result);
  } catch (error) {
    console.error('Error in /api/clusters:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/timeline
 * Generate timeline data
 */
app.post('/api/timeline', async (req, res) => {
  try {
    const { brand, mentions } = req.body;
    
    if (!mentions || !Array.isArray(mentions)) {
      return res.status(400).json({ error: 'Mentions array is required' });
    }
    
    console.log(`\n=== Generating timeline for ${mentions.length} mentions ===`);
    
    const timeline = generateTimeline(mentions, 60);
    
    res.json({
      brand,
      timeline,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/timeline:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/spikes
 * Detect sentiment spikes
 */
app.post('/api/spikes', async (req, res) => {
  try {
    const { brand, mentions } = req.body;
    
    if (!mentions || !Array.isArray(mentions)) {
      return res.status(400).json({ error: 'Mentions array is required' });
    }
    
    console.log(`\n=== Detecting spikes for ${mentions.length} mentions ===`);
    
    const spikeData = detectSpikes(mentions);
    
    // Broadcast spikes to WebSocket clients
    if (spikeData.hasSpikes) {
      broadcast({
        type: 'spike_alert',
        brand,
        spikes: spikeData.spikes
      });
    }
    
    res.json({
      brand,
      ...spikeData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/spikes:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/insights
 * Generate AI insights
 */
app.post('/api/insights', async (req, res) => {
  try {
    const { brand, mentions } = req.body;
    
    if (!mentions || !Array.isArray(mentions)) {
      return res.status(400).json({ error: 'Mentions array is required' });
    }
    
    console.log(`\n=== Generating insights for ${brand} ===`);
    
    // Check cache
    const cacheKey = `insights_${brand}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Returning cached insights');
      return res.json({ ...cached, cached: true });
    }
    
    // Generate insights
    const previous = previousStats[brand];
    const insights = await generateInsights(brand, mentions, previous);
    
    // Store current stats for next comparison
    previousStats[brand] = insights.stats;
    
    // Cache the result
    cache.set(cacheKey, insights);
    
    // Broadcast to WebSocket clients
    broadcast({
      type: 'insights_update',
      brand,
      insights
    });
    
    res.json(insights);
  } catch (error) {
    console.error('Error in /api/insights:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/keywords?brand=NAME
 * Extract trending keywords
 */
app.post('/api/keywords', async (req, res) => {
  try {
    const { brand, mentions } = req.body;
    
    if (!mentions || !Array.isArray(mentions)) {
      return res.status(400).json({ error: 'Mentions array is required' });
    }
    
    const keywords = extractBatchKeywords(mentions, 20);
    
    res.json({
      brand,
      keywords,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/keywords:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/compare?brandA=X&brandB=Y
 * Compare two brands
 */
app.get('/api/compare', async (req, res) => {
  try {
    const { brandA, brandB } = req.query;
    
    if (!brandA || !brandB) {
      return res.status(400).json({ error: 'Both brandA and brandB parameters are required' });
    }
    
    console.log(`\n=== Comparing ${brandA} vs ${brandB} ===`);
    
    // Fetch data for both brands
    const [dataA, dataB] = await Promise.all([
      fetchAllMentions(brandA),
      fetchAllMentions(brandB)
    ]);
    
    // Analyze sentiment for both
    const [sentimentA, sentimentB] = await Promise.all([
      analyzeBatchSentiment(dataA.mentions),
      analyzeBatchSentiment(dataB.mentions)
    ]);
    
    const statsA = calculateSentimentStats(sentimentA);
    const statsB = calculateSentimentStats(sentimentB);
    
    res.json({
      brandA: {
        name: brandA,
        total: dataA.total,
        stats: statsA
      },
      brandB: {
        name: brandB,
        total: dataB.total,
        stats: statsB
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/compare:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    websocketClients: wss.clients.size
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🔵 PulseWatch Server Running                 ║
║                                                            ║
║  Local:      http://localhost:${PORT}                        ║
║  Network:    http://${localIP}:${PORT}                   ║
║  WebSocket:  ws://${localIP}:${PORT}                     ║
║  Health:     http://${localIP}:${PORT}/api/health        ║
║                                                            ║
║  📱 Mobile Access: Use Network URL above                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Periodic updates (every 30 seconds)
setInterval(async () => {
  // This would normally fetch updates for tracked brands
  // For now, just keep the connection alive
  broadcast({
    type: 'heartbeat',
    timestamp: new Date().toISOString()
  });
}, 30000);
