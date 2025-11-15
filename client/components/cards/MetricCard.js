import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

function AnimatedValue({ value, isInView }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Check if value has percentage
  const isPercentage = typeof value === 'string' && value.includes('%');
  const numericValue = isPercentage ? parseInt(value) : value;

  useEffect(() => {
    if (!isInView || hasAnimated) {
      if (hasAnimated) setCount(numericValue);
      return;
    }

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1500, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * numericValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(numericValue);
        setHasAnimated(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, hasAnimated, isInView]);

  if (isPercentage) {
    return <>{count}%</>;
  }
  return <>{count}</>;
}

export default function MetricCard({ title, value, subtitle, icon, trend, index = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.15)" }}
      className="bg-white rounded-3xl p-6 shadow-sm relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 0.05, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-400"
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
            className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500"
          >
            {icon}
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="text-orange-500 text-sm font-semibold"
          >
            {trend}
          </motion.span>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="text-sm text-gray-500 mb-1"
        >
          {title}
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
          className="text-3xl font-bold mb-1"
        >
          <AnimatedValue value={value} isInView={isInView} />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="text-xs text-gray-400"
        >
          {subtitle}
        </motion.div>
      </div>
    </motion.div>
  );
}
