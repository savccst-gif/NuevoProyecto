import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/AppContexts';

export function ReadingAssistant() {
  const { readingMode } = useAccessibility();
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const currentUtteranceRef = useRef(null);

  useEffect(() => {
    if (!synth) return;

    if (!readingMode) {
      if (synth.speaking) synth.cancel();
      return;
    }

    let currentElement = null;
    let isTouch = false;

    const readElement = (target) => {
      if (!target) return;

      const readable = target.closest ? target.closest('p, span, h1, h2, h3, h4, a, li, label, button') : null;

      if (readable) {
        if (readable === currentElement) return;

        const text = readable.innerText?.trim() || readable.textContent?.trim();
        if (!text) return;

        if (synth.speaking) synth.cancel();
        currentElement = readable;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CL';
        utterance.rate = 1.0;

        utterance.onend = () => {
          if (currentElement === readable) {
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
      setTimeout(() => { isTouch = false; }, 500);
    };

    const handleClick = (e) => {
      readElement(e.target);
    };

    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
    document.body.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.body.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.body.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.body.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    document.body.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      document.body.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('touchend', handleTouchEnd);
      document.body.removeEventListener('touchcancel', handleTouchEnd);
      document.body.removeEventListener('click', handleClick);
      if (synth.speaking) synth.cancel();
    };
  }, [readingMode]);

  return null;
}
