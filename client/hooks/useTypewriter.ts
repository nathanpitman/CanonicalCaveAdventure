import { useState, useEffect, useRef } from "react";

const CHAR_INTERVAL_MS = 30;

export function useTypewriter(
  fullText: string,
  enabled: boolean,
  onComplete?: () => void
): { displayedText: string; isTyping: boolean } {
  const [displayedLength, setDisplayedLength] = useState(
    enabled ? 0 : fullText.length
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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

  useEffect(() => {
    if (enabled && displayedLength >= fullText.length && fullText.length > 0) {
      onCompleteRef.current?.();
    }
  }, [enabled, displayedLength, fullText.length]);

  return { displayedText, isTyping };
}
