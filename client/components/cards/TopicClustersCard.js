import { motion } from 'framer-motion';
import TopicClusters from '../TopicClusters';

export default function TopicClustersCard({ clusterData }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.4 }} 
      className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm"
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Topic Clusters</h3>
      <TopicClusters clusters={clusterData} />
    </motion.div>
  );
}
