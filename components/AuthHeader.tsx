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
          {/* Placeholder para a imagem personalizada que será adicionada posteriormente */}
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
            <h1 className="text-2xl font-bold text-white">PocketPlanner</h1>
          </div>
        </div>
        
        {title && (
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {title}
          </h2>
        )}
        
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          Organize suas tarefas e finanças em um só lugar
        </p>
      </div>
    </div>
  );
}
