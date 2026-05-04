import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/AppContexts';

export function ReadingAssistant() {
  const { readingMode } = useAccessibility();
  const synth = window.speechSynthesis;
  const currentUtteranceRef = useRef(null);

  useEffect(() => {
    if (!readingMode) {
      if (synth.speaking) synth.cancel();
      return;
    }

    let currentElement = null;
    let isTouch = false;

    const readElement = (target) => {
      if (!target) return;
      if (target === currentElement) return;

      if (['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'A', 'LI', 'LABEL', 'BUTTON'].includes(target.tagName) && target.innerText.trim()) {
        if (synth.speaking) synth.cancel();
        currentElement = target;
        const text = target.innerText;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CL';
        utterance.rate = 1.0;
        
        utterance.onend = () => {
            if (currentElement === target) {
                currentElement = null;
            }
        };

        currentUtteranceRef.current = utterance;
        synth.speak(utterance);
      } else if (currentElement) {
        if (synth.speaking) synth.cancel();
        currentElement = null;
      }
    };

    const handleMouseOver = (e) => {
      if (isTouch) return;
      readElement(e.target);
    };

    const handleMouseOut = () => {
      if (isTouch) return;
      if (synth.speaking) synth.cancel();
      currentElement = null;
    };

    const handleTouchStart = (e) => {
      isTouch = true;
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      readElement(target);
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      readElement(target);
    };

    const handleTouchEnd = () => {
      if (synth.speaking) synth.cancel();
      currentElement = null;
      setTimeout(() => { isTouch = false; }, 500);
    };

    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
    document.body.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.body.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.body.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.body.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      document.body.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('touchend', handleTouchEnd);
      document.body.removeEventListener('touchcancel', handleTouchEnd);
      if (synth.speaking) synth.cancel();
    };
  }, [readingMode]);

  return null;
}
