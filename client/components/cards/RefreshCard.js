import { motion } from 'framer-motion';
import { TrendingUp, Zap, Target, BarChart2 } from 'lucide-react';

export default function RefreshCard({ onRefresh }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.1 }} 
      className="col-span-2 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-500 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden"
    >
      {/* Animated background particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100],
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut"
          }}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${30 + i * 25}%`,
            bottom: 0
          }}
        />
      ))}

      {/* Animated glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
            >
              <BarChart2 className="w-5 h-5" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold">Smart Analytics Hub</h3>
              <p className="text-xs opacity-90">Intelligent Data Processing</p>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-white rounded-full"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
          >
            <TrendingUp className="w-5 h-5 mb-2" />
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-xs opacity-80">Monitoring</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
          >
            <Zap className="w-5 h-5 mb-2" />
            <div className="text-2xl font-bold">Live</div>
            <div className="text-xs opacity-80">Updates</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
          >
            <Target className="w-5 h-5 mb-2" />
            <div className="text-2xl font-bold">Smart</div>
            <div className="text-xs opacity-80">Analytics</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
