import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SentimentPieChart({ stats }) {
  if (!stats) {
    return <ShimmerLoader />;
  }

  // Don't use chart - we'll create custom circular design
  const total = stats.positive + stats.neutral + stats.negative;
  const positivePercent = (stats.positive / total) * 100;
  const neutralPercent = (stats.neutral / total) * 100;
  const negativePercent = (stats.negative / total) * 100;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} mentions (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeInOutQuart',
    },
  };

  const sentimentScore = stats.positivePercent - stats.negativePercent;
  const dominantSentiment = stats.positivePercent > stats.negativePercent ? 'positive' : 
                           stats.negativePercent > stats.positivePercent ? 'negative' : 'neutral';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="relative bg-white rounded-3xl p-6 overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Circular Progress - Like Real-time Section */}
      <div className="relative z-10 mb-6">
        <div className="relative w-40 h-40 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="14" fill="none" />
            
            {/* Calculate circumference and arc lengths */}
            {(() => {
              const circumference = 440; // 2 * PI * radius (2 * 3.14159 * 70)
              const positiveLength = (circumference * positivePercent) / 100;
              const neutralLength = (circumference * neutralPercent) / 100;
              const negativeLength = (circumference * negativePercent) / 100;
              
              return (
                <>
                  {/* Positive arc - Orange */}
                  <motion.circle 
                    cx="80" 
                    cy="80" 
                    r="70" 
                    stroke="#f97316" 
                    strokeWidth="14" 
                    fill="none" 
                    strokeDasharray={`${positiveLength} ${circumference - positiveLength}`}
                    strokeDashoffset={0}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray: `${positiveLength} ${circumference - positiveLength}` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.4))' }}
                  />
                  
                  {/* Neutral arc - Gray/Silver */}
                  <motion.circle 
                    cx="80" 
                    cy="80" 
                    r="70" 
                    stroke="#94a3b8" 
                    strokeWidth="14" 
                    fill="none" 
                    strokeDasharray={`${neutralLength} ${circumference - neutralLength}`}
                    strokeDashoffset={-positiveLength}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray: `${neutralLength} ${circumference - neutralLength}` }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(148, 163, 184, 0.4))' }}
                  />
                  
                  {/* Negative arc - Red */}
                  <motion.circle 
                    cx="80" 
                    cy="80" 
                    r="70" 
                    stroke="#ef4444" 
                    strokeWidth="14" 
                    fill="none" 
                    strokeDasharray={`${negativeLength} ${circumference - negativeLength}`}
                    strokeDashoffset={-(positiveLength + neutralLength)}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray: `${negativeLength} ${circumference - negativeLength}` }}
                    transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))' }}
                  />
                </>
              );
            })()}
          </svg>
          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-center"
            >
              <div>
                <span className={`font-black ${
                  stats.positivePercent > stats.negativePercent && stats.positivePercent > stats.neutralPercent ? 'text-3xl text-orange-600' :
                  stats.negativePercent > stats.positivePercent && stats.negativePercent > stats.neutralPercent ? 'text-2xl text-red-600' :
                  'text-3xl text-gray-600'
                }`}>
                  {stats.positivePercent > stats.negativePercent && stats.positivePercent > stats.neutralPercent ? 'Positive' :
                   stats.negativePercent > stats.positivePercent && stats.negativePercent > stats.neutralPercent ? 'Negative' :
                   'Neutral'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Cards */}
      <div className="relative z-10 grid grid-cols-3 gap-4 mb-6">
        <SentimentStatCard
          icon={<Smile className="w-5 h-5" />}
          label="Positive"
          value={stats.positive}
          percentage={stats.positivePercent}
          color="emerald"
          delay={0.2}
        />
        <SentimentStatCard
          icon={<Meh className="w-5 h-5" />}
          label="Neutral"
          value={stats.neutral}
          percentage={stats.neutralPercent}
          color="slate"
          delay={0.3}
        />
        <SentimentStatCard
          icon={<Frown className="w-5 h-5" />}
          label="Negative"
          value={stats.negative}
          percentage={stats.negativePercent}
          color="red"
          delay={0.4}
        />
      </div>

      {/* Total Mentions Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-600">Total Mentions:</span>
          <span className="text-lg font-bold text-blue-600">{stats.total.toLocaleString()}</span>
        </div>
      </motion.div>

      {/* Trend Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 mt-4 flex items-center justify-center gap-2 text-sm"
      >
        {dominantSentiment === 'positive' ? (
          <>
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-orange-600 font-semibold">Trending Positive</span>
          </>
        ) : dominantSentiment === 'negative' ? (
          <>
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-red-600 font-semibold">Trending Negative</span>
          </>
        ) : (
          <>
            <Minus className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600 font-semibold">Balanced Sentiment</span>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// Sentiment Stat Card Component
function SentimentStatCard({ icon, label, value, percentage, color, delay }) {
  const colorClasses = {
    emerald: {
      bg: 'from-orange-500 to-orange-600',
      text: 'text-orange-600',
      bgLight: 'bg-orange-50',
      border: 'border-orange-200',
    },
    slate: {
      bg: 'from-gray-400 to-gray-500',
      text: 'text-gray-600',
      bgLight: 'bg-gray-50',
      border: 'border-gray-200',
    },
    red: {
      bg: 'from-red-500 to-red-600',
      text: 'text-red-600',
      bgLight: 'bg-red-50',
      border: 'border-red-200',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`${colors.bgLight} ${colors.border} border rounded-2xl p-4 text-center`}
    >
      <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-xl mb-3 shadow-lg`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className={`text-2xl font-black ${colors.text} mb-1`}>
        {percentage}%
      </div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-sm text-gray-600">
        {value.toLocaleString()}
      </div>
    </motion.div>
  );
}

function ShimmerLoader() {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-xl w-1/2 mb-8"></div>
      <div className="h-80 bg-gray-200 rounded-2xl mb-6"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
}
