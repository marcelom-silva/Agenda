"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const NEXT_PUBLIC_VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const PushNotificationManager: React.FC = () => {
  const { data: session, status } = useSession();
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'subscribing' | 'subscribed' | 'error' | 'unsupported' | 'denied'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user && typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      if (!NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        console.warn("Chave VAPID pública não configurada. As notificações push não funcionarão.");
        setError("Configuração de notificação incompleta no servidor.");
        setSubscriptionStatus('error');
        return;
      }

      const registerServiceWorkerAndSubscribe = async () => {
        try {
          const swRegistration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registrado:', swRegistration);

          let permission = Notification.permission;
          if (permission === 'default') {
            permission = await Notification.requestPermission();
          }

          if (permission === 'granted') {
            setSubscriptionStatus('subscribing');
            const existingSubscription = await swRegistration.pushManager.getSubscription();

            if (existingSubscription) {
              console.log('Usuário já inscrito:', existingSubscription);
              // Opcionalmente, envie a inscrição existente para o backend para garantir que está atualizada
              // await sendSubscriptionToBackend(existingSubscription);
              setSubscriptionStatus('subscribed');
            } else {
              console.log('Inscrevendo novo usuário...');
              const newSubscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
              });
              console.log('Nova inscrição:', newSubscription);
              await sendSubscriptionToBackend(newSubscription);
              setSubscriptionStatus('subscribed');
            }
          } else {
            console.warn('Permissão para notificações negada.');
            setSubscriptionStatus('denied');
            setError('Permissão para notificações foi negada.');
          }
        } catch (err) {
          console.error('Falha ao registrar SW ou inscrever:', err);
          setError(err instanceof Error ? err.message : 'Erro desconhecido ao configurar notificações.');
          setSubscriptionStatus('error');
        }
      };

      registerServiceWorkerAndSubscribe();

    } else if (typeof window !== 'undefined' && (!('serviceWorker' in navigator) || !('PushManager' in window))) {
      console.warn('Navegador não suporta Service Worker ou Push Notifications.');
      setSubscriptionStatus('unsupported');
    }
  }, [session, status]);

  const sendSubscriptionToBackend = async (subscription: PushSubscription) => {
    try {
      const response = await fetch('/api/save-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao enviar inscrição para o backend');
      }
      console.log('Inscrição enviada para o backend com sucesso.');
    } catch (err) {
      console.error('Erro ao enviar inscrição para o backend:', err);
      // Não define setError aqui para não sobrescrever erros de permissão/subscrição mais importantes para o usuário
      // Mas é importante logar ou tratar esse erro de sincronização
    }
  };

  // Este componente pode renderizar um status ou um botão para (re)tentar a inscrição,
  // ou simplesmente rodar em segundo plano.
  // Por enquanto, vamos apenas logar e não renderizar nada visível.

  // Exemplo de como você poderia mostrar o status (opcional):
  // if (status !== 'authenticated') return null; 
  // if (subscriptionStatus === 'idle' || subscriptionStatus === 'subscribing') return <p>Configurando notificações...</p>;
  // if (subscriptionStatus === 'subscribed') return <p>Notificações ativadas!</p>;
  // if (subscriptionStatus === 'denied') return <p>Você negou as notificações. Ative nas configurações do navegador.</p>;
  // if (subscriptionStatus === 'unsupported') return <p>Seu navegador não suporta notificações.</p>;
  // if (subscriptionStatus === 'error') return <p>Erro ao configurar notificações: {error}</p>;

  return null; // Não renderiza nada visível por padrão
};

export default PushNotificationManager;

