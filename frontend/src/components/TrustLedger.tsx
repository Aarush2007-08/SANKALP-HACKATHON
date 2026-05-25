import { useState, useEffect } from 'react';
import { ShieldCheck, QrCode, Loader2, Database, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SpotlightElement } from '../TutorialContext';
import api from '../api';

const DEMO_CHAIN = [
  { index: 0, timestamp: '2024-01-10T09:00:00Z', hash: '000000genesis', transactions: [] },
  { index: 1, timestamp: '2024-01-10T10:22:00Z', hash: '0a9f2b3c4d5e', transactions: [{ transaction_type: 'product_created', flagged_fake: false }] },
  { index: 2, timestamp: '2024-01-11T14:35:00Z', hash: '1b8e3a2f9c0d', transactions: [{ transaction_type: 'quality_verified', flagged_fake: false }] },
  { index: 3, timestamp: '2024-01-12T11:00:00Z', hash: '2c7d4b1e8f3a', transactions: [{ transaction_type: 'artisan_consent_logged', flagged_fake: false }] },
  { index: 4, timestamp: '2024-01-13T09:45:00Z', hash: '3d6e5c0b7a2f', transactions: [{ transaction_type: 'rating_added', flagged_fake: false }] },
];

export default function TrustLedger() {
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const productId = 'PROD-10293';

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/ledger/history/${productId}`);
        setHistory(res.data);
      } catch {
        setHistory({ product_id: productId, chain: DEMO_CHAIN, chain_is_valid: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chain = history?.chain || [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-5xl">

      {/* Header */}
      <div className="card p-6 flex items-center gap-4 border-2 border-secondary/10 bg-secondary/[0.02]">
        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
          <ShieldCheck className="text-secondary" size={24} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-secondary">SHECAN Trust Ledger</h2>
          <p className="text-secondary/50 text-sm">Immutable records. Your authenticity, forever protected.</p>
        </div>
        {history?.chain_is_valid && (
          <div className="badge-success text-sm px-4 py-2">
            <CheckCircle2 size={14} /> Verified Chain
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* QR Passport */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <SpotlightElement
            id="ledger_qr"
            instructionText="This is your Digital Product Passport."
            subtext="Print it and stick it to your product. Customers can scan it to verify your craft is authentic and ethically made."
          >
            <div className="card p-7 flex flex-col items-center text-center gap-5 border-2 border-secondary/10">
              <div className="w-14 h-14 rounded-2xl bg-secondary/5 flex items-center justify-center">
                <QrCode size={28} className="text-secondary" />
              </div>
              <div>
                <h3 className="font-black text-lg text-secondary">Digital Passport</h3>
                <p className="text-secondary/40 text-xs mt-1">{productId}</p>
              </div>

              {/* QR code visual placeholder */}
              <div className="w-44 h-44 bg-secondary rounded-2xl flex items-center justify-center relative overflow-hidden">
                <QrCode size={120} className="text-white opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-secondary/40" />
              </div>

              {/* Journey timeline */}
              <div className="w-full flex flex-col gap-0">
                <p className="section-label mb-3">Origin Journey</p>
                {['Grown in Karkala', 'Spun in Udupi', 'Dyed with natural pigments', 'Hand-woven by Devika'].map((step, i, arr) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-success flex-shrink-0 mt-0.5" />
                      {i < arr.length - 1 && <div className="w-0.5 h-6 bg-success/20" />}
                    </div>
                    <p className="text-secondary/70 text-sm pb-2">{step}</p>
                  </div>
                ))}
              </div>

              <button className="btn-secondary w-full">Download Passport PDF</button>
            </div>
          </SpotlightElement>
        </div>

        {/* Transaction log */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <SpotlightElement id="ledger_history" instructionText="This is the unchangeable blockchain ledger." subtext="Every step from creation to quality check is recorded forever. No one can alter your story.">
            <div className="card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <p className="section-label flex items-center gap-2"><Database size={13} /> Transaction History</p>
                <div className="flex items-center gap-2 text-secondary/30 text-xs font-mono font-semibold">
                  <Lock size={11} /> SHA-256 Verified
                </div>
              </div>

              <div className="flex flex-col gap-1 max-h-[480px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-secondary/20" size={36} />
                  </div>
                ) : (
                  chain.map((block: any, i: number) => {
                    const isFlagged = block.transactions?.[0]?.flagged_fake;
                    const type = block.transactions?.[0]?.transaction_type || 'genesis_block';
                    return (
                      <div key={i} className="flex gap-3 py-3 group">
                        {/* Line connector */}
                        <div className="flex flex-col items-center gap-0 flex-shrink-0 w-10">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isFlagged ? 'bg-red-100 text-red-600' : 'bg-muted text-secondary/60'
                          }`}>
                            #{block.index}
                          </div>
                          {i < chain.length - 1 && <div className="w-px flex-1 bg-border min-h-[8px] mt-1" />}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 rounded-xl px-4 py-3 mb-1 border ${
                          isFlagged
                            ? 'bg-red-50 border-red-200'
                            : 'bg-muted border-transparent group-hover:border-border'
                        } transition-all`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-secondary text-sm capitalize">
                                {type.replace(/_/g, ' ')}
                              </p>
                              <p className="text-secondary/40 text-xs mt-0.5">
                                {new Date(block.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                            {isFlagged ? (
                              <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-100 px-2 py-1 rounded-md flex-shrink-0">
                                <AlertTriangle size={12} /> Flagged
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-success text-xs font-bold flex-shrink-0">
                                <CheckCircle2 size={12} /> Valid
                              </span>
                            )}
                          </div>
                          <p className="text-secondary/25 text-xs font-mono mt-2 truncate">
                            HASH: {block.hash}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </SpotlightElement>

          {/* Add transaction demo */}
          <SpotlightElement id="ledger_add" instructionText="You can add a new entry to the ledger anytime — for ratings, quality checks, or ownership transfers.">
            <div className="card p-6">
              <p className="section-label mb-3">Add New Record</p>
              <div className="grid grid-cols-3 gap-3">
                {['Quality Check', 'Artisan Consent', 'Ownership Transfer'].map((label, i) => (
                  <button key={i} className="btn-secondary text-sm py-3 rounded-xl">
                    + {label}
                  </button>
                ))}
              </div>
            </div>
          </SpotlightElement>
        </div>

      </div>
    </div>
  );
}
