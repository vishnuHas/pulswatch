import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

export default function LiveMentionFeed({ mentions }) {
  if (!mentions || mentions.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No mentions yet
      </div>
    );
  }

  // Show only the latest 10 mentions
  const recentMentions = mentions.slice(0, 10);

  return (
    <div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <AnimatePresence>
          {recentMentions.map((mention, index) => (
            <MentionItem key={mention.id} mention={mention} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MentionItem({ mention, index }) {
  const getSentimentIcon = () => {
    switch (mention.sentiment?.toLowerCase()) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-orange-600" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSentimentColor = () => {
    switch (mention.sentiment?.toLowerCase()) {
      case 'positive':
        return 'border-l-orange-500 bg-orange-50';
      case 'negative':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getPlatformBadge = () => {
    const badges = {
      reddit: 'bg-orange-100 text-orange-800',
      hackernews: 'bg-orange-100 text-orange-800',
      news: 'bg-blue-100 text-blue-800',
    };
    return badges[mention.platform] || 'bg-gray-100 text-gray-800';
  };

  const timeAgo = getTimeAgo(mention.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border-l-4 ${getSentimentColor()} rounded-lg p-4 hover:shadow-md transition-shadow overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {getSentimentIcon()}
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getPlatformBadge()}`}>
              {mention.platform}
            </span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          
          <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2 break-words">
            {mention.title}
          </h4>
          
          {mention.text && mention.text !== mention.title && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2 break-words">
              {mention.text}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            {mention.author && (
              <span className="truncate max-w-[150px]">by {mention.author}</span>
            )}
            {mention.score !== undefined && (
              <span>⬆ {mention.score}</span>
            )}
            {mention.commentCount !== undefined && (
              <span>💬 {mention.commentCount}</span>
            )}
          </div>
        </div>
        
        {mention.url && (
          <a
            href={mention.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
