'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { milkingApi } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCow, faPause, faPlay, faStop, faCaretLeft, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { indexedDBService, SessionState } from '../../services/indexedDB';

export default function MilkingPage() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [milkQuantity, setMilkQuantity] = useState('');
  const [startTime, setStartTime] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        await indexedDBService.init();
        const savedState = await indexedDBService.getState();
        
        if (savedState && savedState.isRunning) {
          // Calculate elapsed time since last update
          const lastUpdated = new Date(savedState.lastUpdated).getTime();
          const now = Date.now();
          const elapsedSinceLastUpdate = Math.floor((now - lastUpdated) / 1000);
          
          // Restore state - always pause after refresh for better UX
          setIsRunning(savedState.isRunning);
          setIsPaused(true); // Always pause after page refresh
          setStartTime(savedState.startTime);
          
          // Add elapsed time if session was running (not paused) before refresh
          if (!savedState.isPaused) {
            setSeconds(savedState.seconds + elapsedSinceLastUpdate);
          } else {
            setSeconds(savedState.seconds);
          }
          
          // Don't auto-play audio after refresh - user needs to manually resume
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedState();
  }, []);

  // Initialize audio
  useEffect(() => {
    try {
      audioRef.current = new Audio('/music/calming-music.mp3');
      audioRef.current.loop = true;
    } catch (error) {
      console.warn('Background music is not available');
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Save state to IndexedDB whenever it changes
  useEffect(() => {
    const saveState = async () => {
      if (isLoading) return; // Don't save during initial load
      
      try {
        const state: SessionState = {
          isRunning,
          isPaused,
          seconds,
          startTime,
          lastUpdated: new Date().toISOString(),
        };
        await indexedDBService.saveState(state);
      } catch (error) {
        console.error('Error saving state:', error);
      }
    };

    saveState();
  }, [isRunning, isPaused, seconds, startTime, isLoading]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(new Date().toISOString());
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn('Background music playback failed:', err);
      });
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    audioRef.current?.pause();
  };

  const handleResume = () => {
    setIsPaused(false);
    audioRef.current?.play().catch(err => console.error('Audio play failed:', err));
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setShowModal(true);
  };

  const handleReset = async () => {
    setShowResetModal(true);
  };

  const confirmReset = async () => {
    setShowResetModal(false);
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    setStartTime(null);
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    
    // Clear saved state
    try {
      await indexedDBService.clearState();
    } catch (error) {
      console.error('Error clearing state:', error);
    }
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  const handleSaveSession = async () => {
    if (!milkQuantity || parseFloat(milkQuantity) <= 0) {
      setError('Please enter a valid milk quantity');
      return;
    }

    setIsSaving(true);

    try {
      const endTime = new Date().toISOString();

      const payload = {
        start_time: startTime ?? new Date().toISOString(),
        end_time: endTime,
        duration: seconds,
        milk_quantity: parseFloat(milkQuantity),
      };

      await milkingApi.createSession(payload);

      // Clear saved state after successful save
      await indexedDBService.clearState();

      router.push('/history');
    } catch (error) {
      console.error('Error saving session:', error);
      setError('Failed to save session. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSession = async () => {
    setShowModal(false);
    setSeconds(0);
    setStartTime(null);
    setMilkQuantity('');
    
    // Clear saved state
    try {
      await indexedDBService.clearState();
    } catch (error) {
      console.error('Error clearing state:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <FontAwesomeIcon icon={faCaretLeft} className="w-5 h-5" /> Back
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Milking Session</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Timer Display */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl md:text-7xl font-bold text-gray-800 font-mono mb-4">
              {formatTime(seconds)}
            </div>
            <div className="text-sm text-gray-500">
              {!isRunning && 'Ready to start'}
              {isRunning && !isPaused && '🎵 Music playing...'}
              {isPaused && '⏸️ Paused'}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="w-full px-8 py-6 text-xl font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faCow} className="w-8 h-8" />
                Start Milking
              </button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {!isPaused ? (
                    <button
                      onClick={handlePause}
                      className="px-6 py-4 text-lg font-semibold text-white bg-yellow-500 rounded-xl shadow-lg hover:bg-yellow-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPause} className="w-5 h-5" />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={handleResume}
                      className="px-6 py-4 text-lg font-semibold text-white bg-blue-500 rounded-xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPlay} className="w-5 h-5" />
                      Resume
                    </button>
                  )}
                  <button
                    onClick={handleStop}
                    className="px-6 py-4 text-lg font-semibold text-white bg-red-500 rounded-xl shadow-lg hover:bg-red-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faStop} className="w-5 h-5" />
                    Stop
                  </button>
                </div>
                
                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-xl shadow-lg hover:bg-gray-300 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faRotateLeft} className="w-5 h-5" />
                  Reset Timer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Milk Quantity */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Complete</h2>
            <p className="text-gray-600 mb-4">Duration: {formatTime(seconds)}</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Milk Collected (liters)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={milkQuantity}
                onChange={(e) => setMilkQuantity(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelSession}
                disabled={isSaving}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSession}
                disabled={isSaving}
                className="flex-1 px-4 py-3 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Timer?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset the timer? This will clear the current session without saving.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelReset}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 px-4 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}