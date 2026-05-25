import { ShieldCheck, MapPin, Truck, LayoutList, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTutorial } from '../TutorialContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Overview() {
  const { registerTarget } = useTutorial();

  const stats = [
    { label: 'Active Artisans', value: '1,240', icon: LayoutList, color: 'text-blue-400' },
    { label: 'Verified Products', value: '8,400', icon: ShieldCheck, color: 'text-green-400' },
    { label: 'Avg Income Boost', value: '+34%', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Shared Deliveries', value: '450', icon: Truck, color: 'text-orange-400' },
  ];

  return (
    <div className="pt-8">
      <motion.div
        ref={el => registerTarget('overview_welcome', el)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-4">
          Rural Intelligence <em className="font-['Instrument_Serif'] italic text-white/60">Overview</em>
        </h2>
        <p className="text-white/60 max-w-2xl text-base md:text-lg">
          Monitor the entire ecosystem. From fair pricing analytics to real-time logistics networks, track how She Can Market is empowering artisan clusters across the state.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="liquid-glass rounded-3xl p-6"
          >
            <stat.icon className={`${stat.color} w-8 h-8 mb-4 opacity-80`} />
            <h3 className="text-3xl text-white font-['Instrument_Serif'] italic mb-1">{stat.value}</h3>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map Integration */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="liquid-glass rounded-3xl p-6 aspect-video flex flex-col relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-4 relative z-10 pointer-events-none">
            <h3 className="text-white font-medium flex items-center gap-2">
              <MapPin size={18} className="text-blue-400" /> Live Artisan Map
            </h3>
            <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full backdrop-blur-md">Karnataka Region</span>
          </div>
          
          <div className="absolute inset-0 top-16 bottom-4 left-4 right-4 rounded-xl overflow-hidden border border-white/10 opacity-80 z-0">
            <MapContainer 
              center={[14.1, 75.2]} 
              zoom={6} 
              scrollWheelZoom={false} 
              style={{ height: '100%', width: '100%', background: 'transparent' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
              />
              <Marker position={[13.3408, 74.7421]}>
                <Popup>Udupi Weavers Hub</Popup>
              </Marker>
              <Marker position={[15.4283, 75.6322]}>
                <Popup>Gadag Raw Material Center</Popup>
              </Marker>
              <Marker position={[12.9716, 77.5946]}>
                <Popup>Bangalore Distribution</Popup>
              </Marker>
            </MapContainer>
          </div>
        </motion.div>

        {/* Activity Feed Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="liquid-glass rounded-3xl p-6 aspect-video flex flex-col"
        >
          <h3 className="text-white font-medium mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Recent Activity
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[
              "Anita from Udupi just verified 5 Sarees.",
              "Shared truck route formed: Mysore -> Bangalore.",
              "Rajesh's wooden toys sold out at +12% fair price.",
              "New SHG onboarded in Hubli.",
            ].map((text, i) => (
              <div key={i} className="flex gap-4 text-sm pb-4 border-b border-white/10 last:border-0">
                <span className="text-white/40 whitespace-nowrap">2m ago</span>
                <span className="text-white/70">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
