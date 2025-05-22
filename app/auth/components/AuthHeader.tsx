'use client';

import Image from 'next/image';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AuthHeader({ title, subtitle = 'Organize suas tarefas e finanças em um só lugar' }: AuthHeaderProps) {
  return (
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}
