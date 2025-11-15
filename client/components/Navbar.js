import { useRouter } from 'next/router';
import { Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Material Design */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div className="relative">
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                PulseWatch
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">AI Brand Tracker</span>
            </div>
          </motion.div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Material Actions */}
          <div className="flex items-center gap-3">
            {/* AI Badge */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full border border-orange-200"
            >
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-orange-700">Local AI</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
