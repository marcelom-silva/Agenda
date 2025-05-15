"use client";

import React from 'react';
import KanbanBoard from './components/KanbanBoard'; // Importando o KanbanBoard

// A lógica de verificação de sessão e redirecionamento já está no MainAppLayout
// app/(main)/layout.tsx, então esta página será renderizada apenas para usuários autenticados.

export default function DashboardPage() {
  return (
    <div>
      {/* O título "Dashboard Protegido" e o botão de sair podem vir do MainAppLayout ou ser específicos aqui */}
      {/* Por enquanto, vamos focar em renderizar o KanbanBoard */}
      <KanbanBoard />
    </div>
  );
}

