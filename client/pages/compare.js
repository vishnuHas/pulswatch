import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import { compareBrands } from '../utils/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Compare({ darkMode, setDarkMode }) {
  const [brandA, setBrandA] = useState('');
  const [brandB, setBrandB] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    
    if (!brandA.trim() || !brandB.trim()) {
      alert('Please enter both brand names');
      return;
    }

    setLoading(true);
    try {
      const data = await compareBrands(brandA.trim(), brandB.trim());
      setComparisonData(data);
    } catch (error) {
      console.error('Comparison error:', error);
      alert('Failed to compare brands');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Compare Brands
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare sentiment and mentions between two brands
          </p>
        </motion.div>

        {/* Comparison Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
        >
          <form onSubmit={handleCompare} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand A
              </label>
              <input
                type="text"
                value={brandA}
                onChange={(e) => setBrandA(e.target.value)}
                placeholder="e.g., OpenAI"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand B
              </label>
              <input
                type="text"
                value={brandB}
                onChange={(e) => setBrandB(e.target.value)}
                placeholder="e.g., Google"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Comparing...' : 'Compare'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Comparison Results */}
        {comparisonData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <BrandCard brand={comparisonData.brandA} />
              <BrandCard brand={comparisonData.brandB} />
            </div>

            {/* Comparison Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <ComparisonChart
                title="Total Mentions"
                brandA={comparisonData.brandA}
                brandB={comparisonData.brandB}
                metric="total"
              />
              <SentimentComparisonChart
                brandA={comparisonData.brandA}
                brandB={comparisonData.brandB}
              />
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!comparisonData && !loading && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Enter two brand names to compare</p>
          </div>
        )}
      </main>
    </div>
  );
}

function BrandCard({ brand }) {
  const positivePercent = brand.stats.positivePercent || 0;
  const negativePercent = brand.stats.negativePercent || 0;
  
  const sentiment = positivePercent > negativePercent ? 'positive' : 
                    negativePercent > positivePercent ? 'negative' : 'neutral';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        {brand.name}
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600">{brand.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Mentions</div>
        </div>

        <div className={`rounded-lg p-4 ${
          sentiment === 'positive' ? 'bg-green-50 dark:bg-green-900/20' :
          sentiment === 'negative' ? 'bg-red-50 dark:bg-red-900/20' :
          'bg-gray-50 dark:bg-gray-700'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {sentiment === 'positive' && <TrendingUp className="w-5 h-5 text-green-600" />}
            {sentiment === 'negative' && <TrendingDown className="w-5 h-5 text-red-600" />}
            <span className={`text-2xl font-bold ${
              sentiment === 'positive' ? 'text-green-600' :
              sentiment === 'negative' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {sentiment === 'positive' ? positivePercent :
               sentiment === 'negative' ? negativePercent :
               brand.stats.neutralPercent}%
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {sentiment} Sentiment
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Positive</span>
          <span className="font-semibold text-green-600">{positivePercent}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${positivePercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Neutral</span>
          <span className="font-semibold text-gray-600">{brand.stats.neutralPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gray-500 h-2 rounded-full"
            style={{ width: `${brand.stats.neutralPercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Negative</span>
          <span className="font-semibold text-red-600">{negativePercent}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${negativePercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function ComparisonChart({ title, brandA, brandB, metric }) {
  const data = {
    labels: [brandA.name, brandB.name],
    datasets: [
      {
        label: title,
        data: [brandA[metric], brandB[metric]],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)'],
        borderColor: ['rgba(59, 130, 246, 1)', 'rgba(139, 92, 246, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

function SentimentComparisonChart({ brandA, brandB }) {
  const data = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: brandA.name,
        data: [
          brandA.stats.positivePercent,
          brandA.stats.neutralPercent,
          brandA.stats.negativePercent,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: brandB.name,
        data: [
          brandB.stats.positivePercent,
          brandB.stats.neutralPercent,
          brandB.stats.negativePercent,
        ],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Sentiment Comparison
      </h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
