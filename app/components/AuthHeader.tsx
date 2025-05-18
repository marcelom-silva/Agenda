'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AuthHeader() {
  return (
    <header className="w-full bg-gray-900">
      <div className="relative w-full h-auto overflow-hidden">
        <Image
          src="/pocketplanner_header_banner_full.png"
          alt="PocketPlanner"
          width={1707}
          height={282}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    </header>
  );
}
