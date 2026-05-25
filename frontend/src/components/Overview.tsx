import { ShieldCheck, MapPin, Truck, LayoutList, TrendingUp, Star } from 'lucide-react';
import { SpotlightElement } from '../TutorialContext';

const MetricCard = ({
  label, value, icon: Icon, color, bg, trend
}: { label: string; value: string; icon: any; color: string; bg: string; trend?: string }) => (
  <div className="card-hover p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon size={22} className={color} />
      </div>
      {trend && (
        <span className="badge-success">
          <TrendingUp size={11} /> {trend}
        </span>
      )}
    </div>
    <div>
      <p className="section-label">{label}</p>
      <h3 className="text-2xl font-black text-secondary mt-1">{value}</h3>
    </div>
  </div>
);

export default function Overview() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Hero greeting */}
      <SpotlightElement
        id="overview_welcome"
        instructionText="Welcome to your Artisan Dashboard!"
        subtext="From here you can see how your business is performing across all areas."
      >
        <div className="card p-8 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🧶</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-secondary">Namaste, Devika! 🙏</h1>
            <p className="text-secondary/60 mt-1 text-base">Your network is healthy and your products are visible. Here's a summary of today.</p>
          </div>
          <div className="hidden md:block badge-success text-sm px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            All systems active
          </div>
        </div>
      </SpotlightElement>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard label="Trust Score" value="9.8 / 10" icon={ShieldCheck} color="text-success" bg="bg-success-light" trend="+0.2 this week" />
        <MetricCard label="Villages Synced" value="3 / 3 Nodes" icon={MapPin} color="text-blue-600" bg="bg-blue-50" />
        <MetricCard label="Route Savings" value="~34% Fuel" icon={Truck} color="text-primary" bg="bg-primary-light" trend="vs direct routes" />
        <MetricCard label="Active Listings" value="42 Products" icon={LayoutList} color="text-violet-600" bg="bg-violet-50" trend="12 new this month" />
      </div>

      {/* Quick actions */}
      <div>
        <p className="section-label mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🎙️', title: 'Add New Product', sub: 'Speak and upload a photo', color: 'bg-primary-light border-primary/20' },
            { icon: '💰', title: 'Check Fair Price', sub: 'Get AI-recommended pricing', color: 'bg-success-light border-success/20' },
            { icon: '🚚', title: 'Plan Delivery', sub: 'Find a shared route nearby', color: 'bg-violet-50 border-violet-200' },
          ].map((a, i) => (
            <button key={i} className={`card-hover p-5 border text-left flex items-start gap-4 ${a.color} transition-all`}>
              <span className="text-3xl">{a.icon}</span>
              <div>
                <p className="font-bold text-secondary">{a.title}</p>
                <p className="text-secondary/50 text-sm mt-0.5">{a.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <p className="section-label mb-4">Recent Activity</p>
        <div className="card divide-y divide-border">
          {[
            { icon: '✅', text: 'Product "Silk Kasuti Dupatta" listed successfully', time: '2 min ago' },
            { icon: '💰', text: 'Fair price set at ₹2,100 for Cotton Saree (Diwali Boost +18%)', time: '1 hr ago' },
            { icon: '⛓️', text: 'Authenticity block #24 verified on SHECAN Ledger', time: '3 hr ago' },
            { icon: '🚚', text: 'Shared route Udupi→Karkala→Ujire saved 2.4L fuel', time: 'Yesterday' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
              <p className="text-secondary/80 text-sm flex-1">{item.text}</p>
              <span className="text-secondary/40 text-xs whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
