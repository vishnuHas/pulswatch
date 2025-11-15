/**
 * Quick test to verify clustering works
 */

const { kmeans } = require('ml-kmeans');

// Test data: simple 2D points
const data = [
  [1, 1], [1.5, 2], [3, 4], [5, 7], [3.5, 5], [4.5, 5], [3.5, 4.5]
];

console.log('Testing kmeans clustering...');

try {
  const result = kmeans(data, 2, {
    initialization: 'kmeans++',
    maxIterations: 100
  });
  
  console.log('✅ Clustering successful!');
  console.log('Clusters:', result.clusters);
  console.log('Centroids:', result.centroids);
} catch (error) {
  console.log('❌ Clustering failed:', error.message);
}
