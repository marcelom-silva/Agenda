'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AuthHeaderProps {
  title?: string;
}

export default function AuthHeader({ title }: AuthHeaderProps) {
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratação com SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center mb-6">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-4 relative w-full h-24 sm:h-32">
          {/* Imagem de cabeçalho */}
          <div className="w-full h-full relative overflow-hidden rounded-lg">
            <Image 
              src="/images/pocketplanner_header_banner_full.png"
              alt="PocketPlanner Header"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
        
        {title && (
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {title}
          </h2>
        )}
        
        <p className="text-sm text-gray-300 text-center">
          Organize suas tarefas e finanças em um só lugar
        </p>
      </div>
    </div>
  );
}
