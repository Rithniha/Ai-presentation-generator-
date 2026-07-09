import React, { useMemo } from 'react';

export default function FloatingBubbles() {
  const bubbles = useMemo(() => {
    // Gradient definitions with halo variables for lavender, cyan, mint, pink, and sky blue
    const bubbleTypes = [
      {
        gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(230, 220, 255, 0.85) 40%, rgba(147, 51, 234, 0.25) 85%, rgba(255, 255, 255, 0) 100%)',
        halo: 'rgba(168, 85, 247, 0.25)' // Lavender
      },
      {
        gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(185, 250, 252, 0.85) 40%, rgba(8, 145, 178, 0.25) 85%, rgba(255, 255, 255, 0) 100%)',
        halo: 'rgba(6, 182, 212, 0.25)' // Cyan
      },
      {
        gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(190, 253, 225, 0.85) 40%, rgba(5, 150, 105, 0.2) 85%, rgba(255, 255, 255, 0) 100%)',
        halo: 'rgba(52, 211, 153, 0.2)' // Mint
      },
      {
        gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(254, 205, 220, 0.85) 40%, rgba(219, 39, 119, 0.25) 85%, rgba(255, 255, 255, 0) 100%)',
        halo: 'rgba(244, 114, 182, 0.25)' // Pink
      },
      {
        gradient: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(186, 230, 253, 0.85) 40%, rgba(2, 132, 199, 0.25) 85%, rgba(255, 255, 255, 0) 100%)',
        halo: 'rgba(56, 189, 248, 0.25)' // Sky Blue
      }
    ];

    return Array.from({ length: 75 }).map((_, i) => {
      const type = bubbleTypes[Math.floor(Math.random() * bubbleTypes.length)];
      const depth = Math.floor(Math.random() * 3); // 0 = back, 1 = mid, 2 = front
      
      let size, duration, blur, opacity, zIndex;
      if (depth === 0) {
        // Background layer: small, slow, blurrier, and lower opacity
        size = Math.random() * 7 + 8; // 8px to 15px
        duration = Math.random() * 20 + 45; // 45s to 65s (slowest)
        blur = Math.random() * 0.5 + 1.5; // 1.5px to 2px
        opacity = Math.random() * 0.1 + 0.35; // 35% to 45%
        zIndex = 1;
      } else if (depth === 1) {
        // Midground layer: medium size, speed, and opacity
        size = Math.random() * 9 + 16; // 16px to 25px
        duration = Math.random() * 15 + 30; // 30s to 45s (medium)
        blur = Math.random() * 0.5 + 0.5; // 0.5px to 1px
        opacity = Math.random() * 0.1 + 0.45; // 45% to 55%
        zIndex = 2;
      } else {
        // Foreground layer: larger, faster, sharp, and higher opacity
        size = Math.random() * 10 + 26; // 26px to 35px
        duration = Math.random() * 10 + 20; // 20s to 30s (fastest)
        blur = 0; // sharp
        opacity = Math.random() * 0.1 + 0.55; // 55% to 65%
        zIndex = 3;
      }

      const left = Math.random() * 100;
      const delay = Math.random() * -50;
      const drift = Math.random() * 60 - 30;

      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          filter: blur > 0 ? `blur(${blur}px)` : 'none',
          opacity: opacity,
          background: type.gradient,
          zIndex: zIndex,
          '--drift-amount': `${drift}px`,
          '--halo-color': type.halo
        }
      };
    });
  }, []);

  return (
    <div className="bubble-bg-container" aria-hidden="true">
      {bubbles.map(bubble => (
        <div key={bubble.id} className="bubble-element" style={bubble.style} />
      ))}
    </div>
  );
}
