'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // Não mostrar o cabeçalho na página de login ou registro
  const isAuthPage = pathname.includes('/auth/');
  
  if (isAuthPage) return null;
  
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
      
      <nav className="bg-gray-800 py-2 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <Link 
              href="/dashboard" 
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname === '/dashboard' ? 'text-white font-medium' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/tasks" 
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname.includes('/tasks') ? 'text-white font-medium' : ''
              }`}
            >
              Tarefas
            </Link>
            <Link 
              href="/financial" 
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname.includes('/financial') ? 'text-white font-medium' : ''
              }`}
            >
              Finanças
            </Link>
          </div>
          
          <div>
            <Link 
              href="/profile" 
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname === '/profile' ? 'text-white font-medium' : ''
              }`}
            >
              Perfil
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
