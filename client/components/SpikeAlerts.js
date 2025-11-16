import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Zap, AlertCircle } from 'lucide-react';

export default function SpikeAlerts({ spikes }) {
  if (!spikes || spikes.length === 0) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-100">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">All Clear</p>
            <p className="text-xs text-gray-400 mt-1">No spikes detected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {spikes.map((spike, index) => (
          <SpikeAlert key={index} spike={spike} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SpikeAlert({ spike, index }) {
  const isNegative = spike.type === 'negative';
  const isPositive = spike.type === 'positive';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ x: 5, scale: 1.02 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
          isNegative ? 'bg-gradient-to-br from-red-500 to-red-600' :
          isPositive ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
          'bg-gradient-to-br from-orange-400 to-orange-500'
        }`}>
          {isNegative ? <TrendingDown className="w-6 h-6 text-white" /> :
           isPositive ? <TrendingUp className="w-6 h-6 text-white" /> :
           <Zap className="w-6 h-6 text-white" />}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isNegative ? 'bg-red-100 text-red-700' :
              isPositive ? 'bg-orange-100 text-orange-700' :
              'bg-orange-50 text-orange-600'
            }`}>
              {spike.type.toUpperCase()}
            </span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isNegative ? 'bg-red-500' : 'bg-orange-500'
              }`}></div>
              <span className="text-xs font-semibold text-gray-500">Live</span>
            </div>
          </div>
          
          <p className="text-sm font-semibold text-gray-800 mb-2">
            {spike.message}
          </p>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="text-gray-500">Increase</div>
                <div className={`font-bold ${
                  isNegative ? 'text-red-600' : 'text-orange-600'
                }`}>+{spike.increase}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-gray-500">Current</div>
                <div className="font-bold text-gray-800">{spike.current}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alert Badge */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isNegative ? 'bg-red-100' : 'bg-orange-100'
            }`}
          >
            <AlertCircle className={`w-5 h-5 ${
              isNegative ? 'text-red-600' : 'text-orange-600'
            }`} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
