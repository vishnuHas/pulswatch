import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import MentionTimeline from '../MentionTimeline';

export default function TimelineCard({ timelineData }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3 }} 
      className="bg-white rounded-3xl p-8 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Mentions Over Time</h3>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full"
        >
          <Radio className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-semibold text-orange-600">Live</span>
        </motion.div>
      </div>
      <MentionTimeline timeline={timelineData} />
    </motion.div>
  );
}
