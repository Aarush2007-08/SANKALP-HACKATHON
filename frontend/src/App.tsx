import { useEffect, useRef } from 'react';
import { ArrowRight, Globe, Camera, MessageCircle } from 'lucide-react';
import AboutSection from './components/AboutSection';
import FeaturedVideoSection from './components/FeaturedVideoSection';
import PhilosophySection from './components/PhilosophySection';
import ServicesSection from './components/ServicesSection';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fadeOutRaf: number;
    let fadeInRaf: number;

    const fadeTo = (targetOpacity: number, duration: number) => {
      const startOpacity = parseFloat(video.style.opacity || '0');
      const startTime = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        video.style.opacity = currentOpacity.toString();

        if (progress < 1) {
          if (targetOpacity === 1) {
            fadeInRaf = requestAnimationFrame(animate);
          } else {
            fadeOutRaf = requestAnimationFrame(animate);
          }
        }
      };

      if (targetOpacity === 1) {
        cancelAnimationFrame(fadeOutRaf);
        fadeInRaf = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(fadeInRaf);
        fadeOutRaf = requestAnimationFrame(animate);
      }
    };

    const handleCanPlay = () => {
      video.play();
      fadeTo(1, 500);
    };

    const handleTimeUpdate = () => {
      const remainingTime = video.duration - video.currentTime;
      if (remainingTime <= 0.55 && parseFloat(video.style.opacity) > 0.5) {
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
        fadeTo(1, 500);
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(fadeInRaf);
      cancelAnimationFrame(fadeOutRaf);
    };
  }, []);

  return (
    <div className="bg-black text-white selection:bg-white/20 selection:text-white">
      {/* SECTION 1 -- HERO */}
      <section className="min-h-screen overflow-hidden relative flex flex-col">
        {/* Background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          muted
          autoPlay
          playsInline
          preload="auto"
          style={{ opacity: 0 }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
        />

        {/* Navbar */}
        <div className="relative z-20 px-6 py-6 w-full">
          <nav className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg">Asme</span>
              <div className="hidden md:flex items-center gap-8 ml-8">
                <a href="#" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Features</a>
                <a href="#" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Pricing</a>
                <a href="#" className="text-white/80 hover:text-white text-sm font-medium transition-colors">About</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white text-sm font-medium hover:text-white/80 transition-colors">Sign Up</button>
              <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors">Login</button>
            </div>
          </nav>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap font-['Instrument_Serif'] serif mb-10">
            Know it <em className="italic">all</em>.
          </h1>
          
          <div className="max-w-xl w-full mx-auto liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3 mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/40 min-w-0"
            />
            <button className="bg-white hover:bg-white/90 transition-colors rounded-full p-3 text-black shrink-0">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-white text-sm leading-relaxed max-w-xl mx-auto px-4 mb-8">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>
          
          <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Manifesto
          </button>
        </div>

        {/* Social icons footer */}
        <div className="relative z-10 flex items-center justify-center gap-4 pb-12 mt-auto">
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
            <Camera className="w-5 h-5" />
          </button>
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* SECTIONS 2 to 5 */}
      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
    </div>
  );
}
