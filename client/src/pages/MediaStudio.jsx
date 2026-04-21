import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhotoIcon, 
  SparklesIcon, 
  FilmIcon, 
  CommandLineIcon, 
  AdjustmentsHorizontalIcon,
  CloudArrowUpIcon,
  TrashIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const SAPS_THEME = {
  name: 'SAPS Official',
  primary: '#002366', // Royal Navy
  secondary: '#FFD700', // Gold
  accent: '#FFFFFF',
  font: 'serif',
  overlayOpacity: 0.4
};

const ETERNAL_LIGHT = {
  name: 'Eternal Light',
  primary: '#f8fafc', // Slate 50
  secondary: '#1e293b', // Slate 800
  accent: '#38bdf8', // Sky 400
  font: 'sans-serif',
  overlayOpacity: 0.2
};

const DIGNIFIED_CAPTIONS = [
  { caption: "A Life of Humble Service", tagline: "HONORING THE JOURNEY" },
  { caption: "A Hero's Final Salute", tagline: "SACRIFICE & HONOR" },
  { caption: "Forever in our Hearts", tagline: "LASTING LEGACY" },
  { caption: "The Light Remains", tagline: "ETERNAL PEACE" },
  { caption: "Courage in Every Breath", tagline: "BRAVE SOUL" },
  { caption: "A Gentle Spirit, Now Rested", tagline: "SACRED MEMORY" },
  { caption: "Honoring a Noble Path", tagline: "SERVICE REFLECTION" },
  { caption: "Dignity in Every Deed", tagline: "TIMELESS HONOR" },
  { caption: "Guided by Grace", tagline: "HEAVENLY TRANSITION" },
  { caption: "A Legacy Unforgotten", tagline: "IN LOVING MEMORY" }
];

const MediaStudio = () => {
  const [images, setImages] = useState([]); // [{ url, caption, tagline }]
  const [activeTheme, setActiveTheme] = useState(SAPS_THEME);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWatermarkEnabled, setIsWatermarkEnabled] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('9:16'); // 9:16 for TikTok, 1:1 for FB
  const [isProductionMode, setIsProductionMode] = useState(false);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  // Audio Logic for Production
  useEffect(() => {
    if (isProductionMode) {
      if (!audioRef.current) {
        audioRef.current = new Audio(`/input_pics/Ntate%20Theola%20Moya%20%5Buu3glwQDRpI%5D.mp3`);
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser. Click anywhere to play."));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isProductionMode]);

  // Auto-load from input_pics if available
  useEffect(() => {
    fetch('/input_pics/index.json')
      .then(res => res.json())
      .then(data => {
        const enrichedImages = data.map((name, idx) => ({
          url: `/input_pics/${encodeURIComponent(name)}`,
          caption: DIGNIFIED_CAPTIONS[idx % DIGNIFIED_CAPTIONS.length].caption,
          tagline: DIGNIFIED_CAPTIONS[idx % DIGNIFIED_CAPTIONS.length].tagline
        }));
        setImages(enrichedImages);
      })
      .catch(err => console.log('No pre-loaded images found'));
  }, []);

  // Auto-advance for "Reel" preview
  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000); // 5 seconds per slide (slower for cinematic feel)
      return () => clearInterval(timer);
    }
  }, [images.length]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, idx) => ({
      url: URL.createObjectURL(file),
      caption: DIGNIFIED_CAPTIONS[(images.length + idx) % DIGNIFIED_CAPTIONS.length].caption,
      tagline: DIGNIFIED_CAPTIONS[(images.length + idx) % DIGNIFIED_CAPTIONS.length].tagline
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    if (newImages[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(newImages[index].url);
    }
    newImages.splice(index, 1);
    setImages(newImages);
    if (currentIndex >= newImages.length) setCurrentIndex(0);
  };

  const updateImageCaption = (index, field, value) => {
    setImages(prev => prev.map((img, idx) => 
      idx === index ? { ...img, [field]: value } : img
    ));
  };

  if (isProductionMode) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center overflow-hidden">
        <button 
          onClick={() => setIsProductionMode(false)}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md"
        >
          <AdjustmentsHorizontalIcon className="w-6 h-6" />
        </button>
        
        <div 
          className="relative overflow-hidden shadow-2xl cursor-none"
          style={{
            width: aspectRatio === '9:16' ? 'calc(100vh * 9 / 16)' : '100vh',
            maxWidth: '100vw',
            aspectRatio: aspectRatio.replace(':', '/'),
            height: '100vh'
          }}
        >
           <AnimatePresence mode='wait'>
            {images.length > 0 && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <div 
                  className="absolute inset-0 blur-3xl opacity-30 grayscale-[0.5]"
                  style={{ 
                    backgroundImage: `url("${images[currentIndex].url}")`, 
                    backgroundSize: 'cover',
                    filter: 'contrast(1.2) saturate(1.3) brightness(1.1)',
                    transform: 'translate3d(0,0,0)'
                  }}
                />
                
                <motion.div
                  animate={{ scale: [1, 1.05], x: [0, -20, 0] }}
                  transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                  className="absolute inset-0 z-10"
                  style={{ 
                    backgroundImage: `url("${images[currentIndex].url}")`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    filter: 'contrast(1.1) brightness(1.05) saturate(1.15)',
                    imageRendering: '-webkit-optimize-contrast',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translate3d(0,0,0)'
                  }}
                />

                <div 
                  className="absolute inset-0 z-20"
                  style={{ background: `linear-gradient(to bottom, transparent 30%, ${activeTheme.primary}cc 90%)` }}
                />

                <div className="absolute inset-x-12 bottom-20 z-30 space-y-4">
                    <motion.div
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       className="flex items-center gap-3 mb-2"
                    >
                       <div className="h-[3px] w-12 bg-yellow-400"></div>
                       <span className="text-xl font-bold uppercase tracking-[0.3em] text-yellow-400 drop-shadow-md">
                         {images[currentIndex].tagline}
                       </span>
                    </motion.div>
                   <motion.h1
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`${activeTheme.font === 'serif' ? 'font-serif' : 'font-sans'} text-6xl text-white drop-shadow-2xl font-bold`}
                   >
                      {images[currentIndex].caption}
                   </motion.h1>
                   <div className="pt-8 border-t border-white/20">
                      <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
                        Thusanang Funeral Services • Your Dignity, Our Priority
                      </p>
                   </div>
                </div>

                 {isWatermarkEnabled && (
                   <div className="absolute top-12 left-12 z-30 flex items-center gap-3">
                     <img 
                       src="/logo_transparent.png" 
                       alt="Watermark" 
                       className="w-24 h-24 object-contain drop-shadow-2xl opacity-90 transition-opacity hover:opacity-100 mix-blend-multiply"
                       style={{ 
                         filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))',
                       }}
                     />
                   </div>
                 )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left: Controls */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <SparklesIcon className="w-6 h-6 text-yellow-600" />
              Media Studio
            </h2>

            {/* Production Mode Button */}
            <button
              onClick={() => setIsProductionMode(true)}
              disabled={images.length === 0}
              className={`w-full mb-8 py-4 rounded-xl font-bold text-white shadow-lg flex flex-col items-center justify-center gap-1 transition-all ${images.length > 0 ? 'bg-gradient-to-r from-red-800 to-navy-900 hover:scale-[1.02]' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-2">
                <FilmIcon className="w-5 h-5" />
                <span>Start Production Playback</span>
              </div>
              <span className="text-[10px] opacity-70 uppercase tracking-widest font-black">Including Audio: Ntate Theola Moya</span>
            </button>

            {/* Theme Selector */}
            <div className="space-y-4 mb-8">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Select Theme</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTheme(SAPS_THEME)}
                  className={`p-4 rounded-xl border-2 transition-all ${activeTheme.name === 'SAPS Official' ? 'border-navy-900 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                >
                  <div className="w-full h-12 bg-[#002366] rounded mb-2 flex items-center justify-center">
                    <span className="text-yellow-400 font-serif text-xs">SAPS</span>
                  </div>
                  <span className="text-xs font-bold block text-center">SAPS Official</span>
                </button>
                <button 
                  onClick={() => setActiveTheme(ETERNAL_LIGHT)}
                  className={`p-4 rounded-xl border-2 transition-all ${activeTheme.name === 'Eternal Light' ? 'border-sky-500 bg-sky-50' : 'border-gray-100 hover:border-sky-100'}`}
                >
                  <div className="w-full h-12 bg-white rounded mb-2 flex items-center justify-center shadow-inner border border-gray-200">
                    <span className="text-sky-500 font-sans text-xs">White</span>
                  </div>
                  <span className="text-xs font-bold block text-center">Eternal Light</span>
                </button>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-4 mb-8">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Format</label>
              <div className="flex gap-2">
                {['9:16', '1:1'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${aspectRatio === ratio ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {ratio === '9:16' ? 'TikTok / Stories' : 'Facebook Square'}
                  </button>
                ))}
              </div>
            </div>

            {/* Customization (Per Image) */}
            {images.length > 0 && (
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-800">Editing Photo {currentIndex + 1} of {images.length}</p>
                
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Main Caption</label>
                  <input 
                    type="text" 
                    value={images[currentIndex].caption}
                    onChange={(e) => updateImageCaption(currentIndex, 'caption', e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Tagline</label>
                  <input 
                    type="text" 
                    value={images[currentIndex].tagline}
                    onChange={(e) => updateImageCaption(currentIndex, 'tagline', e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 mt-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input 
                  type="checkbox" 
                  checked={isWatermarkEnabled}
                  onChange={(e) => setIsWatermarkEnabled(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Watermark</span>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Images ({images.length})</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <CloudArrowUpIcon className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <p className="mt-2 text-sm text-gray-500 font-medium">Click to upload photos</p>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`relative aspect-square group cursor-pointer transition-all ${currentIndex === idx ? 'ring-2 ring-blue-500 ring-offset-2 scale-95' : 'hover:scale-105'}`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover rounded-lg shadow-sm" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                    {currentIndex === idx && (
                      <div className="absolute inset-0 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <CheckBadgeIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[600px]">
          <div className="sticky top-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <FilmIcon className="w-4 h-4" /> Live Cinematic Preview
            </h3>
            
            {/* The "Phone" Container */}
            <div 
              className={`relative bg-black shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 ease-in-out`}
              style={{
                width: aspectRatio === '9:16' ? '340px' : '450px',
                height: aspectRatio === '9:16' ? '600px' : '450px',
                borderRadius: '3rem',
                border: '12px solid #1a1a1a'
              }}
            >
              {/* Speaker/Camera detail for realism */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-[#1a1a1a] rounded-b-2xl z-50"></div>
              
              <AnimatePresence mode='wait'>
                {images.length > 0 ? (
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: { duration: 1.5, ease: "easeOut" }
                    }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 1 } }}
                    className="absolute inset-0"
                  >
                    {/* Background Blur for empty spaces */}
                    <div 
                      className="absolute inset-0 blur-xl opacity-40 grayscale-[0.5]"
                      style={{ 
                        backgroundImage: `url("${images[currentIndex].url}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'contrast(1.1) saturate(1.2)'
                      }}
                    />
                    
                    {/* Ken Burns Animated Image (Hardware Accelerated for High Quality) */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05],
                        x: [0, -10, 0],
                        y: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        ease: "linear"
                      }}
                      className="absolute inset-0 z-10"
                      style={{ 
                        backgroundImage: `url("${images[currentIndex].url}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'contrast(1.1) brightness(1.08) saturate(1.1)',
                        imageRendering: '-webkit-optimize-contrast',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        transform: 'translate3d(0,0,0)'
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div 
                      className="absolute inset-0 z-20 pointer-events-none"
                      style={{ 
                        background: `linear-gradient(to bottom, transparent 40%, ${activeTheme.primary}ea 95%)`
                      }}
                    />

                    {/* Floating SAPS Colors Border (subtle glow) */}
                    <div 
                      className="absolute inset-0 z-20 pointer-events-none border-[1px] opacity-30"
                      style={{ borderColor: activeTheme.secondary }}
                    />

                    {/* Content Overlays */}
                    <div className="absolute inset-x-8 bottom-16 z-30 space-y-2">
                       <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center gap-2"
                       >
                          <div className="h-[2px] w-8 bg-yellow-400" style={{ backgroundColor: activeTheme.secondary }}></div>
                          <span 
                            className="text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-sm"
                            style={{ color: activeTheme.accent }}
                          >
                            {images[currentIndex].tagline}
                          </span>
                       </motion.div>
                       
                       <motion.h2
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className={`${activeTheme.font === 'serif' ? 'font-serif' : 'font-sans'} text-2xl lg:text-3xl leading-tight text-white drop-shadow-2xl font-bold`}
                       >
                          {images[currentIndex].caption}
                       </motion.h2>

                       <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="pt-4 mt-4 border-t border-white/10"
                       >
                          <p className="text-[8px] text-white/40 font-bold uppercase tracking-[0.1em]">
                            Thusanang Funeral • Your Dignity, Our Priority
                          </p>
                       </motion.div>
                    </div>

                     {/* Branding Watermark */}
                     {isWatermarkEnabled && (
                       <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="absolute top-10 left-8 z-30"
                       >
                         <img 
                           src="/logo_transparent.png" 
                           alt="Watermark" 
                           className="w-16 h-16 object-contain drop-shadow-2xl opacity-80 mix-blend-multiply"
                         />
                       </motion.div>
                     )}

                    {/* Light Leak FX (Premium Polish) */}
                    <div className="absolute inset-0 z-25 pointer-events-none mix-blend-screen opacity-20 bg-gradient-to-tr from-transparent via-blue-200 to-transparent animate-pulse"></div>

                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-700 bg-gray-50">
                    <PhotoIcon className="w-16 h-16 opacity-10 mb-4" />
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Waiting for Media</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Helper Tips */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-navy-900 mb-2">
                  <CheckBadgeIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">TikTok Tip</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">The vertical 9:16 format is optimized for full-screen impact. Use fast music with the marching shots.</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-navy-900 mb-2">
                  <CommandLineIcon className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">FB Tip</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">Choose the 1:1 format for profile updates or status memorial posts. Adds a premium look to the feed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaStudio;
