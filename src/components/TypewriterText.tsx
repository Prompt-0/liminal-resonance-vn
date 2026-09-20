import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  zalgoText?: string;
  dreadLevel: number;
  textSpeed: number; // ms per char
  onComplete?: () => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  zalgoText,
  dreadLevel,
  textSpeed,
  onComplete,
  isComplete,
  setIsComplete,
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const targetText = dreadLevel > 0.75 && zalgoText ? zalgoText : text;
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayedLength(0);
    setIsComplete(false);
  }, [text, zalgoText, setIsComplete]);

  useEffect(() => {
    if (isComplete) {
      setDisplayedLength(targetText.length);
      return;
    }

    if (displayedLength < targetText.length) {
      const char = targetText[displayedLength];
      let delay = textSpeed;
      if (char === '.' || char === '?' || char === '!') {
        delay = textSpeed * 5;
      } else if (char === ',') {
        delay = textSpeed * 2.5;
      }

      timeoutRef.current = window.setTimeout(() => {
        setDisplayedLength((prev) => prev + 1);
      }, delay);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [displayedLength, targetText, textSpeed, isComplete, onComplete, setIsComplete]);

  const currentVisible = targetText.slice(0, displayedLength);

  return (
    <span className="inline leading-relaxed tracking-wide text-neutral-100 font-spectral text-lg md:text-xl selection:bg-rose-900 selection:text-white">
      {currentVisible}
      {!isComplete && (
        <span className="inline-block w-2 h-5 ml-1 bg-amber-400/80 animate-pulse align-middle" />
      )}
    </span>
  );
};
