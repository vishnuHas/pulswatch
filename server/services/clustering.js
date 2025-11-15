const { kmeans } = require('ml-kmeans');
const { generateBatchEmbeddings } = require('./embeddings');
const { autoLabelCluster } = require('./localAI');

/**
 * Cluster labels based on common patterns
 */
const CLUSTER_LABELS = [
  'Complaints',
  'Praise',
  'Bugs & Issues',
  'Comparisons',
  'News & Updates',
  'Questions',
  'Feature Requests'
];

/**
 * Perform topic clustering using k-means on embeddings
 */
async function performTopicClustering(mentions, k = 4) {
  try {
    if (mentions.length < k) {
      k = Math.max(2, mentions.length);
    }

    console.log(`Clustering ${mentions.length} mentions into ${k} clusters...`);
    
    // Generate embeddings for all mentions
    const texts = mentions.map(m => m.text || m.title);
    const embeddings = await generateBatchEmbeddings(texts);
    
    // Perform k-means clustering
    const result = kmeans(embeddings, k, {
      initialization: 'kmeans++',
      maxIterations: 100
    });
    
    // Assign clusters to mentions
    const clusteredMentions = mentions.map((mention, idx) => ({
      ...mention,
      cluster: result.clusters[idx],
      clusterLabel: CLUSTER_LABELS[result.clusters[idx] % CLUSTER_LABELS.length]
    }));
    
    // Calculate cluster statistics
    const clusterStats = {};
    for (let i = 0; i < k; i++) {
      const clusterMentions = clusteredMentions.filter(m => m.cluster === i);
      const label = CLUSTER_LABELS[i % CLUSTER_LABELS.length];
      
      // Calculate sentiment distribution in cluster
      const sentiments = {
        positive: clusterMentions.filter(m => m.sentiment === 'Positive').length,
        neutral: clusterMentions.filter(m => m.sentiment === 'Neutral').length,
        negative: clusterMentions.filter(m => m.sentiment === 'Negative').length
      };
      
      clusterStats[i] = {
        id: i,
        label,
        count: clusterMentions.length,
        sentiments,
        examples: clusterMentions.slice(0, 3).map(m => m.title || m.text.substring(0, 100))
      };
    }
    
    return {
      mentions: clusteredMentions,
      clusters: clusterStats,
      k,
      centroids: result.centroids
    };
  } catch (error) {
    console.error('Clustering error:', error.message);
    // Fallback: assign random clusters
    return {
      mentions: mentions.map(m => ({
        ...m,
        cluster: Math.floor(Math.random() * k),
        clusterLabel: CLUSTER_LABELS[Math.floor(Math.random() * CLUSTER_LABELS.length)]
      })),
      clusters: {},
      k,
      error: error.message
    };
  }
}


module.exports = {
  performTopicClustering,
  autoLabelCluster
};
