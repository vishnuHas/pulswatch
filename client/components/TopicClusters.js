import { motion } from 'framer-motion';
import { Layers, TrendingUp, Users, MessageCircle } from 'lucide-react';

export default function TopicClusters({ clusters }) {
  // Handle both array and object formats
  let clusterArray = [];
  
  if (!clusters) {
    return <ShimmerLoader />;
  }
  
  if (Array.isArray(clusters)) {
    clusterArray = clusters;
  } else if (typeof clusters === 'object') {
    clusterArray = Object.values(clusters);
  }
  
  if (clusterArray.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No topic clusters found yet.</p>
        <p className="text-sm mt-2">Clusters will appear as more data is collected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {clusterArray.map((cluster, index) => (
        <ClusterCard key={cluster.id || index} cluster={cluster} index={index} />
      ))}
    </div>
  );
}

function ClusterCard({ cluster, index }) {
  // Calculate dominant sentiment
  const { positive = 0, neutral = 0, negative = 0 } = cluster.sentiments || {};
  const total = positive + neutral + negative;
  const positivePercent = total > 0 ? ((positive / total) * 100).toFixed(0) : 0;
  const dominantSentiment = 
    positive > negative && positive > neutral ? 'Positive' :
    negative > positive && negative > neutral ? 'Negative' : 'Neutral';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ x: 5, scale: 1.02 }}
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 text-base sm:text-lg truncate">{cluster.label}</h4>
              <p className="text-xs sm:text-sm text-gray-500">{cluster.count} mentions</p>
            </div>
            {/* Progress Ring - Mobile position */}
            <div className="relative w-14 h-14 sm:hidden flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="#f3f4f6" strokeWidth="5" fill="none" />
                <motion.circle 
                  cx="28" 
                  cy="28" 
                  r="24" 
                  stroke="#f97316" 
                  strokeWidth="5" 
                  fill="none" 
                  strokeDasharray="151" 
                  strokeDashoffset={151 - (151 * positivePercent / 100)}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 151 }}
                  animate={{ strokeDashoffset: 151 - (151 * positivePercent / 100) }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-orange-600">{positivePercent}%</span>
              </div>
            </div>
          </div>
          
          {cluster.examples && cluster.examples.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-2.5 sm:p-3 mb-3">
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 italic">
                "{cluster.examples[0]}"
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Sentiment</div>
                <div className="text-xs sm:text-sm font-semibold text-orange-600">{positivePercent}% Positive</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Volume</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-800">{cluster.count}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Ring - Desktop position */}
        <div className="relative w-16 h-16 hidden sm:block flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="#f3f4f6" strokeWidth="6" fill="none" />
            <motion.circle 
              cx="32" 
              cy="32" 
              r="28" 
              stroke="#f97316" 
              strokeWidth="6" 
              fill="none" 
              strokeDasharray="176" 
              strokeDashoffset={176 - (176 * positivePercent / 100)}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 176 }}
              animate={{ strokeDashoffset: 176 - (176 * positivePercent / 100) }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-orange-600">{positivePercent}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ShimmerLoader() {
  return (
    <div className="space-y-3 sm:space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm animate-pulse">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2 sm:w-1/3 mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 sm:w-1/4"></div>
            </div>
          </div>
          <div className="h-12 sm:h-16 bg-gray-200 rounded-xl mb-3"></div>
          <div className="flex gap-3 sm:gap-4">
            <div className="h-10 sm:h-12 bg-gray-200 rounded-lg flex-1"></div>
            <div className="h-10 sm:h-12 bg-gray-200 rounded-lg flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
