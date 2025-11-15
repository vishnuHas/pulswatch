import { motion } from 'framer-motion';
import LiveMentionFeed from '../LiveMentionFeed';

export default function LiveMentionsFeedCard({ mentions }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.6 }} 
      className="bg-white rounded-3xl p-8 shadow-sm"
    >
      <h3 className="text-2xl font-bold mb-6">Live Mentions Feed</h3>
      <LiveMentionFeed mentions={mentions} />
    </motion.div>
  );
}
