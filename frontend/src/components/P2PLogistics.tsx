import { useState } from 'react';
import { SpotlightElement } from '../TutorialContext';
import { Map, Truck, Navigation, Route as RouteIcon, Package, Loader2 } from 'lucide-react';
import api from '../api';

export default function P2PLogistics() {
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  
  const [source, setSource] = useState('Udupi');
  const [target, setTarget] = useState('Ujire');

  const nodes = ['Udupi', 'Manipal', 'Malpe', 'Karkala', 'Kundapura', 'Mangalore', 'Ullal', 'Ujire', 'Dharmasthala'];

  const calculateRoute = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/logistics/route?source=${source}&target=${target}`);
      setRouteData(res.data);
    } catch (e) {
      console.error(e);
      alert("Error finding route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      
      <SpotlightElement id="logistics_intro" instructionText="This is the Logistics Router. It helps you group your deliveries with other nearby artisans to share transport costs!">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-2">
          <h2 className="text-2xl font-black text-secondary flex items-center gap-2"><Map /> P2P Shared Delivery Network</h2>
          <p className="text-gray-500 mt-2 text-lg">Group your products with nearby artisans going to the same transport hubs.</p>
        </div>
      </SpotlightElement>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6 lg:col-span-1">
          <h3 className="font-bold text-xl text-secondary border-b pb-4">Plan Shared Route</h3>
          
          <SpotlightElement id="logistics_source" instructionText="Select which village your products are currently in.">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700 flex items-center gap-2"><Package size={18}/> Pickup Location</label>
              <select 
                value={source} onChange={e => setSource(e.target.value)}
                className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none bg-white"
              >
                {nodes.map(n => <option key={`src-${n}`} value={n}>{n}</option>)}
              </select>
            </div>
          </SpotlightElement>

          <SpotlightElement id="logistics_target" instructionText="Select the final destination hub for your delivery.">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700 flex items-center gap-2"><Navigation size={18}/> Destination Hub</label>
              <select 
                value={target} onChange={e => setTarget(e.target.value)}
                className="w-full text-lg p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none bg-white"
              >
                {nodes.map(n => <option key={`tgt-${n}`} value={n}>{n}</option>)}
              </select>
            </div>
          </SpotlightElement>

          <SpotlightElement id="logistics_calculate" instructionText="Click here to map out the most efficient shared delivery route!">
             <button 
                onClick={calculateRoute}
                disabled={loading}
                className="w-full mt-4 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-indigo-900 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
             >
               {loading && <Loader2 className="animate-spin" />}
               {loading ? 'Routing...' : 'Find Shared Route'}
             </button>
          </SpotlightElement>
        </div>

        {/* Map / Results View */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 min-h-[400px] flex flex-col">
           <h3 className="font-bold text-xl text-secondary border-b pb-4 mb-4">Route Path</h3>
           
           {routeData ? (
             <div className="flex-1 flex flex-col gap-6">
               <div className="flex items-center gap-4 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200 font-semibold">
                 <Truck size={24} />
                 Route optimized! Total Distance: {routeData.total_distance_km} km
               </div>

               <div className="flex items-center justify-between relative mt-8 px-4">
                  <div className="absolute left-8 right-8 top-1/2 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                  {routeData.route.map((waypoint: string, idx: number) => (
                    <div key={idx} className="z-10 flex flex-col items-center gap-2 bg-white px-2">
                       <div className="w-6 h-6 rounded-full border-4 border-primary bg-white"></div>
                       <span className="font-bold text-secondary text-sm">{waypoint}</span>
                    </div>
                  ))}
               </div>
               
               <div className="mt-auto bg-orange-50 p-6 rounded-xl border border-orange-100 flex gap-4 items-start">
                  <RouteIcon className="text-primary mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-lg text-primary">AI Clustering Activated</h4>
                    <p className="text-gray-600">By stopping at intermediate hubs, you can share a truck with artisans from {routeData.route.slice(1, -1).join(', ')}. This splits transport costs!</p>
                  </div>
               </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                <Map size={64} className="opacity-20" />
                <p className="text-lg font-medium">Select source and destination to generate map.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
