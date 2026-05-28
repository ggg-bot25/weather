/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeatherCondition } from '../types';

interface WeatherVisualProps {
  condition: WeatherCondition;
}

export default function WeatherVisual({ condition }: WeatherVisualProps) {
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; delay: number; duration: number; size: number }[]>([]);
  const [flash, setFlash] = useState(false);

  // Set up particles for weather types (Rain, Snow, Drizzle)
  useEffect(() => {
    const generatorCount = condition === 'Rain' ? 40 : condition === 'Snow' ? 30 : condition === 'Drizzle' ? 25 : 0;
    const newParticles = Array.from({ length: generatorCount }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 100, // random percentage
      top: Math.random() * -50, // start above
      delay: Math.random() * 5,
      duration: condition === 'Rain' ? 1 + Math.random() * 1.5 : condition === 'Snow' ? 3 + Math.random() * 4 : 2 + Math.random() * 2,
      size: condition === 'Rain' ? 1 + Math.random() * 2 : condition === 'Snow' ? 4 + Math.random() * 6 : 1,
    }));
    setParticles(newParticles);
  }, [condition]);

  // Thunderstorm lightning flashes
  useEffect(() => {
    if (condition !== 'Thunderstorm') return;
    const interval = setInterval(() => {
      // flash 1
      setFlash(true);
      setTimeout(() => setFlash(false), 150);

      // optional double flash
      if (Math.random() > 0.4) {
        setTimeout(() => {
          setFlash(true);
          setTimeout(() => setFlash(false), 100);
        }, 300);
      }
    }, 4000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, [condition]);

  // Map weather to backdrop gradients
  const gradientMap: Record<WeatherCondition, string> = {
    Clear: 'from-amber-400 via-orange-400 to-sky-500',
    Clouds: 'from-slate-400 via-zinc-500 to-sky-700',
    Rain: 'from-slate-700 via-blue-900 to-slate-900',
    Drizzle: 'from-slate-500 via-blue-800 to-zinc-700',
    Thunderstorm: 'from-slate-900 via-purple-950 to-neutral-950',
    Snow: 'from-blue-100 via-sky-300 to-blue-500',
    Mist: 'from-zinc-300 via-teal-100/40 to-slate-500',
    Windy: 'from-teal-600 via-stone-500 to-slate-700'
  };

  const gradient = gradientMap[condition] || 'from-sky-400 to-blue-600';

  return (
    <div id="weather-visual-container" className={`relative w-full h-full min-h-[300px] md:min-h-[400px] overflow-hidden rounded-3xl bg-gradient-to-b ${gradient} transition-all duration-1000 shadow-2xl`}>
      {/* Lightning Flash Overlay */}
      {condition === 'Thunderstorm' && (
        <div 
          id="lightning-flash-overlay"
          className={`absolute inset-0 bg-white/65 z-10 transition-opacity duration-75 pointer-events-none ${flash ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Visual Ambiences */}
      <AnimatePresence mode="wait">
        {condition === 'Clear' && (
          <motion.div
            key="clear-sky"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Spinning/pulsing Sun */}
            <motion.div
              id="clear-sky-sun"
              className="w-48 h-48 rounded-full bg-yellow-300 shadow-[0_0_120px_rgba(252,211,77,0.8)] filter blur-[1px]"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Sun flare rings */}
            <div id="clear-sky-sun-flare-1" className="absolute w-72 h-72 rounded-full border border-yellow-200/20 animate-ping duration-[8000ms]" />
            <div id="clear-sky-sun-flare-2" className="absolute w-96 h-96 rounded-full border border-orange-200/10 animate-pulse duration-[6000ms]" />
          </motion.div>
        )}

        {condition === 'Clouds' && (
          <motion.div
            key="cloudy-sky"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Rolling Clouds */}
            <motion.div
              id="cloud-1"
              className="absolute top-10 left-[-10%] w-60 h-24 bg-white/30 rounded-full filter blur-xl"
              animate={{ x: ['0vw', '110vw'] }}
              transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              id="cloud-2"
              className="absolute top-24 right-[-10%] w-80 h-32 bg-white/20 rounded-full filter blur-2xl"
              animate={{ x: ['0vw', '-110vw'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              id="cloud-3"
              className="absolute top-44 left-[10%] w-72 h-20 bg-zinc-200/25 rounded-full filter blur-lg"
              animate={{ x: ['-20vw', '110vw'] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 4 }}
            />
          </motion.div>
        )}

        {(condition === 'Rain' || condition === 'Drizzle' || condition === 'Thunderstorm') && (
          <motion.div
            key="rainy-sky"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Cloud layers at top */}
            <div id="rain-cloud-layer-1" className="absolute top-[-30px] left-0 right-0 h-40 bg-slate-900/60 filter blur-2xl rounded-b-full" />
            <div id="rain-cloud-layer-2" className="absolute top-[-50px] left-[10%] right-[10%] h-48 bg-purple-950/40 filter blur-3xl rounded-b-full" />

            {/* Falling rain drops */}
            {particles.map((p) => (
              <motion.div
                key={`rain-p-${p.id}`}
                id={`rain-p-${p.id}`}
                className="absolute bg-blue-100 opacity-60 rounded-full"
                style={{
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size * 12}px`,
                }}
                initial={{ y: p.top }}
                animate={{ y: ['0%', '110%'] }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}
          </motion.div>
        )}

        {condition === 'Snow' && (
          <motion.div
            key="snowy-sky"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Falling Snow particles */}
            {particles.map((p) => (
              <motion.div
                key={`snow-p-${p.id}`}
                id={`snow-p-${p.id}`}
                className="absolute bg-white rounded-full opacity-85"
                style={{
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  filter: 'blur(0.5px)'
                }}
                initial={{ y: p.top, x: 0 }}
                animate={{ 
                  y: ['0%', '110%'],
                  x: [0, Math.sin(p.id) * 35, 0]
                }}
                transition={{
                  y: {
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  x: {
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
                }}
              />
            ))}
          </motion.div>
        )}

        {condition === 'Mist' && (
          <motion.div
            key="misty-atmosphere"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            {/* Rolling fog layer */}
            <motion.div
              id="mist-layer-1"
              className="absolute bottom-0 left-0 right-0 h-48 bg-white/20 filter blur-xl"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              id="mist-layer-2"
              className="absolute top-20 left-0 right-0 h-32 bg-teal-50/10 filter blur-2xl"
              animate={{ 
                x: [-20, 20, -20],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {condition === 'Windy' && (
          <motion.div
            key="windy-environment"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Wind swooshes */}
            <motion.div
              id="wind-swoosh-1"
              className="absolute top-1/4 left-[-100px] w-64 h-1 bg-white/25 rounded-full filter blur-[1px]"
              animate={{ x: ['-20%', '200%'], skewX: -20 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />
            <motion.div
              id="wind-swoosh-2"
              className="absolute top-2/4 left-[-100px] w-80 h-[2px] bg-white/15 rounded-full filter blur-[2px]"
              animate={{ x: ['-20%', '200%'], skewX: -15 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />
            <motion.div
              id="wind-swoosh-3"
              className="absolute top-3/4 left-[-100px] w-48 h-[1px] bg-white/30 rounded-full"
              animate={{ x: ['-20%', '200%'], skewX: -25 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
            />

            {/* Drifting Leaves */}
            {Array.from({ length: 4 }).map((_, idx) => (
              <motion.div
                key={`leaf-${idx}`}
                id={`leaf-${idx}`}
                className="absolute w-3 h-2 bg-emerald-700/60 rounded-br-2xl"
                style={{ top: `${20 + idx * 22}%` }}
                animate={{ 
                  x: ['-10vw', '110vw'], 
                  y: [0, (idx % 2 === 0 ? 30 : -35), 0],
                  rotate: [0, 360 * 2] 
                }}
                transition={{ duration: 4 + idx * 1.5, repeat: Infinity, ease: 'linear', delay: idx * 0.8 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glossy atmospheric glow */}
      <div id="visual-glossy-glow" className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10 rounded-3xl pointer-events-none z-0" />
    </div>
  );
}
