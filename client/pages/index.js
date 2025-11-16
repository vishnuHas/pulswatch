import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Zap, Shield, BarChart, Sparkles, Activity, Brain, Eye, X } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showBrandWarning, setShowBrandWarning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show welcome popup after a short delay
    const showTimer = setTimeout(() => {
      setShowWelcomePopup(true);
    }, 500);

    // Auto-hide after 12 seconds
    const hideTimer = setTimeout(() => {
      setShowWelcomePopup(false);
    }, 12500); // 500ms show delay + 12000ms display = 12.5s total

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const popularBrands = ['OpenAI', 'Tesla', 'Apple', 'Google', 'Microsoft', 'Amazon'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const brandName = searchQuery.trim();
      const isPopularBrand = popularBrands.some(
        brand => brand.toLowerCase() === brandName.toLowerCase()
      );

      if (!isPopularBrand) {
        setShowBrandWarning(true);
        setTimeout(() => setShowBrandWarning(false), 5000);
        return;
      }

      router.push(`/dashboard/${encodeURIComponent(brandName)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50 via-white to-pink-50"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-yellow-200/30 rounded-full blur-3xl"
        />
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent px-4"
          >
            PulseWatch
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6 px-4"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-700">
              100% Local AI • Zero Cost • Unlimited
            </p>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Track real-time brand mentions from <span className="font-semibold text-orange-600">Reddit</span>,{' '}
            <span className="font-semibold text-orange-500">Hacker News</span>, and{' '}
            <span className="font-semibold text-blue-600">Google News</span>.
            Powered by local AI models for sentiment analysis, topic clustering, and actionable insights.
          </motion.p>

          {/* Material Design Search Box */}
          <motion.form
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-full shadow-2xl border border-orange-100 hover:shadow-3xl transition-all duration-300">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any brand..."
                  className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 pl-12 sm:pl-14 md:pl-16 pr-28 sm:pr-32 md:pr-36 text-sm sm:text-base md:text-lg rounded-full focus:outline-none text-gray-800 placeholder-gray-400"
                />
                <Search className="absolute left-4 sm:left-5 md:left-6 top-3 sm:top-4 md:top-6 w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-orange-600 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
                >
                  <span className="hidden sm:inline">Track Now</span>
                  <span className="sm:hidden">Track</span>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* Popular Brands - Material Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 md:mb-16 px-4"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center mb-2 sm:mb-0">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              Popular:
            </span>
            {popularBrands.map((brand, index) => (
              <motion.button
                key={brand}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/dashboard/${brand}`)}
                className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-white rounded-full text-xs sm:text-sm font-semibold text-gray-700 hover:text-orange-600 transition-all shadow-md hover:shadow-xl border border-gray-200 hover:border-orange-300"
              >
                {brand}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Features - Material Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20"
        >
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10" />}
            title="Real-Time Tracking"
            description="Monitor brand mentions across Reddit, Hacker News, and Google News"
            color="from-orange-500 to-orange-600"
            delay={0}
          />
          <FeatureCard
            icon={<Brain className="w-10 h-10" />}
            title="Local AI Analysis"
            description="100% offline sentiment analysis using DistilBERT - no API costs"
            color="from-orange-600 to-pink-500"
            delay={0.1}
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10" />}
            title="Spike Detection"
            description="Instant alerts when positive or negative sentiment spikes occur"
            color="from-pink-500 to-pink-600"
            delay={0.2}
          />
          <FeatureCard
            icon={<BarChart className="w-10 h-10" />}
            title="Topic Clustering"
            description="Auto-group mentions using k-means clustering and embeddings"
            color="from-orange-400 to-orange-500"
            delay={0.3}
          />
        </motion.div>

        {/* Showcase Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="bg-gradient-to-br from-white to-orange-50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 mb-12 sm:mb-16 md:mb-20 border border-orange-100"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent px-4">
            Powerful Analytics Dashboard
          </h2>
          <p className="text-center text-gray-600 mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base md:text-lg px-4">Everything you need to track and analyze brand reputation</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <ShowcaseItem icon="🎯" title="Sentiment Tracking" desc="Real-time analysis" />
            <ShowcaseItem icon="📊" title="Visual Charts" desc="Beautiful graphs" />
            <ShowcaseItem icon="💡" title="AI Insights" desc="Smart recommendations" />
            <ShowcaseItem icon="🚀" title="Instant Alerts" desc="Never miss a spike" />
          </div>
        </motion.div>

        {/* CTA - Material Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard/OpenAI')}
            className="group relative px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 text-white text-base sm:text-lg md:text-xl font-bold rounded-full shadow-2xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              Try Live Demo
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-600 via-orange-600 to-orange-500"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
          <p className="mt-4 sm:mt-6 text-gray-500 text-xs sm:text-sm px-4">No signup required • Start tracking instantly</p>
        </motion.div>
      </main>

      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcomePopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-20 sm:top-24 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-auto max-w-md"
          >
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-2xl p-3 sm:p-4 relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowWelcomePopup(false)}
                className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
              </motion.button>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                </motion.div>
                <p className="text-white text-xs sm:text-sm font-medium">
                  Try popular brands below!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Warning Popup */}
      <AnimatePresence>
        {showBrandWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-20 sm:top-24 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-auto max-w-lg"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 relative border-2 border-orange-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowBrandWarning(false)}
                className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <X className="w-4 h-4 text-white" />
              </motion.button>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                    Limited to Popular Brands
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                    Sorry! Currently, PulseWatch can only build dashboards for popular brands to ensure quality data and accurate insights.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                    Please select one of the popular brands below:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          setShowBrandWarning(false);
                          router.push(`/dashboard/${brand}`);
                        }}
                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-xs font-semibold transition-colors border border-orange-200"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 + delay, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-3 sm:mb-4 md:mb-6 bg-gradient-to-br ${color} rounded-xl sm:rounded-2xl shadow-lg text-white`}
        >
          {icon}
        </motion.div>
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-gray-800">{title}</h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{description}</p>
      </div>
      
      {/* Bottom accent line */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

function ShowcaseItem({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center shadow-md hover:shadow-xl transition-all"
    >
      <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{icon}</div>
      <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm md:text-base">{title}</h4>
      <p className="text-xs sm:text-sm text-gray-500">{desc}</p>
    </motion.div>
  );
}
