import React, { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import BreathingExercise from './BreathingExercise';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-white/5 transition-colors"
      >
        <MenuIcon className="w-6 h-6 text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/5 p-2">
          <div className="space-y-1">
            <button
              onClick={() => {
                setShowBreathing(true);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-white/5 transition-colors flex items-center space-x-2"
            >
              <span>Breathing Exercise</span>
            </button>
          </div>
        </div>
      )}

      {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
    </>
  );
}