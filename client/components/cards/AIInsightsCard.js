import { motion } from 'framer-motion';
import InsightCard from '../InsightCard';

export default function AIInsightsCard({ insightsData }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.5 }} 
      className="bg-white rounded-3xl p-8 shadow-sm"
    >
      <h3 className="text-2xl font-bold mb-6">AI Insights</h3>
      <InsightCard insights={insightsData} />
    </motion.div>
  );
}
