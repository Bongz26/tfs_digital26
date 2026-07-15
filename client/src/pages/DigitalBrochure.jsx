import React, { useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page bg-white shadow-2xl overflow-hidden flex flex-col justify-center items-center relative" ref={ref}>
      {/* Subtle paper texture/gradient over the page for realistic lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-10" />
      
      <img 
        src={props.imageSrc} 
        alt={`Page ${props.number}`} 
        className="w-full h-full object-cover bg-white"
        onError={(e) => {
          // Fallback if image is missing
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      
      {/* Fallback display if image not found */}
      <div className="hidden absolute inset-0 flex-col items-center justify-center bg-gray-50 text-center p-8">
        <div className="w-16 h-16 bg-[#8B0000] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
          {props.number}
        </div>
        <p className="text-sm text-gray-500">
          Please add <code className="bg-gray-200 px-1 rounded text-[#8B0000]">{props.imageSrc.split('/').pop()}</code> to the <code className="bg-gray-200 px-1 rounded text-[#8B0000]">public/images</code> folder.
        </p>
      </div>
    </div>
  );
});

const DigitalBrochure = () => {
  // Using the 8 pages from your most recent PDF
  const timestamp = Date.now();
  const pages = [
    { id: 1, imageSrc: `/images/page1.png?v=${timestamp}` }, // Cover
    { id: 2, imageSrc: `/images/page2.png?v=${timestamp}` }, // Welcome
    { id: 3, imageSrc: `/images/page3.png?v=${timestamp}` }, // Budget Buster & Executive
    { id: 4, imageSrc: `/images/page4.png?v=${timestamp}` }, // Royal & Presidential
    { id: 5, imageSrc: `/images/page5.png?v=${timestamp}` }, // One-Stop All-Inclusive
    { id: 6, imageSrc: `/images/page6.png?v=${timestamp}` }, // Fleet & Setup
    { id: 7, imageSrc: `/images/page7.png?v=${timestamp}` }, // Directory & Terms
    { id: 8, imageSrc: `/images/page8.png?v=${timestamp}` }, // Back Cover
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-[#3a0a0a] to-black flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header Section */}
      <div className="max-w-4xl w-full text-center mb-12 relative z-20">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-200 drop-shadow-sm">
          Interactive Brochure
        </h1>
        <p className="mt-2 text-lg text-gray-300 font-medium tracking-wide">
          Experience our services. Click or drag the corners to turn the pages.
        </p>
      </div>

      {/* Flipbook Container */}
      <div className="flex-grow flex items-center justify-center w-full relative z-20 pb-12">
        {/* Glow behind the book */}
        <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full transform scale-150 pointer-events-none"></div>
        
        <HTMLFlipBook 
          width={550} 
          height={773} 
          size="stretch"
          minWidth={315}
          maxWidth={800}
          minHeight={445}
          maxHeight={1125}
          maxShadowOpacity={0.6}
          showCover={true}
          mobileScrollSupport={true}
          className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto"
        >
          {pages.map((page) => (
            <Page key={page.id} number={page.id} imageSrc={page.imageSrc} />
          ))}
        </HTMLFlipBook>
      </div>

      {/* Professional Footer */}
      <div className="mt-auto text-center pb-8 relative z-20">
        <div className="inline-flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl sm:rounded-full shadow-2xl text-sm font-medium text-gray-100 transition-all hover:bg-white/15">
          <span className="text-yellow-400 font-bold text-base tracking-wide uppercase">Thusanang Funeral Services</span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="tracking-wide">FSP: <span className="font-bold text-white">11230</span></span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="tracking-wide">Toll Free: <span className="font-bold text-yellow-400 text-base">080 001 4574</span></span>
        </div>
      </div>

    </div>
  );
};

export default DigitalBrochure;
