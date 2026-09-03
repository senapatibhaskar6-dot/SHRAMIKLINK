import React, { useState, useEffect } from 'react';

interface TransparentImageProps {
  src: string;
  alt: string;
  className?: string;
  threshold?: number; // 0-255, pixels brighter than this become transparent
}

export default function TransparentImage({ src, alt, className = '', threshold = 195 }: TransparentImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    
    img.onload = () => {
      if (!active) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setProcessedSrc(src);
        setLoading(false);
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Process every pixel to replace white/light-gray background with transparency
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate average brightness
        const brightness = (r + g + b) / 3;
        
        // We also want to protect the blue and orange colors in the logo.
        // Let's measure the saturation or color difference to avoid turning colored elements transparent.
        const maxVal = Math.max(r, g, b);
        const minVal = Math.min(r, g, b);
        const saturation = maxVal > 0 ? (maxVal - minVal) / maxVal : 0;
        
        // If it is very bright and has low saturation (it's white or light gray), make it transparent
        if (brightness > threshold && saturation < 0.18) {
          // Fully transparent
          data[i + 3] = 0;
        } else if (brightness > threshold - 25 && saturation < 0.18) {
          // Smooth fade-out to prevent pixelation/rough edges
          const range = 25;
          const ratio = (brightness - (threshold - range)) / range;
          data[i + 3] = Math.round(Math.max(0, (1 - ratio) * 255));
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      setProcessedSrc(canvas.toDataURL('image/png'));
      setLoading(false);
    };
    
    img.onerror = () => {
      if (!active) return;
      setProcessedSrc(src);
      setLoading(false);
    };

    return () => {
      active = false;
    };
  }, [src, threshold]);

  if (loading) {
    return <div className={`animate-pulse bg-slate-800 rounded-xl ${className}`} />;
  }

  return (
    <img 
      src={processedSrc} 
      alt={alt} 
      className={className}
      referrerPolicy="no-referrer"
    />
  );
}
