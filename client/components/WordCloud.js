import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function WordCloud({ keywords }) {
  const [wordData, setWordData] = useState([]);

  useEffect(() => {
    if (keywords && keywords.length > 0) {
      // Create word data with varying sizes
      const data = keywords.map((word, index) => ({
        text: word,
        size: 40 - (index * 2), // Decreasing size
        color: getRandomColor(),
      }));
      setWordData(data);
    }
  }, [keywords]);

  if (!keywords || keywords.length === 0) {
    return <ShimmerLoader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Mentions</h3>
      
      <div className="flex flex-wrap gap-3 justify-center items-center min-h-[200px] p-4">
        {wordData.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            style={{
              fontSize: `${word.size}px`,
              color: word.color,
            }}
            className="font-bold cursor-pointer hover:scale-110 transition-transform"
          >
            {word.text}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function getRandomColor() {
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function ShimmerLoader() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  );
}
