import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DateCard({ dayNum, dayName, monthName }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate angles for clock hands
  const secondAngle = (currentTime.getSeconds() / 60) * 360;
  const minuteAngle = (currentTime.getMinutes() / 60) * 360 + (currentTime.getSeconds() / 60) * 6;
  const hourAngle = ((currentTime.getHours() % 12) / 12) * 360 + (currentTime.getMinutes() / 60) * 30;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white rounded-3xl p-6 shadow-sm relative overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl"
      />
      
      <div className="relative z-10 flex items-center justify-between">
        {/* Left side - Date */}
        <div className="flex-1">
          <div className="text-5xl font-bold mb-2 text-gray-800">{dayNum}</div>
          <div className="text-base text-gray-600">{dayName}, {monthName}</div>
        </div>

        {/* Right side - Modern Analog Clock */}
        <div className="relative w-28 h-28">
          {/* Outer ring with gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-1 shadow-xl">
            {/* Inner clock face */}
            <div className="w-full h-full rounded-full bg-white relative shadow-inner">
              
              {/* Hour numbers */}
              {[12, 3, 6, 9].map((num, i) => {
                const angle = (num === 12 ? 0 : num === 3 ? 90 : num === 6 ? 180 : 270);
                const radius = 38;
                const x = 50 + radius * Math.sin((angle * Math.PI) / 180);
                const y = 50 - radius * Math.cos((angle * Math.PI) / 180);
                return (
                  <div
                    key={num}
                    className="absolute text-xs font-bold text-gray-700"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {num}
                  </div>
                );
              })}
              
              
              {/* Clock hands container */}
              <div className="absolute inset-0">
                {/* Hour hand */}
                <motion.div
                  className="absolute top-1/2 left-1/2 origin-bottom"
                  style={{
                    transform: `translateX(-50%) translateY(-50%) rotate(${hourAngle}deg)`
                  }}
                  animate={{ rotate: hourAngle }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="w-1.5 h-8 bg-gradient-to-b from-gray-800 to-gray-600 rounded-full shadow-lg" 
                       style={{ marginTop: '-32px' }} />
                </motion.div>
                
                {/* Minute hand */}
                <motion.div
                  className="absolute top-1/2 left-1/2 origin-bottom"
                  style={{
                    transform: `translateX(-50%) translateY(-50%) rotate(${minuteAngle}deg)`
                  }}
                  animate={{ rotate: minuteAngle }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="w-1 h-11 bg-gradient-to-b from-gray-700 to-gray-500 rounded-full shadow-lg" 
                       style={{ marginTop: '-44px' }} />
                </motion.div>
                
                {/* Second hand */}
                <motion.div
                  className="absolute top-1/2 left-1/2 origin-bottom"
                  style={{
                    transform: `translateX(-50%) translateY(-50%) rotate(${secondAngle}deg)`
                  }}
                  animate={{ rotate: secondAngle }}
                  transition={{ duration: 0.3, ease: "linear" }}
                >
                  <div className="relative">
                    {/* Second hand tail */}
                    <div className="absolute w-0.5 h-3 bg-orange-500 rounded-full" 
                         style={{ top: '0px', left: '50%', transform: 'translateX(-50%)' }} />
                    {/* Second hand main */}
                    <div className="w-0.5 h-12 bg-orange-500 rounded-full shadow-lg" 
                         style={{ marginTop: '-48px' }} />
                  </div>
                </motion.div>
              </div>
              
              {/* Center cap with layers */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              
              {/* Subtle inner shadow for depth */}
              <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" 
                   style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }} />
            </div>
          </div>
          
          {/* Outer glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px rgba(251, 146, 60, 0.3)',
                '0 0 30px rgba(251, 146, 60, 0.5)',
                '0 0 20px rgba(251, 146, 60, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
