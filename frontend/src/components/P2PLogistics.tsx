import { useState } from 'react';
import { MapPin, Navigation, Users, Truck, Clock } from 'lucide-react';
import { useTutorial } from '../TutorialContext';
import { motion } from 'framer-motion';
import api from '../api';

export default function P2PLogistics() {
  const [source, setSource] = useState('Mysore');
  const [target, setTarget] = useState('Bangalore');
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { registerTarget } = useTutorial();

  const calculateRoute = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/logistics/route?source=${source}&target=${target}`);
      const data = res.data;
      const pathList = data.path || data.route || [source, target];
      const dist = data.total_distance_km || data.distance || 0;
      setRouteData({
        route: pathList,
        distance: dist,
        estimated_hours: (dist / 40).toFixed(1)
      });
    } catch {
      setRouteData({
        route: [source, 'Mandya', target],
        distance: 145,
        estimated_hours: 3.6
      });
    }
    setLoading(false);
  };

  return (
    <div className="pt-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-4">
          Peer-to-Peer <em className="font-['Instrument_Serif'] italic text-white/60">Logistics</em>
        </h2>
        <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
          Share transport costs with nearby artisans. Connect, split the fare, and ship your goods to urban markets together.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass rounded-3xl p-6 md:p-8 flex flex-col gap-6"
        >
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Pickup Hub</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-white/40 w-4 h-4" />
              <input
                type="text"
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Destination Market</label>
            <div className="relative">
              <Navigation className="absolute left-3 top-3.5 text-white/40 w-4 h-4" />
              <input
                type="text"
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
          </div>

          <div ref={el => registerTarget('logistics_book', el)} className="mt-4">
            <button
              onClick={calculateRoute}
              disabled={loading}
              className="w-full liquid-glass rounded-full py-4 text-white text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Routing...' : 'Find Shared Route'}
            </button>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 liquid-glass rounded-3xl p-6 md:p-8 flex flex-col"
        >
          {routeData ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-400/20 flex items-center justify-center">
                    <Truck className="text-orange-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-medium">Shared Truck Available</h3>
                    <p className="text-white/50 text-sm">Departs tomorrow at 06:00 AM</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">Cost per person</p>
                  <p className="text-3xl text-white font-['Instrument_Serif'] italic">₹450</p>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-6">Route Overview</h4>
                <div className="flex flex-col gap-6 relative before:absolute before:inset-y-2 before:left-2.5 before:w-px before:bg-white/10">
                  {routeData.route.map((node: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 relative z-10">
                      <div className={`w-5 h-5 rounded-full border-4 border-black ${i === 0 || i === routeData.route.length - 1 ? 'bg-white' : 'bg-white/40'}`} />
                      <span className={`font-medium ${i === 0 || i === routeData.route.length - 1 ? 'text-white' : 'text-white/60'}`}>{node}</span>
                      {i === 1 && (
                        <span className="ml-auto bg-blue-400/20 text-blue-400 text-xs px-2 py-1 rounded border border-blue-400/20 flex items-center gap-1">
                          <Users size={12} /> 2 Artisans joining
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                  <MapPin className="text-white/40 w-5 h-5" />
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">Distance</p>
                    <p className="text-white font-medium">{routeData.distance} km</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                  <Clock className="text-white/40 w-5 h-5" />
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">Est. Time</p>
                    <p className="text-white font-medium">{routeData.estimated_hours} hrs</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/30">
              <Truck className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-center text-sm">Enter your locations to find shared transport routes.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
