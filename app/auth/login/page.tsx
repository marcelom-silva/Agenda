'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AuthHeader from '../components/AuthHeader';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Credenciais inválidas');
        setLoading(false);
        return;
      }
      
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError('Ocorreu um erro ao fazer login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <AuthHeader />
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
            
            {error && (
              <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  loading 
                    ? 'bg-blue-700 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Não tem uma conta?{' '}
                <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">
                  Registre-se
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Feito por Manus.im e i9vest</p>
            <div className="mt-2 flex justify-center">
              <Image 
                src="/i9vest-Logo.png" 
                alt="i9vest" 
                width={40} 
                height={40} 
                className="h-8 w-auto" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
