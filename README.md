# Agenda Pocket Planner

Bem-vindo ao Agenda Pocket Planner! Esta é uma aplicação web pessoal projetada para ajudar você a gerenciar suas tarefas diárias, compromissos e finanças de forma integrada e eficiente.

## Funcionalidades Principais

*   **Autenticação Segura**: Login com contas Google ou GitHub via NextAuth.js.
*   **Quadro Kanban Intuitivo**: Organize suas tarefas em colunas ("Fazer", "Fazendo", "Feito") com funcionalidade de arrastar e soltar.
*   **Gerenciamento Completo de Tarefas**:
    *   Crie, edite e exclua tarefas com títulos, descrições, datas de vencimento e tags coloridas.
    *   Configure tarefas recorrentes (diárias, semanais, mensais) que são geradas automaticamente ao acessar o sistema.
    *   Rotina pessoal e de airdrops pré-carregada para fácil início.
*   **Módulo Financeiro Integrado**:
    *   Registre suas contas a pagar e receitas (eventuais e recorrentes).
    *   Categorize suas transações financeiras.
    *   Visualize um gráfico de pizza mensal dos seus gastos por categoria.
    *   Acesse uma previsão financeira com gráficos de linha ou barras para meses futuros.
*   **Notificações Push**: Receba lembretes no navegador para tarefas importantes e contas a vencer (requer permissão do usuário).
*   **Interface Responsiva**: Design totalmente adaptado para uso em desktops, tablets e dispositivos móveis.
*   **Persistência de Dados**: Suas informações são salvas de forma segura em um banco de dados PostgreSQL.

## Stack Tecnológica

*   **Framework**: Next.js (com React para UI e API Routes para backend)
*   **Linguagem**: TypeScript
*   **Banco de Dados**: PostgreSQL (sugestão: Supabase ou Neon para hospedagem gratuita)
*   **ORM**: Prisma
*   **Autenticação**: NextAuth.js
*   **Estilização**: Tailwind CSS (com componentes Shadcn/UI)
*   **Kanban (Drag & Drop)**: `react-beautiful-dnd` (ou alternativa similar)
*   **Gráficos**: Recharts
*   **Notificações Push**: Push API do Navegador e Service Workers

## Como Rodar Localmente

1.  **Clone o Repositório**:
    ```bash
    git clone <URL_DO_REPOSITORIO_AQUI>
    cd agenda-pocketplanner
    ```

2.  **Instale as Dependências**:
    ```bash
    npm install
    # ou
    # pnpm install
    # ou
    # yarn install
    ```

3.  **Configure as Variáveis de Ambiente**:
    *   Copie o arquivo `.env.example` para `.env.local`.
        ```bash
        cp .env.example .env.local
        ```
    *   Preencha as variáveis no arquivo `.env.local` com suas chaves e URLs:
        *   `DATABASE_URL`: Sua string de conexão do PostgreSQL.
        *   `NEXTAUTH_URL`: A URL base da sua aplicação em desenvolvimento (ex: `http://localhost:3000`).
        *   `NEXTAUTH_SECRET`: Uma string secreta para NextAuth (gere uma usando `openssl rand -base64 32`).
        *   `GOOGLE_CLIENT_ID`: Seu ID de cliente do Google OAuth.
        *   `GOOGLE_CLIENT_SECRET`: Seu segredo de cliente do Google OAuth.
        *   `GITHUB_CLIENT_ID`: Seu ID de cliente do GitHub OAuth.
        *   `GITHUB_CLIENT_SECRET`: Seu segredo de cliente do GitHub OAuth.
        *   (Opcional) `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: Chave VAPID pública para notificações push.

4.  **Execute as Migrações do Banco de Dados (Prisma)**:
    ```bash
    npx prisma migrate dev --name init
    ```
    (Use `--name init` apenas na primeira vez ou escolha um nome descritivo para suas migrações.)

5.  **Gere o Prisma Client**:
    ```bash
    npx prisma generate
    ```

6.  **Semeie o Banco de Dados com Tarefas Iniciais (Opcional, mas Recomendado para Primeira Execução)**:
    *   **IMPORTANTE**: Abra o arquivo `prisma/seed.ts` e substitua o valor de `USER_ID_PLACEHOLDER` pelo ID do seu usuário recém-criado na aplicação. Você pode obter este ID após se registrar e fazer login pela primeira vez (por exemplo, inspecionando a sessão do usuário ou, se implementado, no seu perfil de usuário. Em um ambiente de desenvolvimento, você pode consultar o banco de dados diretamente na tabela `User`).
    *   Após atualizar o `USER_ID_PLACEHOLDER` no `prisma/seed.ts`, execute o comando:
        ```bash
        npx prisma db seed
        ```
    *   Este script irá popular o banco de dados com suas tarefas de rotina e airdrops pré-definidas.

7.  **Inicie o Servidor de Desenvolvimento**:
    ```bash
    npm run dev
    # ou
    # pnpm dev
    # ou
    # yarn dev
    ```

8.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## Estrutura do Projeto

Consulte o arquivo `ARQUITETURA.md` para uma visão detalhada da estrutura de pastas e da arquitetura do sistema.

## Deploy

Consulte o arquivo `DEPLOY.md` para instruções sobre como fazer o deploy da aplicação no Vercel.

---

Este projeto foi desenvolvido para atender às suas necessidades de organização pessoal e financeira. Esperamos que seja uma ferramenta valiosa no seu dia a dia!

