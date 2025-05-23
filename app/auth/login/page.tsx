'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AuthHeader from '../components/AuthHeader';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Verificar se o erro contém informações sobre problemas de conexão
        if (result.error.toLowerCase().includes('database') || 
            result.error.toLowerCase().includes('conexão') ||
            result.error.toLowerCase().includes('servidor')) {
          setError('Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.');
        } else {
          setError('Email ou senha inválidos');
        }
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Ocorreu um erro ao fazer login. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Banner horizontal no topo */}
      <div className="auth-banner">
        <div className="auth-banner-image">
          <Image 
            src="/images/pocketplanner_header_banner_full.png"
            alt="PocketPlanner"
            width={1707}
            height={282}
            priority
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
      
      {/* Conteúdo principal centralizado */}
      <div className="auth-content">
        <div className="auth-form-container">
          {/* Cabeçalho */}
          <div className="p-6 pb-0">
            <AuthHeader title="Login" />
          </div>
          
          {/* Formulário */}
          <div className="p-6 pt-2">
            {error && (
              <div className="mb-4 rounded-md bg-red-900/30 p-4 text-sm text-red-200 border border-red-800">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-white shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
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
                  required
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-white shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400">
                Não tem uma conta?{' '}
                <Link href="/auth/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Registre-se
                </Link>
              </p>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-800 px-2 text-gray-400">Ou continue com</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                  className="flex w-full items-center justify-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </button>
                
                <button
                  onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                  className="flex w-full items-center justify-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                      fill="currentColor"
                    />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rodapé fixo na base */}
      <div className="auth-footer">
        <div className="auth-footer-content">
          <span>Feito por Manus e</span>
          <Image 
            src="/images/i9vest-Logo.png"
            alt="i9vest Logo"
            width={32}
            height={12}
            className="auth-footer-logo"
          />
        </div>
      </div>
    </div>
  );
}
