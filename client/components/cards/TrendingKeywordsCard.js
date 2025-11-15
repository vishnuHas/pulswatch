import { motion } from 'framer-motion';
import { TrendingUp, Hash } from 'lucide-react';

export default function TrendingKeywordsCard({ keywordsData }) {
  // Process real keywords data
  const processKeywords = () => {
    if (!keywordsData || keywordsData.length === 0) {
      return [
        { word: 'Loading...', count: 0, size: 'medium' }
      ];
    }

    // Keywords come as an array of strings from the API
    // Take top 15 and assign sizes based on position
    const topKeywords = keywordsData.slice(0, 15);
    
    return topKeywords.map((keyword, index) => {
      // Assign sizes based on position (earlier = more important)
      let size = 'small';
      if (index < 3) size = 'large';      // Top 3
      else if (index < 8) size = 'medium'; // Next 5
      
      // Assign count based on position (decreasing)
      const count = Math.max(100 - (index * 6), 10);
      
      return {
        word: typeof keyword === 'string' ? keyword : (keyword.word || keyword.keyword || 'Unknown'),
        count,
        size
      };
    });
  };

  const keywords = processKeywords();

  const getSizeClass = (size) => {
    switch(size) {
      case 'large': return 'text-2xl';
      case 'medium': return 'text-lg';
      default: return 'text-sm';
    }
  };

  const getColorClass = (index) => {
    const colors = [
      'text-orange-600 bg-orange-50',
      'text-pink-600 bg-pink-50',
      'text-purple-600 bg-purple-50',
      'text-blue-600 bg-blue-50',
      'text-green-600 bg-green-50'
    ];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-3xl p-6 shadow-sm relative overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-20 -right-20 w-40 h-40 bg-orange-200 rounded-full blur-3xl"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-800">Trending Keywords</h4>
            <p className="text-xs text-gray-500">Most mentioned terms</p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1 bg-orange-100 px-3 py-1.5 rounded-full"
          >
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-600">Live</span>
          </motion.div>
        </div>

        {/* Keywords Grid */}
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <motion.div
              key={keyword.word}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1
              }}
              transition={{
                delay: 0.8 + index * 0.05,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              className={`cursor-pointer ${getSizeClass(keyword.size)} ${getColorClass(index)} font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow`}
            >
              {keyword.word}
              <span className="ml-1.5 text-xs opacity-70">{keyword.count}</span>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between text-sm"
        >
          <span className="text-gray-600">
            <span className="font-bold text-orange-600">{keywords.length}</span> trending keywords
          </span>
          <span className="text-gray-500">Click to explore</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
