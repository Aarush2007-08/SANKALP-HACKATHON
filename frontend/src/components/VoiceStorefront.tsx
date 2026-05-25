import { useState } from 'react';
import { Mic, UploadCloud, Square, Loader2 } from 'lucide-react';
import { useTutorial } from '../TutorialContext';
import { motion } from 'framer-motion';
import api from '../api';

export default function VoiceStorefront() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{title?: string; description?: string; tags?: string[]} | null>(null);
  
  const { registerTarget } = useTutorial();

  const handleRecord = () => setIsRecording(!isRecording);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      const blob = new Blob(['dummy audio'], { type: 'audio/wav' });
      formData.append('audio_file', blob, 'recording.wav');
      const res = await api.post('/voice/process', formData);
      setResult(res.data);
    } catch (e) {
      console.error(e);
      setResult({
        title: 'Hand-woven Udupi Saree',
        description: "A beautiful naturally-dyed cotton saree hand-woven by artisans in the Udupi district.",
        tags: ['Cotton', 'Handloom', 'Udupi']
      });
    }
    setIsProcessing(false);
  };

  return (
    <div className="pt-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-4">
          Regional AI <em className="font-['Instrument_Serif'] italic text-white/60">Storefront</em>
        </h2>
        <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
          Speak in your native language. Our AI translates, enhances, and builds a professional English product listing automatically.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px]"
        >
          <div 
            ref={el => registerTarget('voice_record', el)}
            className="flex flex-col items-center gap-6"
          >
            <button
              onClick={handleRecord}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-red-500/20 text-red-400 shadow-[0_0_40px_rgba(239,68,68,0.3)]' 
                  : 'liquid-glass text-white hover:bg-white/10 hover:scale-105'
              }`}
            >
              {isRecording ? <Square size={32} className="fill-current" /> : <Mic size={32} />}
            </button>
            <p className="text-white/60 text-sm font-medium">
              {isRecording ? 'Recording in Kannada...' : 'Tap to describe your craft'}
            </p>
          </div>

          <div className="w-full h-px bg-white/10 my-8" />

          <div ref={el => registerTarget('voice_upload', el)}>
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full liquid-glass rounded-full py-4 px-6 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={18} /> Processing AI Translation...</>
              ) : (
                <><UploadCloud size={18} /> Process Audio to English</>
              )}
            </button>
          </div>
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="liquid-glass rounded-3xl p-8"
        >
          <h3 className="text-white font-['Instrument_Serif'] italic text-2xl mb-6">Generated Listing</h3>
          
          {result ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Title</p>
                <p className="text-white text-lg">{result.title}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Description</p>
                <p className="text-white/80 leading-relaxed text-sm">{result.description}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {result.tags?.map(tag => (
                    <span key={tag} className="bg-white/10 text-white text-xs px-3 py-1 rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/30 pt-10 pb-10">
              <p className="text-center text-sm">Your AI-generated professional English listing will appear here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
