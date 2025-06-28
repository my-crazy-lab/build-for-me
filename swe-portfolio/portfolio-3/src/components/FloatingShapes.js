import React from 'react';

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large blobs */}
      <div className="blob-bg w-72 h-72 bg-creative-purple top-0 -left-4 animation-delay-0"></div>
      <div className="blob-bg w-72 h-72 bg-creative-pink top-0 -right-4 animation-delay-2000"></div>
      <div className="blob-bg w-72 h-72 bg-creative-yellow bottom-0 left-20 animation-delay-4000"></div>
      
      {/* Medium floating shapes */}
      <div className="floating-shape w-32 h-32 bg-creative-orange top-1/4 right-1/4"></div>
      <div className="floating-shape w-24 h-24 bg-creative-green top-3/4 left-1/4 animation-delay-1000"></div>
      <div className="floating-shape w-40 h-40 bg-creative-blue top-1/2 right-1/3 animation-delay-3000"></div>
      
      {/* Small decorative elements */}
      <div className="absolute top-20 left-1/3 w-4 h-4 bg-creative-red rounded-full animate-bounce-slow"></div>
      <div className="absolute top-1/3 right-20 w-6 h-6 bg-creative-indigo rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/2 w-8 h-8 bg-creative-yellow rounded-full animate-wiggle"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/2 left-10 w-20 h-20 bg-gradient-to-r from-creative-purple to-creative-pink rounded-full opacity-30 animate-float"></div>
      <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-gradient-to-r from-creative-orange to-creative-yellow rounded-full opacity-40 animate-bounce-slow"></div>
    </div>
  );
};

export default FloatingShapes;
