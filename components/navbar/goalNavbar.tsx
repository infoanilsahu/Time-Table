"use client";

interface NavbarProps {
  title: string;
  percentage: number;
}

export function Navbar({
  title,
  percentage,
}: NavbarProps) {
  const progress = Math.min(100, Math.max(0, percentage));
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);
  

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-black text-white">
      {/* Left side: Title */}
      <h1 className="text-2xl font-semibold">
        {title}
      </h1>

      {/* Right side: Circular percentage */}
      <div className="relative w-12 h-12 mr-2">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 64 64"
        >
          {/* Background circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-in-out bg-white"
          />
        </svg>

        {/* Percentage text */}
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
          {progress}%
        </span>
      </div>
    </nav>
  );
}