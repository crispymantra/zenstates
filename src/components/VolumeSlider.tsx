import React from 'react';

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function VolumeSlider({ value, onChange }: VolumeSliderProps) {
  const handleTouchMove = (e: React.TouchEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const target = e.target as HTMLInputElement;
    const rect = target.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    onChange(Math.round(percentage));
  };

  return (
    <div className="relative flex-1">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        onTouchStart={(e) => {
          e.stopPropagation();
          const target = e.target as HTMLInputElement;
          target.focus();
        }}
        onTouchMove={handleTouchMove}
        className="block w-full h-2 rounded-lg appearance-none cursor-pointer touch-none"
        style={{
          background: `linear-gradient(to right, rgb(168, 85, 247) ${value}%, rgb(55, 65, 81) ${value}%)`,
          WebkitAppearance: 'none',
        }}
      />
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: rgb(168, 85, 247);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: rgb(168, 85, 247);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}