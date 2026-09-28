"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(target: Date): TimeLeft {
  // Clamp expired deadlines to zero instead of showing negative values
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export default function CountdownTimer({
  targetDate,
}: CountdownTimerProps) {
  const t = useTranslations("countdown");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate),
  );

  // Tick every second and clean up on unmount or deadline change
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const segments = [
    { key: "days", value: timeLeft.days, label: t("days") },
    { key: "hours", value: timeLeft.hours, label: t("hours") },
    { key: "minutes", value: timeLeft.minutes, label: t("minutes") },
    { key: "seconds", value: timeLeft.seconds, label: t("seconds") },
  ];

  return (
    <div dir="ltr" className="flex w-full items-start justify-center gap-2">
      {segments.map((segment, index) => (
        <div key={segment.key} className="w-12">
          <div className="rounded-lg bg-gray-900 px-1 py-2 text-center dark:bg-white">
            <div
              className={`text-center text-sm font-bold text-white tabular-nums dark:text-gray-900 ${
                index === 3 ? "animate-countinsecond" : ""
              }`}
            >
              {pad(segment.value)}
            </div>
            <div className="mt-0.5 text-center text-[10px] font-medium text-gray-300 dark:text-gray-600">
              {segment.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
