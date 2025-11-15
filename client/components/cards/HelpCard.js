import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function HelpCard() {
  const metrics = [
    { label: 'Brand Score', value: 94, change: '+12', trend: 'up', max: 100 },
    { label: 'Sentiment', value: 87, change: '+8', trend: 'up', max: 100 },
    { label: 'Engagement', value: 76, change: '-3', trend: 'down', max: 100 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Brand Health</h3>
          <p className="text-sm text-gray-500">Real-time metrics</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center"
        >
          <TrendingUp className="w-5 h-5 text-orange-600" />
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{metric.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">{metric.value}</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  metric.trend === 'up' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs font-semibold ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  metric.value >= 85 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  metric.value >= 70 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-6 border-t border-gray-100"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Overall Health</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05, type: "spring" }}
                  className={`w-2 h-2 rounded-full ${
                    i < 4 ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-orange-600">Very Good</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
