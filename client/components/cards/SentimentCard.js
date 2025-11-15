import { motion } from 'framer-motion';
import SentimentPieChart from '../SentimentPieChart';

export default function SentimentCard({ sentimentData }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: 0.1 }} 
      className="bg-white rounded-3xl p-6 shadow-sm"
    >
      <h3 className="text-xl font-bold mb-4">Sentiment Analysis</h3>
      <SentimentPieChart stats={sentimentData} />
    </motion.div>
  );
}
