/**
 * Circular Simon Board Component (Classic Design)
 * 
 * Replicates the iconic circular Simon game with 4 colored wedges
 * arranged in a circle with a center hub.
 */

import { useState, useEffect } from 'react';
import type { Color } from '../../shared/types';

// =============================================================================
// TYPES
// =============================================================================

interface CircularSimonBoardProps {
  sequence: Color[];
  round: number;
  isShowingSequence: boolean;
  isInputPhase: boolean;
  playerSequence: Color[];
  canSubmit: boolean;
  lastResult: { isCorrect: boolean; playerName: string } | null;
  onColorClick: (color: Color) => void;
  onSubmit: () => void;
  disabled?: boolean;
  secondsRemaining: number;
  timerColor: 'green' | 'yellow' | 'red';
  isTimerPulsing: boolean;
}

interface WedgeProps {
  color: Color;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// =============================================================================
// WEDGE COMPONENT (Quarter Circle)
// =============================================================================

const ColorWedge: React.FC<WedgeProps> = ({ color, isActive, onClick, disabled, position }) => {
  const colors = {
    red: { base: '#ef4444', light: '#fca5a5', shadow: '#dc2626' },
    blue: { base: '#3b82f6', light: '#93c5fd', shadow: '#2563eb' },
    yellow: { base: '#facc15', light: '#fef08a', shadow: '#eab308' },
    green: { base: '#22c55e', light: '#86efac', shadow: '#16a34a' },
  };

  const wedgeColor = colors[color];
  const bgColor = isActive ? wedgeColor.light : wedgeColor.base;

  // Position-specific border radius
  const borderRadius = {
    'top-left': '100% 0 0 0',
    'top-right': '0 100% 0 0',
    'bottom-left': '0 0 0 100%',
    'bottom-right': '0 0 100% 0',
  }[position];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        absolute w-1/2 h-1/2
        transition-all duration-200
        ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer active:scale-95'}
        ${position === 'top-left' ? 'top-0 left-0' : ''}
        ${position === 'top-right' ? 'top-0 right-0' : ''}
        ${position === 'bottom-left' ? 'bottom-0 left-0' : ''}
        ${position === 'bottom-right' ? 'bottom-0 right-0' : ''}
      `}
      style={{
        backgroundColor: bgColor,
        borderRadius,
        touchAction: 'manipulation',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
        filter: isActive ? 'brightness(1.4) drop-shadow(0 0 20px currentColor)' : 'brightness(1)',
        boxShadow: isActive ? `0 0 30px ${wedgeColor.light}` : 'none',
      }}
      aria-label={`${color} button`}
    >
      <span className="sr-only">{color}</span>
    </button>
  );
};

// =============================================================================
// CIRCULAR SIMON BOARD COMPONENT
// =============================================================================

export const CircularSimonBoard: React.FC<CircularSimonBoardProps> = ({
  sequence,
  round,
  isShowingSequence,
  isInputPhase,
  playerSequence,
  canSubmit,
  onColorClick,
  onSubmit,
  disabled = false,
  secondsRemaining,
  timerColor,
  isTimerPulsing,
}) => {
  const [activeColor, setActiveColor] = useState<Color | null>(null);

  // Animate sequence when showing
  useEffect(() => {
    if (!isShowingSequence || sequence.length === 0) {
      setActiveColor(null);
      return;
    }

    const SHOW_DURATION = 800;
    const SHOW_GAP = 300;

    let currentIndex = 0;
    let timeoutId: number;

    const showNextColor = () => {
      if (currentIndex >= sequence.length) {
        setActiveColor(null);
        return;
      }

      const color = sequence[currentIndex];
      setActiveColor(color);

      setTimeout(() => {
        setActiveColor(null);
        currentIndex++;
        timeoutId = setTimeout(showNextColor, SHOW_GAP);
      }, SHOW_DURATION);
    };

    showNextColor();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      setActiveColor(null);
    };
  }, [isShowingSequence, sequence]);

  // Handle color button click
  const handleColorClick = (color: Color) => {
    if (disabled || isShowingSequence || !isInputPhase) return;

    if (!disabled) {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      setActiveColor(color);
      setTimeout(() => setActiveColor(null), 200);
      onColorClick(color);
    }
  };

  // Get color emoji
  const getColorEmoji = (color: Color): string => {
    const emojis: Record<Color, string> = {
      red: '🔴',
      blue: '🔵',
      yellow: '🟡',
      green: '🟢',
    };
    return emojis[color];
  };

  return (
    <div className="game-area flex flex-col items-center gap-3 w-full max-w-md px-4">
      {/* Round Display */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          Round {round}
        </h2>
        <p className="text-xs sm:text-sm text-gray-300">
          {disabled 
            ? '👻 Spectating...' 
            : isShowingSequence 
              ? '👀 WATCH!' 
              : isInputPhase
                ? '🎮 Your turn!' 
                : '✅ Ready'}
        </p>
        {isShowingSequence && (
          <p className="text-base sm:text-lg font-bold text-yellow-400 mt-1">
            {sequence.length} color{sequence.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Timer Display */}
      {isInputPhase && secondsRemaining > 0 && (
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs text-gray-400 font-semibold">
            ⏱️ TIME
          </div>
          <div 
            className={`
              font-bold transition-all duration-200
              ${secondsRemaining > 10 ? 'text-3xl sm:text-4xl' : ''}
              ${secondsRemaining > 5 && secondsRemaining <= 10 ? 'text-4xl sm:text-5xl' : ''}
              ${secondsRemaining <= 5 ? 'text-5xl sm:text-6xl' : ''}
              ${timerColor === 'green' ? 'text-green-500' : ''}
              ${timerColor === 'yellow' ? 'text-yellow-500' : ''}
              ${timerColor === 'red' ? 'text-red-500' : ''}
              ${isTimerPulsing ? 'animate-pulse' : ''}
            `}
          >
            {secondsRemaining}s
          </div>
        </div>
      )}

      {/* Circular Simon Board */}
      <div className="relative w-full max-w-[320px] aspect-square">
        {/* The 4 colored wedges */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-900 shadow-2xl">
          {/* Green - Top Left */}
          <ColorWedge
            color="green"
            isActive={activeColor === 'green'}
            onClick={() => handleColorClick('green')}
            disabled={disabled || isShowingSequence}
            position="top-left"
          />
          
          {/* Red - Top Right */}
          <ColorWedge
            color="red"
            isActive={activeColor === 'red'}
            onClick={() => handleColorClick('red')}
            disabled={disabled || isShowingSequence}
            position="top-right"
          />
          
          {/* Yellow - Bottom Left */}
          <ColorWedge
            color="yellow"
            isActive={activeColor === 'yellow'}
            onClick={() => handleColorClick('yellow')}
            disabled={disabled || isShowingSequence}
            position="bottom-left"
          />
          
          {/* Blue - Bottom Right */}
          <ColorWedge
            color="blue"
            isActive={activeColor === 'blue'}
            onClick={() => handleColorClick('blue')}
            disabled={disabled || isShowingSequence}
            position="bottom-right"
          />

          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          w-1/3 h-1/3 rounded-full bg-gray-900 border-4 border-gray-800
                          flex items-center justify-center shadow-inner">
            <div className="text-center">
              <div className="text-white font-bold text-xs sm:text-sm tracking-wider">
                SIMON
              </div>
            </div>
          </div>
        </div>

        {/* Black gaps between wedges (cross pattern) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-900 transform -translate-x-1/2"></div>
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-900 transform -translate-y-1/2"></div>
        </div>
      </div>

      {/* Player Sequence Display */}
      {isInputPhase && playerSequence.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-2 w-full max-w-[320px]">
          <div className="flex justify-center items-center gap-1 min-h-[28px]">
            {playerSequence.map((color, i) => (
              <span key={i} className="text-xl sm:text-2xl">
                {getColorEmoji(color)}
              </span>
            ))}
            <span className="text-gray-400 text-xs ml-2">
              {playerSequence.length}/{sequence.length}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {isInputPhase && (
        <button
          onClick={() => {
            if (canSubmit && 'vibrate' in navigator) {
              navigator.vibrate(100);
            }
            onSubmit();
          }}
          disabled={!canSubmit}
          style={{ touchAction: 'manipulation' }}
          className={`
            w-full max-w-[320px] px-6 py-3 rounded-lg font-bold text-base
            min-h-[56px]
            transition-all duration-75
            ${canSubmit 
              ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white cursor-pointer shadow-lg hover:shadow-xl active:scale-95' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}
          `}
        >
          {canSubmit ? '✅ SUBMIT' : '⏳ Complete...'}
        </button>
      )}
    </div>
  );
};

export default CircularSimonBoard;
