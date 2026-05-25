import { ShieldCheck, MapPin, Truck, LayoutList } from 'lucide-react';
import { SpotlightElement } from '../TutorialContext';

export default function Overview() {
  const stats = [
    { label: "Trust Score", value: "9.8/10", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-100" },
    { label: "Villages Synced", value: "3/3 Nodes", icon: MapPin, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Route Savings", value: "~34% Fuel", icon: Truck, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Active Listings", value: "42", icon: LayoutList, color: "text-indigo-600", bg: "bg-indigo-100" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <SpotlightElement 
        id="overview_welcome" 
        instructionText="Welcome to the Artisan Dashboard! This is your intelligence center. Here you can see your Trust Score and logistics savings."
      >
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-black text-secondary mb-2">Welcome Back, Devika!</h1>
          <p className="text-lg text-gray-500">Your network is active and your listings are performing well.</p>
        </div>
      </SpotlightElement>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={32} />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-bold text-secondary mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
