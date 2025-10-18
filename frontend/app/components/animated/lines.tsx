"use client";

import { useEffect, useRef } from 'react';

export default function AnimatedLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scrollY = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const drawLines = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.08)';
      ctx.lineWidth = 1;

      // Draw horizontal lines that move with scroll
      for (let i = 0; i < 10; i++) {
        const y = ((i * canvas.height) / 10 + scrollY * 0.5) % canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw vertical lines
      for (let i = 0; i < 20; i++) {
        const x = (i * canvas.width) / 20;
        const offset = Math.sin(scrollY * 0.001 + i) * 20;
        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, canvas.height);
        ctx.stroke();
      }

      requestAnimationFrame(drawLines);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll);
    
    drawLines();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

