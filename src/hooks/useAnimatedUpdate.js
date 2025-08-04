import { useRef, useCallback } from 'react';

export const useAnimatedUpdate = (callback, delay = 16) => {
  const lastUpdate = useRef(Date.now());
  const frameId = useRef(null);
  const batchedData = useRef([]);

  const scheduleUpdate = useCallback(() => {
    if (frameId.current) return;

    frameId.current = requestAnimationFrame(() => {
      const now = Date.now();
      if (now - lastUpdate.current >= delay) {
        callback(batchedData.current);
        batchedData.current = [];
        lastUpdate.current = now;
      }
      frameId.current = null;
    });
  }, [callback, delay]);

  const update = useCallback((data) => {
    batchedData.current.push(data);
    scheduleUpdate();
  }, [scheduleUpdate]);

  return update;
};
