"use client";
import Image from "next/image";
import { Check, Circle, CalendarDays, CalendarArrowDown } from "lucide-react";
import task from "../public/task.svg";
import { CalendarPopup } from "../components/calander";

import Link from "next/link";
import { useState } from "react";


interface TaskNavbarProps {
  completed: number;
  uncompleted?: number | null;
  taskStatus: boolean;
  date: string;
}

export function TaskNavbar({
  completed,
  uncompleted,
  taskStatus,
  date,
}: TaskNavbarProps) {

  
  const [calenderOpen, setCalenderOpen] = useState(false)
  

  return (
    <nav className="flex items-center z-10 justify-between gap-3 p-1 sticky top-0 bg-white">
      {/* Task counts */}
      <Link href={`/task?date=${encodeURIComponent(date)}&complete=${!taskStatus}`}>
      <div className="flex items-center gap-2 text-sm">
        {/* Completed tasks */}
        <div className="flex items-center bg-black text-white p-1 pr-2 rounded-xl gap-2">
            <Image src={task} width={20} alt="" />

          <div>
            <p className=" font-semibold leading-tight">
              {completed}
            </p>
        
          </div>
        </div>


        {/* Uncompleted tasks */}
        {uncompleted && (<>
        <div className="h-5 w-px bg-neutral-700" />

        <div className="flex items-center gap-0.5">
         

          
            <p className=" font-extrabold leading-tight">
              {uncompleted}
            </p>
            
          
            <p className="font-medium">uncomplete</p>
        </div></>)}
      </div>
      </Link>

      {/* Date */}
      <div onClick={() => setCalenderOpen(true)} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-black px-2 py-1 text-white hover:cursor-pointer">
        <CalendarDays width={17} />
        <span className="text-sm font-semibold">
          {new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <CalendarPopup open={calenderOpen} setOpen={setCalenderOpen} />
    </nav>
  );
}