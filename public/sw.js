// public/sw.js

self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {}; // Assume data is sent as JSON
  const title = data.title || "Nova Notificação";
  const options = {
    body: data.body || "Você tem uma nova atualização.",
    icon: data.icon || "/icons/icon-192x192.png", // Caminho para um ícone padrão
    badge: data.badge || "/icons/badge-72x72.png", // Caminho para um ícone de badge
    image: data.image || null, // URL de uma imagem para exibir na notificação
    data: {
      url: data.url || self.registration.scope, // URL para abrir ao clicar na notificação
    },
    // Adicionar mais opções conforme necessário: actions, vibrate, etc.
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close(); // Fecha a notificação

  // Abre a URL especificada nos dados da notificação ou a URL do escopo do service worker
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      const urlToOpen = event.notification.data.url || self.registration.scope;
      // Se já houver uma janela/aba aberta com a mesma URL, foca nela
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Caso contrário, abre uma nova janela/aba
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Opcional: lidar com o fechamento da notificação (se necessário)
// self.addEventListener('notificationclose', function(event) {
//   console.log('Notificação fechada:', event.notification);
// });

// Opcional: lidar com erros de push (raro, mas pode ser útil para depuração)
// self.addEventListener('pushsubscriptionchange', function(event) {
//   console.log('Assinatura push alterada:', event);
//   // Aqui você pode tentar reenviar a nova assinatura para o seu servidor
//   // event.oldSubscription
//   // event.newSubscription
// });

