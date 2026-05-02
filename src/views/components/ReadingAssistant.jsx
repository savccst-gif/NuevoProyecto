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

    const handleMouseOver = (e) => {
      const target = e.target;
      if (['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'A', 'LI', 'LABEL'].includes(target.tagName) && target.innerText.trim()) {
        if (synth.speaking) synth.cancel();
        const text = target.innerText;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CL';
        utterance.rate = 1.0;
        currentUtteranceRef.current = utterance;
        synth.speak(utterance);
      }
    };

    const handleMouseOut = () => {
      if (synth.speaking) synth.cancel();
    };

    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      if (synth.speaking) synth.cancel();
    };
  }, [readingMode]);

  return null;
}
