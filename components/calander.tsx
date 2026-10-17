
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CalendarPopupProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CalendarPopup({ open, setOpen }: CalendarPopupProps) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!open) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Make Monday the first day of the week
  const startingDay = (firstDay + 6) % 7;

  const dates = [
    ...Array(startingDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = new Date();

  const formatDate = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    return `${year}-${mm}-${dd}`;
  };

  const handleDateClick = (day: number) => {
    router.push(`/task?date=${formatDate(day)}&complete=false`);
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(year, month + offset, 1));
  };

  return (
    <>
    
    {open && <div onClick={() => setOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-[320px] rounded-2xl border border-neutral-700 bg-[#181818] p-4 text-white shadow-2xl">
        {/* Header */}
        <div onClick={(e) => e.stopPropagation()} className="mb-5 flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            className="rounded-lg px-3 py-1 text-xl hover:bg-neutral-700"
            aria-label="Previous month"
          >
            ‹
          </button>

          <h2 className="font-semibold">
            {currentMonth.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button
            onClick={() => changeMonth(1)}
            className="rounded-lg px-3 py-1 text-xl hover:bg-neutral-700"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Weekdays */}
        <div className="mb-2 grid grid-cols-7 text-center text-xs text-neutral-400">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {dates.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }

            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition hover:bg-violet-600 ${
                  isToday
                    ? "bg-violet-600 font-semibold text-white"
                    : "text-neutral-200"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>}
    </>
  );
}
