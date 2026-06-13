"use client";

import { useEffect, useRef, useState } from "react";

const FULL_DASH_ARRAY = 283;

interface QuizTimerProps {
  seconds: number;
  onTimeUp?: () => void;
}

export default function QuizTimer({ seconds, onTimeUp }: QuizTimerProps) {
  const [color, setColor] = useState<string>("green");

  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(seconds);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = (timestamp - startTimeRef.current) / 1000;

    const remaining = Math.max(seconds - elapsed, 0);

    setTimeLeft(remaining);

    // تعیین رنگ بر اساس زمان باقی‌مانده
    const fractionLeft = remaining / seconds;

    if (fractionLeft <= 0.3) {
      setColor("red");
    } else if (fractionLeft <= 0.6) {
      setColor("orange");
    } else {
      setColor("green");
    }

    if (remaining > 0) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      onTimeUp?.();
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const timeFraction = timeLeft / seconds;

  const dashArray = `${(timeFraction * FULL_DASH_ARRAY).toFixed(
    0,
  )} ${FULL_DASH_ARRAY}`;

  return (
    <div className="relative sm:w-12 w-10 sm:h-12 h-10">
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full -rotate-90 transition-colors duration-150
          ${color === "green" ? "text-green-500" : ""}
          ${color === "orange" ? "text-orange-400" : ""}
          ${color === "red" ? "text-red-500" : ""}
        `}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="7"
        />

        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center sm:text-[13px] text-[12px] font-bold text-black">
        {Math.floor(timeLeft / 60)}:
        {String(Math.floor(timeLeft % 60)).padStart(2, "0")}
      </div>
    </div>
  );
}
