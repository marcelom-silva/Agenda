'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AuthHeader from '../components/AuthHeader';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validação básica
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao registrar usuário');
      }

      // Redirecionar para a página de login após registro bem-sucedido
      router.push('/auth/login?registered=true');
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      setError(error.message || 'Ocorreu um erro ao registrar. Tente novamente.');
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
            <AuthHeader title="Criar Conta" />
          </div>
          
          {/* Formulário */}
          <div className="p-6 pt-2">
            {error && (
              <div className="mb-4 rounded-md bg-red-900/30 p-4 text-sm text-red-200 border border-red-800">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-white shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                  placeholder="Seu nome completo"
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
                  placeholder="Mínimo 6 caracteres"
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
                  required
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-white shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                  placeholder="Digite a senha novamente"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Faça login
                </Link>
              </p>
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
