
"use client";

import Link from "next/link";
import { useState } from "react";


export function Navbar() {

  return (
    <nav className="sticky top-0 z-50 bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Time-Table
        </Link>


        
      </div>

    </nav>
  );
}
