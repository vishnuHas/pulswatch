import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function RealTimeActivityCard({ mentions }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: 0.2 }} 
      className="bg-white rounded-3xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">Real-time</span>
        <Activity className="w-5 h-5 text-orange-500" />
      </div>
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
          <circle 
            cx="64" 
            cy="64" 
            r="56" 
            stroke="#f97316" 
            strokeWidth="12" 
            fill="none" 
            strokeDasharray="352" 
            strokeDashoffset={352 - (352 * (mentions.length % 100) / 100)} 
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-3xl font-bold">{mentions.length % 100}</div>
          <div className="text-xs text-gray-500">Live now</div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500">
        <div className="w-2 h-2 bg-orange-500 rounded-full inline-block animate-pulse mr-2"></div>
        Tracking mentions
      </div>
    </motion.div>
  );
}
