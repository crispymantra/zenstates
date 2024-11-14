import React, { useRef, useState, useEffect } from 'react';
import { Volume2, Power } from 'lucide-react';
import YouTube from 'react-youtube';
import { sounds } from '../data/sounds';
import useAudioStore from '../store/audioStore';
import VolumeSlider from './VolumeSlider';

export default function SoundMixer() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const { 
    activeScenes, 
    sceneVolumes,
    setYouTubePlayer,
    toggleScene,
    setSceneVolume 
  } = useAudioStore();

  useEffect(() => {
    // Initialize a single AudioContext for all sounds
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // iOS requires user interaction to start audio context
    const unlockAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('click', unlockAudio);

    return () => {
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

  const handleVolumeChange = (soundId: string, value: number) => {
    setSceneVolume(soundId, value);
  };

  const handleSceneToggle = async (soundId: string) => {
    // Ensure audio context is running before toggling
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    toggleScene(soundId);
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {sounds.map((sound) => {
        const isActive = activeScenes.has(sound.id);
        const volume = sceneVolumes.get(sound.id) || 50;
        const isLoading = loadingStates[sound.id];
        const hasError = errorStates[sound.id];

        return (
          <div
            key={sound.id}
            className={`p-6 rounded-lg transition-all ${
              isActive
                ? 'bg-purple-600/20 border-purple-500'
                : 'bg-black/20 hover:bg-black/30'
            } border border-transparent`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{sound.icon}</span>
                <div>
                  <h3 className="font-medium">{sound.title}</h3>
                  <p className="text-sm text-gray-400">{sound.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleSceneToggle(sound.id)}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${
                  isActive 
                    ? 'bg-purple-500 text-white hover:bg-purple-600' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Power className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            <div className="relative mt-4 aspect-video rounded-lg overflow-hidden bg-black/30">
              {sound.source.type === 'youtube' && (
                <YouTube
                  videoId={sound.source.videoId}
                  className="absolute inset-0"
                  opts={{
                    height: '100%',
                    width: '100%',
                    playerVars: {
                      autoplay: 1,
                      controls: 0,
                      loop: 1,
                      playlist: sound.source.videoId,
                      modestbranding: 1,
                      origin: window.location.origin,
                      playsinline: 1, // Important for iOS
                    },
                  }}
                  onReady={(event) => {
                    setLoadingStates(prev => ({ ...prev, [sound.id]: false }));
                    setYouTubePlayer(sound.id, event.target);
                    event.target.setVolume(volume);
                    if (!isActive) {
                      event.target.mute();
                    }
                  }}
                  onError={() => {
                    setErrorStates(prev => ({ ...prev, [sound.id]: true }));
                    setLoadingStates(prev => ({ ...prev, [sound.id]: false }));
                  }}
                />
              )}
            </div>

            {hasError && (
              <div className="mt-4 text-center text-sm text-red-400 bg-red-900/20 rounded-lg p-2">
                Failed to load sound. Please try again.
              </div>
            )}

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <VolumeSlider
                  value={volume}
                  onChange={(value) => handleVolumeChange(sound.id, value)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}