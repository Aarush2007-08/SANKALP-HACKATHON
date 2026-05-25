import { useState } from 'react';
import { Mic, Image as ImageIcon, Loader2 } from 'lucide-react';
import { SpotlightElement } from '../TutorialContext';
import api from '../api';

export default function VoiceStorefront() {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Mocking the flow for the UI demo since we don't have real audio uploading hooked up yet
      // We will just hit the storefront generate directly with dummy data to show the AI working
      const res = await api.post('/storefront/generate', {
        image_context: "dummy_image.jpg",
        voice_transcript: "This is a beautiful hand-woven cotton saree from Udupi.",
        language: "ta" // Tamil
      });
      setResult(res.data);
    } catch (e) {
      console.error(e);
      alert("Error generating storefront");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-secondary mb-6">Create New Listing</h2>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <SpotlightElement id="voice_mic" instructionText="Tap this microphone and simply describe your product in your own language. We'll translate it automatically!" className="flex-1">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`w-full h-48 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${
                isRecording ? 'border-primary bg-orange-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <div className={`p-4 rounded-full ${isRecording ? 'bg-primary text-white animate-pulse' : 'bg-white text-gray-400 shadow-sm'}`}>
                <Mic size={48} />
              </div>
              <span className={`font-semibold text-lg ${isRecording ? 'text-primary' : 'text-gray-500'}`}>
                {isRecording ? "Listening... Tap to Stop" : "Tap to Speak Description"}
              </span>
            </button>
          </SpotlightElement>

          <SpotlightElement id="voice_image" instructionText="Upload a photo of your product here. Our AI will automatically detect what it is." className="flex-1">
             <button className="w-full h-48 border-4 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all">
                <div className="p-4 rounded-full bg-white text-gray-400 shadow-sm">
                  <ImageIcon size={48} />
                </div>
                <span className="font-semibold text-lg text-gray-500">Upload Product Photo</span>
             </button>
          </SpotlightElement>
        </div>

        <SpotlightElement id="voice_generate" instructionText="Once you have spoken and added a photo, click here to instantly create your professional storefront listing in multiple languages!">
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-xl hover:bg-orange-600 transition-colors flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? 'Generating Storefront with AI...' : 'Create Listing Magic!'}
          </button>
        </SpotlightElement>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-200 bg-green-50/30 animate-fade-in-up">
           <h3 className="text-xl font-black text-secondary mb-4">AI Generated Storefront Card</h3>
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h4 className="text-2xl font-bold text-primary mb-2">{result.title}</h4>
              <p className="text-gray-700 text-lg mb-4">{result.description}</p>
              <div className="flex gap-2 flex-wrap">
                {result.tags?.map((t: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-secondary text-sm font-semibold rounded-full">#{t}</span>
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
