"use client";

import { useEffect, useMemo, useState } from "react";

export type TimeLeft = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getTimeLeft = (target: Date): TimeLeft => {
  const total = Math.max(0, target.getTime() - new Date().getTime());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

export const useCountdown = (targetDate: Date) => {
  const target = useMemo(() => targetDate, [targetDate]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  return {
    timeLeft,
    isComplete: hasMounted && timeLeft.total <= 0,
    hasMounted,
  };
};
