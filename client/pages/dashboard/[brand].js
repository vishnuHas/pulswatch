import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowLeft, RefreshCw, MessageSquare, BarChart3, Zap, Smile, CheckCircle, X, Sparkles, Bell, Clock, TrendingUp, Download } from 'lucide-react';

// Scroll-triggered animation wrapper
function ScrollAnimatedCard({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    up: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } }
  };

  return (
    <motion.div
      ref={ref}
      initial={variants[direction].initial}
      animate={isInView ? variants[direction].animate : variants[direction].initial}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 80, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
import {
  DateCard,
  RefreshCard,
  MetricCard,
  TimelineCard,
  TopicClustersCard,
  AIInsightsCard,
  LiveMentionsFeedCard,
  HelpCard,
  SentimentCard,
  LiveAlertsCard,
  RealTimeActivityCard,
  PlatformDistributionCard,
  QuickStatsCard,
  TrendingKeywordsCard
} from '../../components/cards';
import {
  fetchAllMentions,
  analyzeSentiment,
  getClusters,
  getTimeline,
  detectSpikes,
  getInsights,
  getKeywords,
  createWebSocket
} from '../../utils/api';

export default function Dashboard({ darkMode, setDarkMode }) {
  const router = useRouter();
  const { brand } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mentions, setMentions] = useState([]);
  const [sentimentData, setSentimentData] = useState(null);
  const [clusterData, setClusterData] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [spikeData, setSpikeData] = useState([]);
  const [insightsData, setInsightsData] = useState(null);
  const [keywordsData, setKeywordsData] = useState([]);
  const [ws, setWs] = useState(null);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'update', message: 'Dashboard data refreshed', time: '2m ago', read: false },
    { id: 2, type: 'spike', message: 'Spike detected in mentions', time: '15m ago', read: false },
    { id: 3, type: 'sentiment', message: 'Positive sentiment increased', time: '1h ago', read: true }
  ]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    if (!brand) return;
    const interval = setInterval(() => {
      loadDashboardData(false);
    }, 120000);
    return () => clearInterval(interval);
  }, [brand]);

  useEffect(() => {
    if (brand) {
      loadDashboardData(true, true); // Initial load with loading screen
      const websocket = createWebSocket((data) => {
        if (data.type === 'mentions_update' && data.brand === brand) {
          setMentions(data.data.mentions);
        }
      });
      setWs(websocket);
      return () => websocket?.close();
    }
  }, [brand]);

  const exportDashboardData = (format = 'all') => {
    setShowExportMenu(false);
    const exportData = {
      brand: brand,
      exportDate: new Date().toISOString(),
      summary: {
        totalMentions: mentions.length,
        positivePercent: sentimentData?.positivePercent || 0,
        negativePercent: sentimentData?.negativePercent || 0,
        neutralPercent: sentimentData?.neutralPercent || 0,
        activeSpikes: spikeData.length,
        topicClusters: clusterData ? Object.keys(clusterData).length : 0
      },
      sentiment: {
        positive: sentimentData?.positive || 0,
        negative: sentimentData?.negative || 0,
        neutral: sentimentData?.neutral || 0,
        total: mentions.length
      },
      topKeywords: keywordsData?.slice(0, 10) || [],
      recentMentions: mentions.slice(0, 20).map(m => ({
        platform: m.platform,
        text: m.text || m.title,
        sentiment: m.sentiment,
        date: m.created_at || m.date,
        url: m.url
      })),
      insights: insightsData?.insight || 'No insights available',
      spikes: spikeData.map(s => ({
        timestamp: s.timestamp,
        count: s.count,
        change: s.change
      }))
    };

    // Create formatted text report
    let report = `PULSEWATCH DASHBOARD REPORT\n`;
    report += `${'='.repeat(50)}\n\n`;
    report += `Brand: ${brand}\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    report += `SUMMARY\n${'-'.repeat(50)}\n`;
    report += `Total Mentions: ${exportData.summary.totalMentions}\n`;
    report += `Positive Sentiment: ${exportData.summary.positivePercent}%\n`;
    report += `Negative Sentiment: ${exportData.summary.negativePercent}%\n`;
    report += `Neutral Sentiment: ${exportData.summary.neutralPercent}%\n`;
    report += `Active Alerts: ${exportData.summary.activeSpikes}\n`;
    report += `Topic Clusters: ${exportData.summary.topicClusters}\n\n`;
    
    report += `TOP KEYWORDS\n${'-'.repeat(50)}\n`;
    exportData.topKeywords.forEach((kw, i) => {
      report += `${i + 1}. ${kw}\n`;
    });
    report += `\n`;
    
    report += `INSIGHTS\n${'-'.repeat(50)}\n`;
    report += `${exportData.insights}\n\n`;
    
    report += `RECENT MENTIONS (Last 20)\n${'-'.repeat(50)}\n`;
    exportData.recentMentions.forEach((m, i) => {
      report += `\n${i + 1}. [${m.platform.toUpperCase()}] ${m.sentiment}\n`;
      report += `   ${m.text.substring(0, 150)}${m.text.length > 150 ? '...' : ''}\n`;
      report += `   Date: ${new Date(m.date).toLocaleString()}\n`;
    });

    const dateStr = new Date().toISOString().split('T')[0];

    // Download TXT
    if (format === 'txt' || format === 'all') {
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brand}_dashboard_${dateStr}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Download JSON
    if (format === 'json' || format === 'all') {
      const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonA = document.createElement('a');
      jsonA.href = jsonUrl;
      jsonA.download = `${brand}_dashboard_${dateStr}.json`;
      document.body.appendChild(jsonA);
      jsonA.click();
      document.body.removeChild(jsonA);
      URL.revokeObjectURL(jsonUrl);
    }

    // Download PDF
    if (format === 'pdf' || format === 'all') {
      // Create a simple HTML for PDF
      const pdfHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>PulseWatch Dashboard Report - ${brand}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
    h1 { color: #f97316; border-bottom: 3px solid #f97316; padding-bottom: 10px; }
    h2 { color: #ea580c; margin-top: 30px; border-bottom: 2px solid #fed7aa; padding-bottom: 5px; }
    .summary { background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; }
    .metric-label { font-size: 12px; color: #666; }
    .metric-value { font-size: 24px; font-weight: bold; color: #f97316; }
    .keyword { display: inline-block; background: #fed7aa; padding: 5px 10px; margin: 5px; border-radius: 5px; }
    .mention { background: #f9fafb; padding: 15px; margin: 10px 0; border-left: 4px solid #f97316; border-radius: 4px; }
    .mention-header { font-weight: bold; color: #f97316; margin-bottom: 5px; }
    .mention-text { color: #555; margin: 5px 0; }
    .mention-meta { font-size: 12px; color: #999; }
    .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <h1>📊 PulseWatch Dashboard Report</h1>
  <p><strong>Brand:</strong> ${brand}</p>
  <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  
  <div class="summary">
    <h2>Summary</h2>
    <div class="metric">
      <div class="metric-label">Total Mentions</div>
      <div class="metric-value">${exportData.summary.totalMentions}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Positive</div>
      <div class="metric-value">${exportData.summary.positivePercent}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">Negative</div>
      <div class="metric-value">${exportData.summary.negativePercent}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">Neutral</div>
      <div class="metric-value">${exportData.summary.neutralPercent}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">Active Alerts</div>
      <div class="metric-value">${exportData.summary.activeSpikes}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Topic Clusters</div>
      <div class="metric-value">${exportData.summary.topicClusters}</div>
    </div>
  </div>

  <h2>Top Keywords</h2>
  <div>
    ${exportData.topKeywords.map(kw => `<span class="keyword">${kw}</span>`).join('')}
  </div>

  <h2>AI Insights</h2>
  <p>${exportData.insights}</p>

  <h2>Recent Mentions (Last 20)</h2>
  ${exportData.recentMentions.map((m, i) => `
    <div class="mention">
      <div class="mention-header">#${i + 1} - [${m.platform.toUpperCase()}] ${m.sentiment}</div>
      <div class="mention-text">${m.text.substring(0, 200)}${m.text.length > 200 ? '...' : ''}</div>
      <div class="mention-meta">Date: ${new Date(m.date).toLocaleString()}</div>
    </div>
  `).join('')}

  <div class="footer">
    <p>Generated by PulseWatch - Real-time Brand Monitoring</p>
    <p>${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`;

      const pdfBlob = new Blob([pdfHtml], { type: 'text/html' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const pdfA = document.createElement('a');
      pdfA.href = pdfUrl;
      pdfA.download = `${brand}_dashboard_${dateStr}.html`;
      document.body.appendChild(pdfA);
      pdfA.click();
      document.body.removeChild(pdfA);
      URL.revokeObjectURL(pdfUrl);
    }
  };

  const loadDashboardData = async (useCache = true, isInitialLoad = false) => {
    try {
      // Only show loading screen on initial load
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const mentionsResult = await fetchAllMentions(brand, useCache);
      
      if (mentionsResult.mentions.length === 0) {
        setError('No mentions found');
        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      const sentimentResult = await analyzeSentiment(brand, mentionsResult.mentions, useCache);
      const mentionsWithSentiment = sentimentResult.mentions;

      const clustersResult = await getClusters(brand, mentionsWithSentiment, useCache);
      const timelineResult = await getTimeline(brand, mentionsWithSentiment, useCache);
      const spikesResult = await detectSpikes(brand, mentionsWithSentiment);
      const insightsResult = await getInsights(brand, mentionsWithSentiment, useCache);
      const keywordsResult = await getKeywords(brand, mentionsWithSentiment, useCache);

      // Update all state at once for smooth transition
      setMentions(mentionsWithSentiment);
      setSentimentData(sentimentResult.stats);
      setClusterData(clustersResult.clusters);
      setTimelineData(timelineResult.timeline);
      setSpikeData(spikesResult.spikes);
      setInsightsData(insightsResult);
      setKeywordsData(keywordsResult.keywords);

      setLoading(false);
      setIsRefreshing(false);

      // Show toast notification if not initial load
      if (!isInitialLoad) {
        // Play notification sound using Web Audio API
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);

          // Second tone for pleasant sound
          setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 1000;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.3);
          }, 100);
        } catch (error) {
          console.log('Audio notification not available');
        }

        setShowUpdateToast(true);
        setTimeout(() => {
          setShowUpdateToast(false);
        }, 10000);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  if (!brand) return null;

  const today = new Date();
  const dayNum = today.getDate();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = today.toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      {/* Top Bar */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }} 
            whileTap={{ scale: 0.9 }} 
            onClick={() => router.push('/')}
            className="p-2 sm:p-3 bg-white hover:bg-orange-50 rounded-2xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
          </motion.button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm overflow-hidden">
              <img 
                src={`https://logo.clearbit.com/${brand.toLowerCase()}.com`} 
                alt={brand}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${brand}&background=f97316&color=fff&bold=true&size=128`;
                }}
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">{brand}</h1>
              <p className="text-xs sm:text-sm text-gray-500">Brand Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
          {/* Export Button with Dropdown */}
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-3 bg-white hover:bg-orange-50 rounded-2xl transition-all shadow-sm group"
              title="Export Dashboard Data"
            >
              <Download className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors" />
            </motion.button>

            {/* Export Dropdown Menu */}
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-2">
                    <button
                      onClick={() => exportDashboardData('txt')}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 rounded-xl transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <span className="text-sm font-bold text-blue-600">TXT</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Text File</div>
                        <div className="text-xs text-gray-500">Plain text report</div>
                      </div>
                    </button>
                    <button
                      onClick={() => exportDashboardData('json')}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 rounded-xl transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <span className="text-sm font-bold text-green-600">JSON</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">JSON Data</div>
                        <div className="text-xs text-gray-500">Structured data</div>
                      </div>
                    </button>
                    <button
                      onClick={() => exportDashboardData('pdf')}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 rounded-xl transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <span className="text-sm font-bold text-red-600">PDF</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">PDF Report</div>
                        <div className="text-xs text-gray-500">Formatted document</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => loadDashboardData(false)}
            className="p-3 bg-white hover:bg-orange-50 rounded-2xl transition-all shadow-sm group"
            title="Refresh Dashboard"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ 
                duration: 1, 
                repeat: isRefreshing ? Infinity : 0, 
                ease: "linear" 
              }}
            >
              <RefreshCw className={`w-6 h-6 ${isRefreshing ? 'text-orange-600' : 'text-gray-600 group-hover:text-orange-600'} transition-colors`} />
            </motion.div>
          </motion.button>

          {/* Live Status Card */}
          <div className="hidden md:flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Live Tracking</p>
              <p className="text-xs text-gray-500">Auto-refresh: 2min</p>
            </div>
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-white hover:bg-orange-50 rounded-2xl transition-all shadow-sm relative"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {notifications.filter(n => !n.read).length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-xs font-bold text-white">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </motion.div>
              )}
            </motion.button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800">Notifications</h3>
                      <span className="text-xs text-gray-500">
                        {notifications.filter(n => !n.read).length} unread
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-orange-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'update' ? 'bg-blue-100' :
                            notification.type === 'spike' ? 'bg-orange-100' :
                            'bg-green-100'
                          }`}>
                            {notification.type === 'update' ? (
                              <RefreshCw className="w-4 h-4 text-blue-600" />
                            ) : notification.type === 'spike' ? (
                              <Zap className="w-4 h-4 text-orange-600" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 text-center">
                    <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Loading Text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3"
            >
              Analyzing {brand}
            </motion.h2>

            {/* Animated Dots */}
            <motion.div className="flex items-center justify-center gap-2 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-orange-500 rounded-full"
                />
              ))}
            </motion.div>

            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2 mb-8"
            >
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm text-gray-600"
              >
                🔍 Fetching mentions from Reddit, HN & News...
              </motion.p>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="text-sm text-gray-600"
              >
                🤖 Running AI sentiment analysis...
              </motion.p>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="text-sm text-gray-600"
              >
                📊 Clustering topics & generating insights...
              </motion.p>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-md mx-auto bg-orange-50 border border-orange-200 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">⚠️</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-orange-800 mb-1">
                    AI-Powered Analysis
                  </p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Results are generated using local AI models and may contain minor inaccuracies. 
                    Data is aggregated from public sources for analytical purposes.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Column - 8 cols on desktop, full width on mobile */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            {/* Date & Quick Action Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <DateCard dayNum={dayNum} dayName={dayName} monthName={monthName} />
              <RefreshCard onRefresh={() => loadDashboardData(false)} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <MetricCard
                title="Total Mentions"
                value={mentions.length}
                subtitle="All platforms"
                icon={<MessageSquare className="w-5 h-5" />}
                trend={`${mentions.filter(m => m.platform === 'reddit').length} Reddit`}
                index={0}
              />
              <MetricCard
                title="Positive"
                value={sentimentData ? `${sentimentData.positivePercent}%` : '0%'}
                subtitle="Sentiment"
                icon={<Smile className="w-5 h-5" />}
                trend={sentimentData ? `${sentimentData.positive} mentions` : '0'}
                index={1}
              />
              <MetricCard
                title="Live Alerts"
                value={spikeData.length}
                subtitle="Active spikes"
                icon={<Zap className="w-5 h-5" />}
                trend={spikeData.length > 0 ? 'Action needed' : 'All clear'}
                index={2}
              />
              <MetricCard
                title="Clusters"
                value={clusterData ? Object.keys(clusterData).length : 0}
                subtitle="Topics"
                icon={<BarChart3 className="w-5 h-5" />}
                trend="AI categorized"
                index={3}
              />
            </div>

            {/* Timeline Chart */}
            <ScrollAnimatedCard delay={0}>
              <TimelineCard timelineData={timelineData} />
            </ScrollAnimatedCard>

            {/* Topic Clusters */}
            <ScrollAnimatedCard delay={0.1}>
              <TopicClustersCard clusterData={clusterData} />
            </ScrollAnimatedCard>

            {/* AI Insights */}
            <ScrollAnimatedCard delay={0.2}>
              <AIInsightsCard insightsData={insightsData} />
            </ScrollAnimatedCard>

            {/* Live Mentions Feed */}
            <ScrollAnimatedCard delay={0.3}>
              <LiveMentionsFeedCard mentions={mentions} />
            </ScrollAnimatedCard>
          </div>

          {/* Right Column - 4 cols on desktop, full width on mobile */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            <ScrollAnimatedCard delay={0} direction="right">
              <HelpCard />
            </ScrollAnimatedCard>
            <ScrollAnimatedCard delay={0.1} direction="right">
              <SentimentCard sentimentData={sentimentData} />
            </ScrollAnimatedCard>
            <ScrollAnimatedCard delay={0.1} direction="right">
              <LiveAlertsCard spikeData={spikeData} />
            </ScrollAnimatedCard>
            <ScrollAnimatedCard delay={0.1} direction="right">
              <RealTimeActivityCard mentions={mentions} />
            </ScrollAnimatedCard>
            <ScrollAnimatedCard delay={0.1} direction="right">
              <PlatformDistributionCard mentions={mentions} />
            </ScrollAnimatedCard>
            <ScrollAnimatedCard delay={0.1} direction="right">
              <QuickStatsCard 
                mentions={mentions} 
                sentimentData={sentimentData} 
                clusterData={clusterData} 
              />
            </ScrollAnimatedCard>
            <ScrollAnimatedCard delay={0.1} direction="right">
              <TrendingKeywordsCard keywordsData={keywordsData} />
            </ScrollAnimatedCard>
          </div>
        </div>
      )}

      {/* Update Toast Notification */}
      <AnimatePresence>
        {showUpdateToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, x: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-4 right-4 sm:top-8 sm:right-8 z-50 max-w-[90vw] sm:max-w-md"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 10px 40px rgba(251, 146, 60, 0.3)",
                  "0 10px 60px rgba(251, 146, 60, 0.5)",
                  "0 10px 40px rgba(251, 146, 60, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-white rounded-2xl p-5 shadow-2xl border-2 border-orange-200 min-w-[320px] max-w-[400px]"
            >
              <div className="flex items-start gap-4">
                {/* Animated Icon */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h4 className="font-bold text-gray-800">Dashboard Updated!</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Fresh data loaded successfully</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span>{mentions.length} mentions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Just now</span>
                    </div>
                  </div>
                </div>
                
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUpdateToast(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-4"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refreshing Indicator */}
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-orange-200 flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">Updating...</span>
          </div>
        </motion.div>
      )}

    </div>
  );
}
