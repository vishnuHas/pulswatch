import { motion } from 'framer-motion';
import SpikeAlerts from '../SpikeAlerts';

export default function LiveAlertsCard({ spikeData }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: 0.15 }} 
      className="bg-white rounded-3xl p-6 shadow-sm"
    >
      <h3 className="text-xl font-bold mb-4">Live Alerts</h3>
      <SpikeAlerts spikes={spikeData} />
    </motion.div>
  );
}
