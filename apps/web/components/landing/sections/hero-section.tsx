'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// 1. Define interfaces para sa animation objects
interface BGBubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleAmp: number;
}

interface WaterEffect {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  opacity: number;
  isBubble: boolean;
  speedY: number;
  speedX: number;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 2. Gamitin ang interfaces dito sa halip na any[]
    const waterEffects: WaterEffect[] = [];
    let bgBubbles: BGBubble[] = [];
    let animationFrameId: number;
    let lastSpawnTime = 0;

    const resizeCanvas = () => {
      const section = canvas.closest('section');
      canvas.width = section?.clientWidth || window.innerWidth;
      canvas.height = section?.clientHeight || window.innerHeight;

      bgBubbles = [];
      for (let i = 0; i < 120; i++) {
        bgBubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size:
            Math.random() < 0.7
              ? Math.random() * 2 + 0.5
              : Math.random() * 4 + 2,
          speed: Math.random() * 0.7 + 0.15,
          drift: (Math.random() - 0.5) * 0.35,
          opacity: Math.random() * 0.3 + 0.04,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.025 + 0.008,
          wobbleAmp: Math.random() * 0.6 + 0.2,
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const now = Date.now();
      if (now - lastSpawnTime < 30) return;
      lastSpawnTime = now;

      for (let i = 0; i < 5; i++) {
        waterEffects.push({
          x: mouseX + (Math.random() - 0.5) * 20,
          y: mouseY + (Math.random() - 0.5) * 20,
          size: Math.random() * 2 + 1,
          maxSize: Math.random() * 40 + 15,
          opacity: 0.75,
          isBubble: Math.random() > 0.45,
          speedY: Math.random() * -1.0 - 0.2,
          speedX: (Math.random() - 0.5) * 0.8,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bgBubbles.length; i++) {
        const b = bgBubbles[i];
        b.wobble += b.wobbleSpeed;
        b.y -= b.speed;
        b.x += b.drift + Math.sin(b.wobble) * b.wobbleAmp;
        if (b.y < -10) {
          b.y = canvas.height + 10;
          b.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${b.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < waterEffects.length; i++) {
        const e = waterEffects[i];
        e.opacity -= 0.01;
        if (e.isBubble) {
          e.y += e.speedY;
          e.x += e.speedX;
          e.speedY *= 0.98;
        } else {
          if (e.size < e.maxSize) e.size += 0.6;
        }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        if (e.isBubble) {
          ctx.fillStyle = `rgba(255,255,255,${e.opacity})`;
          ctx.fill();
        } else {
          ctx.strokeStyle = `rgba(180,220,255,${e.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        if (e.opacity <= 0) {
          waterEffects.splice(i, 1);
          i--;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleGetStarted = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('start_map_tour', 'true');
    }
    router.push('/map');
  };

  return (
    <section
      className='relative z-0 flex flex-col items-center justify-center min-h-[90vh] pb-20 overflow-hidden -mt-16 pt-16'
      style={{
        background:
          'linear-gradient(to bottom, #0066CC 0%, #0066CC 12%, #3385d6 30%, #66a3ff 55%, #b3d1ff 80%, #ffffff 100%)',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes neonPulse {
          0%   { box-shadow: 0 0 8px rgba(47,50,125,0.4), 0 0 15px rgba(47,50,125,0.2); transform: scale(1); }
          50%  { box-shadow: 0 0 25px rgba(47,50,125,0.8), 0 0 50px rgba(153,200,255,0.5); transform: scale(1.02); }
          100% { box-shadow: 0 0 8px rgba(47,50,125,0.4), 0 0 15px rgba(47,50,125,0.2); transform: scale(1); }
        }
        .animate-neon { animation: neonPulse 3s infinite ease-in-out; }
      `,
        }}
      />

      <canvas
        ref={canvasRef}
        className='absolute inset-0 z-0 pointer-events-none w-full h-full'
      />

      <div className='relative z-10 flex flex-col items-center w-full max-w-4xl px-5 sm:px-8 text-center gap-5 md:gap-8 mt-16'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2]'>
          Track floods in real-time. <br className='hidden sm:block' />
          <span className='text-[#2F327D] drop-shadow-sm'>
            Ensure your safety.
          </span>
        </h1>

        <p className='text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-2xl leading-relaxed font-normal drop-shadow-sm'>
          Stay ahead of the rising waters. Our interactive map delivers instant
          updates of affected areas, empowering communities to make smart
          decisions when seconds count.
        </p>

        <div className='mt-4 md:mt-8'>
          <Button
            className='animate-neon bg-[#2F327D] hover:bg-[#1a1c4b] text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-10 rounded-full transition-all duration-300 hover:-translate-y-1'
            onClick={handleGetStarted}
          >
            Get Started Now
          </Button>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none'>
        <svg
          className='relative block w-full h-[60px] sm:h-[100px] md:h-[140px]'
          preserveAspectRatio='none'
          viewBox='0 0 1200 120'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M0,60 C350,140 850,-20 1200,60 V120 H0 Z'
            className='fill-white'
          />
        </svg>
      </div>
    </section>
  );
}
