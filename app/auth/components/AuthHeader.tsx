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
