import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
  embedded?: boolean;
}

export default function BreathingExercise({ onClose, embedded = false }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'countdown' | 'inhale' | 'hold' | 'exhale'>('countdown');
  const [timeLeft, setTimeLeft] = useState(3);
  const [progress, setProgress] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  const stopExercise = () => {
    setIsStarted(false);
    setCycleCount(0);
    setPhase('countdown');
    setProgress(0);
    setTimeLeft(3);
  };

  useEffect(() => {
    if (!isStarted) return;

    const phaseDurations = {
      countdown: 1,
      inhale: 4,
      hold: 7,
      exhale: 8,
    };

    const totalDuration = phaseDurations[phase] * 1000;
    const frameRate = 1000 / 60;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(elapsed / totalDuration, 1);
      
      setProgress(newProgress);

      if (elapsed < totalDuration && isStarted) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase((prevPhase) => {
            if (prevPhase === 'countdown') {
              startTime = null;
              return 'inhale';
            }
            
            const nextPhase = prevPhase === 'inhale' ? 'hold' : 
                            prevPhase === 'hold' ? 'exhale' : 'inhale';
            
            if (nextPhase === 'inhale') {
              setCycleCount(prev => {
                if (prev >= 3) {
                  setIsStarted(false);
                  return 0;
                }
                return prev + 1;
              });
            }
            startTime = null;
            return nextPhase;
          });

          return phase === 'countdown' ? phaseDurations.inhale :
                 phase === 'inhale' ? phaseDurations.hold : 
                 phase === 'hold' ? phaseDurations.exhale : 
                 phaseDurations.inhale;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [phase, isStarted]);

  const messages = {
    countdown: timeLeft.toString(),
    inhale: 'Breathe In Through Your Nose',
    hold: 'Hold Your Breath',
    exhale: 'Exhale Through Your Mouth',
  };

  const size = Math.min(window.innerWidth * 0.8, embedded ? 300 : 400);
  const minSize = size * 0.3;
  const maxSize = size * 0.7;
  
  const getCircleSize = () => {
    if (phase === 'countdown') {
      return minSize;
    } else if (phase === 'inhale') {
      return minSize + (maxSize - minSize) * progress;
    } else if (phase === 'exhale') {
      return maxSize - (maxSize - minSize) * progress;
    }
    return maxSize;
  };

  const Content = () => (
    <>
      {!isStarted ? (
        <div className={`text-center px-4 py-8 ${!embedded && 'bg-gray-900/95 rounded-2xl backdrop-blur-sm border border-gray-800'} max-w-md mx-auto`}>
          <div className="text-gray-200 mb-6 space-y-4 text-left">
            <p className="text-center mb-4">
              Find a comfortable position and place one hand on your belly and the other on your chest.
            </p>
            <ul className="space-y-2 list-disc pl-4">
              <li>Inhale through your nose for 4 seconds</li>
              <li>Hold your breath for 7 seconds</li>
              <li>Exhale through your mouth for 8 seconds</li>
              <li>Repeat for 4 cycles</li>
            </ul>
          </div>
          <button
            onClick={() => {
              setIsStarted(true);
              setCycleCount(0);
              setPhase('countdown');
              setProgress(0);
              setTimeLeft(3);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Begin Exercise
          </button>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center gap-8"
          onClick={stopExercise}
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="relative"
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: `${getCircleSize()}px`,
                height: `${getCircleSize()}px`,
                background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(168,85,247,0.1) 70%)',
                boxShadow: '0 0 40px rgba(168,85,247,0.3)',
                transition: 'all 50ms linear',
              }}
            />
          </div>
          <div className="text-center">
            <p className={`text-3xl font-light text-white mb-3 ${phase === 'countdown' ? 'text-6xl' : ''}`}>
              {messages[phase]}
            </p>
            {phase !== 'countdown' && (
              <p className="text-gray-400 text-sm">
                Cycle {cycleCount + 1} of 4 • {timeLeft}s
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <Content />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-auto px-4 z-10">
        <button
          onClick={onClose}
          className="absolute -top-2 right-2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all opacity-60 hover:opacity-100"
          aria-label="Close breathing exercise"
        >
          <X className="w-5 h-5" />
        </button>

        <Content />
      </div>
    </div>
  );
}