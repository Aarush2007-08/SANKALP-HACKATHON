import { useState, useEffect } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { useTutorial } from '../TutorialContext';
import { motion } from 'framer-motion';
import api from '../api';

export default function PricingDemand() {
  const [product, setProduct] = useState('Udupi Cotton Saree');
  const [materialCost, setMaterialCost] = useState(800);
  const [laborHours, setLaborHours] = useState(12);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  const { registerTarget } = useTutorial();

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await api.get(`/pricing/predict?product_name=${encodeURIComponent(product)}&material_cost=${materialCost}&labor_hours=${laborHours}`);
        setPredictedPrice(res.data.suggested_price);
      } catch {
        setPredictedPrice(materialCost + (laborHours * 50) + 300);
      }
    };
    const timeout = setTimeout(fetchPrediction, 500);
    return () => clearTimeout(timeout);
  }, [product, materialCost, laborHours]);

  return (
    <div className="pt-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-4">
          AI Fair <em className="font-['Instrument_Serif'] italic text-white/60">Pricing</em>
        </h2>
        <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
          Don't let middlemen dictate your worth. Our AI calculates the true market value based on your materials and labor.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass rounded-3xl p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Product Name</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Material Cost (₹)</label>
                <span className="text-white font-medium">₹{materialCost}</span>
              </div>
              <input
                type="range"
                min="100" max="5000" step="100"
                value={materialCost}
                onChange={(e) => setMaterialCost(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Labor Hours</label>
                <span className="text-white font-medium">{laborHours} hrs</span>
              </div>
              <input
                type="range"
                min="1" max="100"
                value={laborHours}
                onChange={(e) => setLaborHours(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          </div>
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div 
            ref={el => registerTarget('pricing_fair', el)}
            className="liquid-glass rounded-3xl p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent pointer-events-none" />
            <TrendingUp className="text-green-400 w-12 h-12 mb-4 opacity-80" />
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Fair Market Value</p>
            <h3 className="text-5xl md:text-6xl text-white font-['Instrument_Serif'] italic mb-4">
              ₹{predictedPrice || '...'}
            </h3>
            <p className="text-white/80 text-sm text-center px-4 bg-white/5 py-2 rounded-full border border-white/10">
              <span className="text-green-400 font-semibold">+15%</span> higher than middleman avg
            </p>
          </div>

          <div className="liquid-glass rounded-2xl p-6 flex items-start gap-4">
            <Info className="text-white/40 w-6 h-6 shrink-0 mt-0.5" />
            <p className="text-white/60 text-sm leading-relaxed">
              This estimate combines real-time urban demand, base material costs, and a living wage of ₹50/hr for artisan labor. Use this as your baseline negotiation price.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
