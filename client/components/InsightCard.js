import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, Minus, Brain, Sparkles, Tag } from 'lucide-react';

export default function InsightCard({ insights }) {
  if (!insights) {
    return <ShimmerLoader />;
  }

  const getTrendIcon = () => {
    if (insights.sentimentChange.includes('increasing positivity')) {
      return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />;
    } else if (insights.sentimentChange.includes('increasing negativity')) {
      return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
    }
    return <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (insights.sentimentChange.includes('increasing positivity')) {
      return 'text-orange-600';
    } else if (insights.sentimentChange.includes('increasing negativity')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <h4 className="font-bold text-gray-800 text-base sm:text-lg">AI-Generated Insight</h4>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
              </motion.div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-orange-100">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {insights.insight}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="truncate">Updated {new Date(insights.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              {getTrendIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">Sentiment Trend</div>
              <div className={`text-lg sm:text-xl font-bold ${getTrendColor()} truncate`}>
                {parseFloat(insights.changePercent) > 0 ? '+' : ''}{insights.changePercent}%
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-2">Top Keywords</div>
              <div className="flex flex-wrap gap-1.5">
                {insights.keywords?.slice(0, 3).map((keyword, index) => (
                  <span
                    key={index}
                    className="text-xs bg-orange-100 text-orange-700 px-2.5 sm:px-3 py-1 rounded-full font-semibold truncate max-w-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ShimmerLoader() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm animate-pulse">
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2 sm:w-1/3 mb-2"></div>
            <div className="h-20 sm:h-24 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="h-20 sm:h-24 bg-gray-200 rounded-2xl"></div>
        <div className="h-20 sm:h-24 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
}
