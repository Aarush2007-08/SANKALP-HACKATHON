import { useState, useEffect } from 'react';
import { SpotlightElement } from '../TutorialContext';
import { ShieldCheck, QrCode, FileText, Loader2, Database } from 'lucide-react';
import api from '../api';

export default function TrustLedger() {
  const [history, setHistory] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [productId] = useState("PROD-10293"); // Hardcoded for demo

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/ledger/history/${productId}`);
      setHistory(res.data);
      
      const qrRes = await api.get(`/ledger/passport/${productId}`);
      setQrUrl(qrRes.data.explorer_url); // For the UI demo, we might just show a mock QR or the URL
    } catch (e) {
      console.error(e);
      alert("Error fetching ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      
      <div className="bg-secondary text-white p-8 rounded-2xl shadow-lg border border-indigo-900 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3"><ShieldCheck size={36}/> SHECAN Trust Ledger</h2>
          <p className="text-indigo-200 mt-2 text-lg">Immutable, decentralized records of authenticity and ownership.</p>
        </div>
        <div className="hidden md:flex flex-col items-end">
           <span className="text-indigo-300 font-mono text-sm">ACTIVE PRODUCT HASH</span>
           <span className="font-bold font-mono bg-indigo-900 p-2 rounded text-indigo-100">{productId}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* QR Passport View */}
        <SpotlightElement id="ledger_qr" instructionText="This is your Digital Product Passport. Print it! When customers scan it, they see exactly who made it and that it's authentic." className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-primary flex flex-col items-center text-center gap-6">
            <h3 className="font-bold text-xl text-secondary">Digital Passport</h3>
            <div className="w-48 h-48 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center p-4">
              <QrCode size={120} className="text-gray-800" />
            </div>
            {qrUrl && <p className="text-xs font-mono text-gray-500 break-all">{qrUrl}</p>}
            <button className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
              Download Passport
            </button>
          </div>
        </SpotlightElement>

        {/* Blockchain History log */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="font-bold text-xl text-secondary flex items-center gap-2"><Database /> Transaction History</h3>
            {history?.chain_is_valid && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <ShieldCheck size={16} /> Verified Chain
              </span>
            )}
          </div>

          <SpotlightElement id="ledger_history" instructionText="This is the unchangeable ledger. Every step from creation to quality checks is recorded forever. Nobody can alter your origin story.">
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2">
              {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" size={48} /></div>
              ) : history?.chain ? (
                history.chain.map((block: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex gap-4 font-mono text-sm relative">
                     <div className="flex flex-col items-center pt-1 gap-1 min-w-[30px]">
                        <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-600">{block.index}</div>
                        {i !== history.chain.length -1 && <div className="w-0.5 h-full bg-gray-300"></div>}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                           <span className="font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded text-xs">{new Date(block.timestamp).toLocaleString()}</span>
                           <span className="text-xs text-gray-500 max-w-[150px] truncate" title={block.hash}>HASH: {block.hash}</span>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-100 text-gray-700 shadow-sm">
                           <p><span className="font-bold">Event:</span> {block.transactions[0]?.transaction_type || "Genesis Block"}</p>
                           {block.transactions[0]?.flagged_fake && (
                             <p className="text-red-600 font-bold mt-1 bg-red-50 p-1 rounded">⚠️ SPAM FLAG DETECTED (Trust = 0.0)</p>
                           )}
                        </div>
                     </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center mt-10">No history found.</p>
              )}
            </div>
          </SpotlightElement>
        </div>

      </div>
    </div>
  );
}
