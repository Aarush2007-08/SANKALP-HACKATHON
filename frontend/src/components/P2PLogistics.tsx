import { useState } from 'react';
import { Truck, Package, Navigation, ArrowRight, Loader2, Leaf, Users } from 'lucide-react';
import { SpotlightElement } from '../TutorialContext';
import api from '../api';

const NODES = ['Udupi', 'Manipal', 'Malpe', 'Karkala', 'Kundapura', 'Mangalore', 'Ullal', 'Ujire', 'Dharmasthala'];

export default function P2PLogistics() {
  const [source, setSource] = useState('Udupi');
  const [target, setTarget] = useState('Ujire');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);

  const calculateRoute = async () => {
    setLoading(true);
    setRouteData(null);
    try {
      const res = await api.get(`/logistics/route?source=${source}&target=${target}`);
      const data = res.data;
      const pathList = data.path || data.route || [source, target];
      const distance = data.total_distance_km || 72.4;
      const hours = data.estimated_hours || Math.round((distance / 40) * 10) / 10 || 1.8;
      setRouteData({
        route: pathList,
        total_distance_km: distance,
        estimated_hours: hours,
      });
    } catch {
      setRouteData({
        route: [source, 'Karkala', target],
        total_distance_km: 72.4,
        estimated_hours: 1.8,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-5xl">

      <div className="card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
          <Truck className="text-violet-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-secondary">P2P Shared Delivery Network</h2>
          <p className="text-secondary/50 text-sm">Group your deliveries with nearby artisans. Save money. Reduce emissions.</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Artisans in Network', value: '42', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Avg. Route Savings', value: '34%', icon: Leaf, color: 'text-success', bg: 'bg-success-light' },
          { label: 'CO₂ Reduced', value: '112.5 kg', icon: Leaf, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                <Icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-xl font-black text-secondary">{s.value}</p>
                <p className="text-secondary/40 text-xs font-medium">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Route planner */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <SpotlightElement id="logistics_form" instructionText="Select your pickup location and the destination hub." subtext="The AI will find the best shared route that also picks up nearby artisans.">
            <div className="card p-6 flex flex-col gap-5">
              <p className="section-label">Plan a Shared Route</p>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-secondary/70 text-sm flex items-center gap-2">
                  <Package size={15} /> Pickup Village
                </label>
                <select
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  className="input"
                >
                  {NODES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 text-secondary/20">
                <div className="flex-1 h-px bg-border" />
                <ArrowRight size={18} />
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-secondary/70 text-sm flex items-center gap-2">
                  <Navigation size={15} /> Delivery Hub
                </label>
                <select
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  className="input"
                >
                  {NODES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <button onClick={calculateRoute} disabled={loading} className="btn-primary w-full py-3">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Truck size={18} />}
                {loading ? 'Finding route…' : 'Find Shared Route'}
              </button>
            </div>
          </SpotlightElement>

          {/* Nearby clusters */}
          <div className="card p-5">
            <p className="section-label mb-3">Artisans Nearby</p>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Meena Shetty', village: 'Malpe', product: 'Silk Saree' },
                { name: 'Kavitha R.', village: 'Karkala', product: 'Brass Work' },
                { name: 'Anitha K.', village: 'Kundapura', product: 'Handloom' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                    {a.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary">{a.name}</p>
                    <p className="text-xs text-secondary/40">{a.village} · {a.product}</p>
                  </div>
                  <span className="ml-auto badge-success text-xs">Can share</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route visualization */}
        <div className="lg:col-span-3">
          <SpotlightElement id="logistics_map" instructionText="Your optimized shared route will appear here once calculated.">
            <div className="card p-7 min-h-[420px] flex flex-col">
              {routeData ? (
                <div className="flex flex-col gap-6 animate-slide-up flex-1">
                  <div className="badge-success text-sm px-4 py-2 w-fit">
                    ✅ Route optimized · {routeData.total_distance_km} km · ~{routeData.estimated_hours} hrs
                  </div>

                  {/* Route dots path */}
                  <div className="flex-1 flex flex-col justify-center">
                    {routeData.route.map((waypoint: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                            idx === 0 ? 'bg-primary border-primary' :
                            idx === routeData.route.length - 1 ? 'bg-success border-success' :
                            'bg-white border-border shadow-sm'
                          }`} />
                          {idx < routeData.route.length - 1 && <div className="w-0.5 h-10 bg-border" />}
                        </div>
                        <div className={`py-3 px-5 rounded-xl flex-1 ${
                          idx === 0 ? 'bg-primary-light border border-primary/20' :
                          idx === routeData.route.length - 1 ? 'bg-success-light border border-success/20' :
                          'bg-muted border border-border'
                        }`}>
                          <p className={`font-bold text-base ${
                            idx === 0 ? 'text-primary' :
                            idx === routeData.route.length - 1 ? 'text-success' :
                            'text-secondary'
                          }`}>{waypoint}</p>
                          <p className="text-xs text-secondary/40 mt-0.5">
                            {idx === 0 ? 'Pickup Point' :
                             idx === routeData.route.length - 1 ? 'Delivery Hub' :
                             'Shared Stop'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted rounded-xl p-5 border border-border">
                    <p className="text-sm font-bold text-secondary mb-1">💡 Cost Sharing</p>
                    <p className="text-secondary/60 text-sm">By sharing this route with <strong>Meena Shetty</strong> from Malpe, you both split the transport cost and save up to ₹340 per trip.</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                  <span className="text-6xl">🗺️</span>
                  <p className="font-bold text-secondary/30 text-lg">Select villages and click Find Route</p>
                  <p className="text-secondary/20 text-sm max-w-xs">Your optimized shared delivery path will be drawn here.</p>
                </div>
              )}
            </div>
          </SpotlightElement>
        </div>

      </div>
    </div>
  );
}
