import { motion } from 'framer-motion';

export default function PlatformDistributionCard({ mentions }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: 0.3 }} 
      className="bg-white rounded-3xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold">Platform Split</h4>
          <p className="text-xs text-gray-500">Source distribution</p>
        </div>
        <span className="text-orange-500 font-semibold">Live</span>
      </div>
      <div className="space-y-3">
        {['reddit', 'hackernews', 'news'].map((platform, i) => {
          const count = mentions.filter(m => m.platform === platform).length;
          const percentage = mentions.length > 0 ? (count / mentions.length * 100).toFixed(0) : 0;
          return (
            <div key={platform}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="capitalize text-gray-600">
                  {platform === 'hackernews' ? 'Hacker News' : platform}
                </span>
                <span className="font-bold">{percentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className={`h-full ${
                    platform === 'reddit' ? 'bg-orange-500' :
                    platform === 'hackernews' ? 'bg-orange-400' :
                    'bg-orange-300'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
