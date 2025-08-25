import { useState, useEffect, useRef } from 'react';
import { Pause, Play, RefreshCw } from 'lucide-react';

const RelaxationTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [totalCycles, setTotalCycles] = useState(0);
  const timerRef = useRef<number | null>(null);

  const phaseConfig = {
    inhale: { duration: 4, text: 'Breathe in...' },
    hold: { duration: 4, text: 'Hold...' },
    exhale: { duration: 6, text: 'Breathe out...' }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setCount(prevCount => {
          if (prevCount > 1) {
            return prevCount - 1;
          } else {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold');
              return phaseConfig.hold.duration;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return phaseConfig.exhale.duration;
            } else {
              setPhase('inhale');
              setTotalCycles(prev => prev + 1);
              return phaseConfig.inhale.duration;
            }
          }
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, phase]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(phaseConfig.inhale.duration);
    setTotalCycles(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const renderCircle = () => {
    const maxSize = phase === 'inhale' ? 100 : phase === 'hold' ? 100 : 60;
    const minSize = 60;
    const currentDuration = phaseConfig[phase].duration;
    
    let size;
    if (phase === 'inhale') {
      size = minSize + ((maxSize - minSize) * (currentDuration - count) / currentDuration);
    } else if (phase === 'exhale') {
      size = maxSize - ((maxSize - minSize) * (currentDuration - count) / currentDuration);
    } else {
      size = maxSize;
    }

    return (
      <div 
        className="transition-all duration-1000 bg-violet-200 rounded-full flex items-center justify-center"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
        }}
      >
        <span className="text-xl font-semibold text-violet-700">{count}</span>
      </div>
    );
  };

  return (
    <div className="card bg-gradient-to-r from-violet-100 to-pink-100">
      <h2 className="text-xl font-semibold text-violet-700 mb-4">Breathing Exercise</h2>
      
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          A simple breathing exercise to help reduce stress and discomfort
        </p>
        
        <div className="flex flex-col items-center justify-center my-6">
          {renderCircle()}
          <p className="mt-4 text-violet-600 font-medium">{phaseConfig[phase].text}</p>
          {totalCycles > 0 && (
            <p className="text-sm text-gray-500 mt-2">Completed cycles: {totalCycles}</p>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className="btn-primary px-6 flex items-center space-x-2"
          >
            {isActive ? (
              <>
                <Pause size={18} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>Start</span>
              </>
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelaxationTimer;
