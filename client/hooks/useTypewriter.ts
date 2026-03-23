import { useState, useEffect, useRef } from "react";

const CHAR_INTERVAL_MS = 18;

export function useTypewriter(
  fullText: string,
  enabled: boolean
): { displayedText: string; isTyping: boolean } {
  const [displayedLength, setDisplayedLength] = useState(
    enabled ? 0 : fullText.length
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!enabled) {
      setDisplayedLength(fullText.length);
      return;
    }

    setDisplayedLength(0);

    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1;
        if (next >= fullText.length) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return fullText.length;
        }
        return next;
      });
    }, CHAR_INTERVAL_MS);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fullText, enabled]);

  const isTyping = enabled && displayedLength < fullText.length;
  const displayedText = fullText.slice(0, displayedLength);

  return { displayedText, isTyping };
}
