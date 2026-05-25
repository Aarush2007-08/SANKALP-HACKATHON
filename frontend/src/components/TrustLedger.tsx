import { ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { useTutorial } from '../TutorialContext';
import { motion } from 'framer-motion';

export default function TrustLedger() {
  const { registerTarget } = useTutorial();

  const milestones = [
    { label: 'Raw Material Sourced', location: 'Gadag District', time: '12 May 2026' },
    { label: 'Artisan Crafted', location: 'Udupi Weavers Co-op', time: '14 May 2026' },
    { label: 'Quality Verified', location: 'She Can Market Hub', time: '16 May 2026' },
  ];

  return (
    <div className="pt-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-4">
          Trust <em className="font-['Instrument_Serif'] italic text-white/60">Ledger</em>
        </h2>
        <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
          Immutable proof of origin and authenticity. Build unshakeable consumer trust by transparently sharing the journey of every product.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Verification Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass rounded-3xl p-8"
          ref={el => registerTarget('ledger_verify', el)}
        >
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
              <ShieldCheck className="text-blue-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white text-lg font-medium">Udupi Cotton Saree</h3>
              <p className="text-white/50 text-xs uppercase tracking-wider mt-1">ID: #SKP-2026-8921</p>
            </div>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-3 before:w-px before:bg-white/10">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium">{m.label}</h4>
                  <p className="text-white/60 text-xs mt-1">{m.location}</p>
                  <p className="text-white/40 text-xs mt-1">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* QR Code Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div className="liquid-glass rounded-3xl p-8 flex-1 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-4 rounded-2xl mb-6 shadow-xl">
              <QrCode className="w-32 h-32 text-black" />
            </div>
            <h3 className="text-white font-medium text-lg mb-2">Consumer Verification</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Buyers can scan this code to view the immutable ledger of this product on the blockchain.
            </p>
          </div>
          
          <button className="w-full liquid-glass rounded-full py-4 text-white text-sm font-medium hover:bg-white/10 transition-colors">
            Generate QR Code Tags
          </button>
        </motion.div>
      </div>
    </div>
  );
}
