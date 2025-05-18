'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AuthHeader from '../components/AuthHeader';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar usuário');
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Ocorreu um erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <AuthHeader />
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Criar Conta</h2>
            
            {error && (
              <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500 text-white p-3 rounded-md mb-4 text-center">
                Conta criada com sucesso! Redirecionando para o login...
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Seu nome"
                  disabled={loading || success}
                />
              </div>
              
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
                  disabled={loading || success}
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
                  disabled={loading || success}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmar Senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  disabled={loading || success}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  loading || success
                    ? 'bg-blue-700 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Registrando...' : success ? 'Registrado!' : 'Registrar'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                  Faça login
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
