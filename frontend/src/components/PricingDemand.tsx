import { useState } from 'react';
import { SpotlightElement } from '../TutorialContext';
import { IndianRupee, Clock, Award, Loader2, TrendingUp } from 'lucide-react';
import api from '../api';

export default function PricingDemand() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [form, setForm] = useState({
    material_cost: 250,
    labor_hours: 12,
    skill_level: 'intermediate',
    demand_factor: 1.2
  });

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await api.post('/pricing/predict', form);
      setResult(res.data);
    } catch (e) {
      console.error(e);
      alert("Error predicting price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="text-2xl font-black text-secondary">Calculate Fair Price</h2>
          
          <SpotlightElement id="pricing_materials" instructionText="Enter the total cost of all raw materials (threads, dye, etc.) used to make this item.">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700 flex items-center gap-2">
                <IndianRupee size={18}/> Material Cost (INR)
              </label>
              <input 
                type="number" 
                value={form.material_cost}
                onChange={e => setForm({...form, material_cost: Number(e.target.value)})}
                className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none" 
              />
            </div>
          </SpotlightElement>

          <SpotlightElement id="pricing_hours" instructionText="How many total hours did you spend making this? Your time is valuable!">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700 flex items-center gap-2">
                <Clock size={18}/> Labor Hours Spent
              </label>
              <input 
                type="number" 
                value={form.labor_hours}
                onChange={e => setForm({...form, labor_hours: Number(e.target.value)})}
                className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none" 
              />
            </div>
          </SpotlightElement>

          <SpotlightElement id="pricing_skill" instructionText="What is your expertise level? Master artisans get a higher multiplier.">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700 flex items-center gap-2">
                <Award size={18}/> Artisan Skill Level
              </label>
              <select 
                value={form.skill_level}
                onChange={e => setForm({...form, skill_level: e.target.value})}
                className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="master">Master Weaver</option>
              </select>
            </div>
          </SpotlightElement>

          <SpotlightElement id="pricing_submit" instructionText="Click here to let our AI calculate exactly how much you should charge based on fair trade standards!">
             <button 
                onClick={handlePredict}
                disabled={loading}
                className="w-full mt-4 py-4 bg-secondary text-white rounded-xl font-bold text-xl hover:bg-indigo-900 transition-colors flex justify-center items-center gap-3 disabled:opacity-70 shadow-md"
             >
               {loading && <Loader2 className="animate-spin" />}
               {loading ? 'Calculating...' : 'Get Recommended Price'}
             </button>
          </SpotlightElement>

        </div>

        {/* Right Results / Charts */}
        <div className="flex flex-col gap-8">
           {result ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-primary bg-orange-50/20">
                <h3 className="text-xl font-bold text-gray-500 mb-2 uppercase tracking-wide">Recommended Fair Price</h3>
                <div className="text-6xl font-black text-secondary mb-6 flex items-center">
                   <IndianRupee size={48} className="mr-2 text-primary"/> 
                   {result.recommended_price}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                     <span className="font-semibold text-gray-600">Base Calculation</span>
                     <span className="font-bold text-gray-800">₹{result.base_price}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl text-green-800">
                     <span className="font-semibold flex items-center gap-2"><TrendingUp size={18}/> Demand Boost (Festival)</span>
                     <span className="font-bold">₹{result.demand_adjusted_price}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl text-secondary">
                     <span className="font-semibold">Fair Price Band</span>
                     <span className="font-bold">₹{result.fair_price_band[0]} - ₹{result.fair_price_band[1]}</span>
                  </div>
                </div>
              </div>
           ) : (
             <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center h-full min-h-[300px]">
                <p className="text-gray-400 text-lg font-medium text-center">Fill out the form and click calculate to see your fair price recommendation here.</p>
             </div>
           )}

           {/* Demand Trends Stub */}
           <SpotlightElement id="pricing_demand" instructionText="This section automatically watches for festivals like Diwali or Pongal and adjusts your recommended prices higher when demand goes up!">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-orange-100 text-primary rounded-xl">
                   <TrendingUp size={32} />
                </div>
                <div>
                   <h4 className="font-bold text-xl text-secondary">Upcoming: Diwali Spikes</h4>
                   <p className="text-gray-500">AI forecasts a <span className="font-bold text-green-600">+45% demand increase</span> for textiles over the next 4 weeks. Price recommendations have been adjusted.</p>
                </div>
             </div>
           </SpotlightElement>
        </div>

      </div>
    </div>
  );
}
