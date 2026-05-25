import { useState } from 'react';
import { Mic, Image as ImageIcon, Loader2, Sparkles, Globe, Languages } from 'lucide-react';
import { SpotlightElement } from '../TutorialContext';
import api from '../api';

const LANGUAGES = [
  { code: 'ta', label: 'Tamil', flag: '🏴' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', flag: '🔵' },
  { code: 'kn', label: 'Kannada', flag: '🟡' },
  { code: 'bn', label: 'Bengali', flag: '🟢' },
];

export default function VoiceStorefront() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ta');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/storefront/generate', {
        image_context: 'handwoven_saree.jpg',
        voice_transcript: 'This is a beautiful hand-woven cotton saree from Udupi with natural dyes.',
        language: selectedLang,
      });
      setResult(res.data);
    } catch {
      // Use demo data if backend is unavailable
      setResult({
        title: 'Handwoven Udupi Cotton Saree',
        description: 'A beautiful naturally-dyed cotton saree hand-woven by artisans in the Udupi district. Each thread carries the heritage of Karnataka's craft tradition.',
        tags: ['handloom', 'udupi', 'natural-dye', 'cotton', 'traditional'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl">

      {/* Header card */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
          <Sparkles className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-secondary">Create a New Listing</h2>
          <p className="text-secondary/50 text-sm">Speak in your language. Our AI will create your product page.</p>
        </div>
      </div>

      {/* Language selector */}
      <SpotlightElement id="voice_lang" instructionText="First, choose your language so the AI can understand you.">
        <div className="card p-5">
          <p className="section-label mb-3 flex items-center gap-2"><Languages size={14} /> Choose Your Language</p>
          <div className="flex gap-3 flex-wrap">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all border-2 ${
                  selectedLang === l.code
                    ? 'bg-primary text-white border-primary'
                    : 'bg-muted text-secondary/70 border-transparent hover:border-border'
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      </SpotlightElement>

      {/* Record + Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SpotlightElement
          id="voice_mic"
          instructionText="Tap the microphone and describe your product!"
          subtext="Speak naturally in your language. For example: 'This is a blue silk saree I made in 12 hours.'"
        >
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`card-hover w-full h-52 flex flex-col items-center justify-center gap-4 border-2 border-dashed transition-all ${
              isRecording
                ? 'border-primary bg-primary-light'
                : 'border-border hover:border-primary/40'
            }`}
          >
            {/* Pulse rings when recording */}
            <div className="relative flex items-center justify-center">
              {isRecording && (
                <>
                  <div className="absolute w-20 h-20 rounded-full bg-primary/20 animate-ping" />
                  <div className="absolute w-14 h-14 rounded-full bg-primary/15 animate-ping" style={{ animationDelay: '0.3s' }} />
                </>
              )}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 transition-all ${
                isRecording ? 'bg-primary shadow-glow-primary' : 'bg-muted'
              }`}>
                <Mic size={28} className={isRecording ? 'text-white' : 'text-secondary/40'} />
              </div>
            </div>
            <div className="text-center">
              <p className={`font-bold text-base ${isRecording ? 'text-primary' : 'text-secondary/50'}`}>
                {isRecording ? '🔴 Recording… Tap to stop' : 'Tap to Speak'}
              </p>
              {!isRecording && <p className="text-secondary/30 text-xs mt-1">Describe your product in your language</p>}
            </div>
          </button>
        </SpotlightElement>

        <SpotlightElement
          id="voice_image"
          instructionText="Upload a clear photo of your product."
          subtext="Our AI will automatically detect what it is and describe it."
        >
          <button className="card-hover w-full h-52 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border hover:border-primary/40 transition-all">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon size={28} className="text-secondary/40" />
            </div>
            <div className="text-center">
              <p className="font-bold text-base text-secondary/50">Upload Photo</p>
              <p className="text-secondary/30 text-xs mt-1">Click or drag your product image here</p>
            </div>
          </button>
        </SpotlightElement>
      </div>

      {/* Generate CTA */}
      <SpotlightElement
        id="voice_generate"
        instructionText="Click here to create your listing with AI!"
        subtext="The AI will write the title, description, and tags in your language."
      >
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary w-full py-4 text-lg"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {loading ? 'Creating your listing…' : 'Create My Listing with AI ✨'}
        </button>
      </SpotlightElement>

      {/* Result card */}
      {result && (
        <div className="card border-2 border-success/20 bg-success-light/30 p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={18} className="text-success" />
            <p className="font-bold text-success text-sm uppercase tracking-wide">Listing Created Successfully</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-border shadow-card">
            <h3 className="text-2xl font-black text-secondary mb-2">{result.title}</h3>
            <p className="text-secondary/70 leading-relaxed mb-5">{result.description}</p>
            <div className="flex flex-wrap gap-2">
              {result.tags?.map((t: string, i: number) => (
                <span key={i} className="badge-primary px-3 py-1 text-sm">#{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
