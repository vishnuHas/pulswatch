import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MessageSquare, Smile, Target, TrendingUp, ArrowUpRight, Sparkles } from 'lucide-react';

export default function QuickStatsCard({ mentions, sentimentData, clusterData }) {
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation on data change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [mentions.length, sentimentData?.positivePercent, clusterData?.length]);

  const stats = [
    { 
      label: 'Total Mentions', 
      value: mentions.length,
      displayValue: mentions.length,
      change: '+12%',
      color: 'from-orange-400 to-orange-600',
      icon: MessageSquare 
    },
    { 
      label: 'Positive Rate', 
      value: sentimentData?.positivePercent || 0,
      displayValue: `${sentimentData?.positivePercent || 0}%`,
      change: '+8%',
      color: 'from-orange-500 to-pink-500',
      icon: Smile 
    },
    { 
      label: 'Active Topics', 
      value: clusterData?.length || 0,
      displayValue: clusterData?.length || 0,
      change: '+5%',
      color: 'from-pink-400 to-pink-600',
      icon: Target 
    }
  ];

  const maxValue = Math.max(...stats.map(s => s.value), 100);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: 0.4 }} 
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
            <h3 className="text-xl font-bold text-gray-800">Overview</h3>
            <p className="text-sm text-gray-500">Key Metrics</p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-orange-500 rounded-full"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const heightPercent = (stat.value / maxValue) * 100;
            return (
              <motion.div
                key={`${stat.label}-${animationKey}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                {/* Value */}
                <div className="text-center mb-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                    className="text-3xl font-bold text-gray-800 mb-1"
                  >
                    {stat.displayValue}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center justify-center gap-1 text-green-600"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-semibold">{stat.change}</span>
                  </motion.div>
                </div>

                {/* Column Bar */}
                <div className="relative h-40 flex items-end justify-center mb-4">
                  <div className="w-8 h-full relative">
                    <motion.div
                      key={`bar-${stat.label}-${animationKey}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${heightPercent}%`, opacity: 1 }}
                      transition={{ 
                        duration: 1.2, 
                        delay: 0.6 + index * 0.15,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="absolute bottom-0 left-0 right-0 bg-orange-500 rounded-full shadow-lg"
                      style={{
                        boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                      }}
                    >
                      {/* Glow effect */}
                      <motion.div
                        animate={{
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Icon and Label */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 text-center">{stat.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </motion.div>
  );
}
