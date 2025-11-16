import { motion } from 'framer-motion';
import { MessageSquare, Hash, Newspaper } from 'lucide-react';

export default function PlatformDistributionCard({ mentions }) {
  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'reddit':
        return <MessageSquare className="w-4 h-4" />;
      case 'hackernews':
        return <Hash className="w-4 h-4" />;
      case 'news':
        return <Newspaper className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform) => {
    switch(platform) {
      case 'reddit':
        return { bg: 'bg-orange-100', text: 'text-orange-600', bar: 'bg-gradient-to-r from-orange-500 to-orange-600' };
      case 'hackernews':
        return { bg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-gradient-to-r from-blue-500 to-blue-600' };
      case 'news':
        return { bg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-gradient-to-r from-purple-500 to-purple-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-500' };
    }
  };

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
          const colors = getPlatformColor(platform);
          
          return (
            <div key={platform}>
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center ${colors.text}`}>
                    {getPlatformIcon(platform)}
                  </div>
                  <span className="capitalize font-semibold text-gray-700">
                    {platform === 'hackernews' ? 'Hacker News' : platform}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{count}</span>
                  <span className="font-bold text-gray-800">{percentage}%</span>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className={`h-full ${colors.bar} shadow-sm`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
