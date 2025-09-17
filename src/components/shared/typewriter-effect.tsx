'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type TypewriterEffectProps = {
  text: string;
  className?: string;
  cursorClassName?: string;
};

export function TypewriterEffect({ text, className, cursorClassName }: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 100); // Typing speed

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <h1 className={cn("font-code", className)}>
      {displayedText}
      <span className={cn("blinking-cursor", cursorClassName)}>{!isTyping && '_'}</span>
    </h1>
  );
}
