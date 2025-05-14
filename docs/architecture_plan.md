## Estrutura de Diretórios (Frontend - Next.js /app Router)

```
/app
  ├── (auth)                # Rotas de autenticação (login, signup, etc.)
  │   ├── login/page.tsx
  │   └── signup/page.tsx
  ├── (main)                # Rotas protegidas após login
  │   ├── dashboard/         # Página principal do dashboard (Kanban)
  │   │   ├── page.tsx
  │   │   └── components/
  │   │       ├── KanbanBoard.tsx
  │   │       ├── KanbanColumn.tsx
  │   │       └── KanbanCard.tsx
  │   ├── financeiro/        # Página do módulo financeiro
  │   │   ├── page.tsx
  │   │   └── components/
  │   │       ├── AddTransactionForm.tsx
  │   │       ├── TransactionList.tsx
  │   │       └── FinancialChart.tsx
  │   ├── configuracoes/     # Página de configurações do usuário
  │   │   └── page.tsx
  │   └── layout.tsx         # Layout principal para as páginas autenticadas
  ├── api/                   # Rotas de API (NextAuth, etc.)
  │   └── auth/
  │       └── [...nextauth]/route.ts
  ├── layout.tsx             # Layout raiz da aplicação
  └── page.tsx               # Página inicial (pode redirecionar para /dashboard ou /login)

/components                 # Componentes React reutilizáveis e globais
  ├── ui/                    # Componentes de UI básicos (Button, Input, Card, etc. - Shadcn UI)
  ├── layout/                # Componentes de layout (Navbar, Sidebar, Footer)
  └── ...                    # Outros componentes específicos de funcionalidades

/lib                        # Funções utilitárias, hooks, configurações
  ├── auth.ts                # Configuração do NextAuth (já existente)
  ├── db.ts                  # Configuração do cliente Prisma (ou outro ORM)
  ├── utils.ts               # Funções utilitárias gerais
  └── hooks/                 # Hooks React personalizados

/prisma                     # Esquema do Prisma e migrações (se usar Prisma)
  └── schema.prisma

/public                     # Arquivos estáticos
  ├── images/
  └── ...

/styles                     # Arquivos CSS globais ou de temas
  └── globals.css

next.config.mjs
tsconfig.json
package.json
```

**Explicação da Estrutura:**

*   **`/app`**: Contém as rotas principais da aplicação usando o App Router do Next.js.
    *   **`(auth)`**: Grupo de rotas para autenticação. Inclui páginas de login e cadastro.
    *   **`(main)`**: Grupo de rotas para as seções principais da aplicação após o login. Inclui o dashboard (Kanban), módulo financeiro e configurações.
        *   Cada subdiretório (ex: `dashboard`, `financeiro`) terá sua própria `page.tsx` e poderá ter um subdiretório `components` para componentes específicos daquela seção.
    *   **`api`**: Contém as rotas de API, incluindo a configuração do NextAuth.
    *   `layout.tsx`: Layout raiz que se aplica a todas as páginas.
    *   `page.tsx`: Página inicial da aplicação.
*   **`/components`**: Contém componentes React reutilizáveis.
    *   **`/ui`**: Componentes de UI básicos, idealmente usando Shadcn UI conforme planejado.
    *   **`/layout`**: Componentes de layout como Navbar, Sidebar, Footer.
*   **`/lib`**: Contém funções utilitárias, hooks personalizados e configurações (como a do Prisma).
*   **`/prisma`**: Se o Prisma for usado, este diretório conterá o esquema do banco de dados e os arquivos de migração.
*   **`/public`**: Para arquivos estáticos como imagens, fontes, etc.
*   **`/styles`**: Para arquivos CSS globais ou de temas.

**Próximos Passos:**

1.  **Configurar Variáveis de Ambiente**: Adicionar as variáveis de ambiente necessárias para Google e GitHub OAuth no arquivo `.env.local`.
2.  **Criar Componentes de UI Básicos**: Começar a criar os componentes reutilizáveis em `/components/ui` (ex: Button, Input, Card) usando Shadcn UI.
3.  **Implementar Layouts**: Desenvolver os layouts principais (`/app/layout.tsx` e `/app/(main)/layout.tsx`) incluindo navegação (Navbar, Sidebar).
4.  **Páginas de Autenticação**: Criar as páginas de login e cadastro em `/app/(auth)` e integrar com o NextAuth.
5.  **Estrutura do Dashboard/Kanban**: Desenvolver os componentes básicos para o quadro Kanban (`KanbanBoard.tsx`, `KanbanColumn.tsx`, `KanbanCard.tsx`) dentro de `/app/(main)/dashboard/components`.
6.  **Estrutura do Módulo Financeiro**: Desenvolver os componentes básicos para o módulo financeiro (`AddTransactionForm.tsx`, `TransactionList.tsx`, `FinancialChart.tsx`) dentro de `/app/(main)/financeiro/components`.

Este plano detalhado para a estrutura de pastas e os próximos passos imediatos devem nos colocar no caminho certo para desenvolver o aplicativo de forma organizada e eficiente. Vou começar implementando a estrutura de pastas e os componentes básicos de UI. 

Por favor, me avise se tiver alguma dúvida ou sugestão.
