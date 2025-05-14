# Guia de Deploy: Agenda Pocket Planner no Vercel

Este guia descreve como fazer o deploy da aplicação "agenda-pocketplanner" no Vercel a partir de um repositório GitHub.

## Pré-requisitos

1.  **Conta no GitHub**: Seu projeto deve estar em um repositório GitHub.
2.  **Conta no Vercel**: Você precisará de uma conta no Vercel (pode ser a gratuita).
3.  **Banco de Dados PostgreSQL**: Um banco de dados PostgreSQL acessível publicamente (ex: Supabase, Neon, ElephantSQL, Railway, ou Aiven). Você precisará da URL de conexão do banco.
4.  **Credenciais OAuth**: Credenciais de cliente OAuth para Google e GitHub, se você for usar esses provedores de login.

## Passo a Passo para o Deploy

1.  **Prepare seu Repositório GitHub**:
    *   Certifique-se de que seu código Next.js está atualizado no branch principal (ou no branch que você deseja implantar).
    *   O arquivo `.env.local` **NÃO** deve ser enviado para o GitHub. As variáveis de ambiente serão configuradas diretamente no Vercel.
    *   Inclua um arquivo `.gitignore` adequado para um projeto Next.js (geralmente já vem com `create-next-app`), garantindo que `node_modules`, `.env.local`, e outros arquivos desnecessários não sejam versionados.

2.  **Importe o Projeto no Vercel**:
    *   Faça login na sua conta Vercel.
    *   No seu dashboard, clique em "Add New..." -> "Project".
    *   Conecte sua conta GitHub se ainda não o fez.
    *   Selecione o repositório do seu projeto "agenda-pocketplanner" na lista e clique em "Import".

3.  **Configure o Projeto no Vercel**:
    *   **Framework Preset**: O Vercel geralmente detecta automaticamente que é um projeto Next.js. Se não, selecione "Next.js".
    *   **Build and Output Settings**: Normalmente, as configurações padrão do Next.js funcionam bem. O Vercel usará o comando `next build`.
    *   **Environment Variables (Variáveis de Ambiente)**: Esta é a etapa mais crucial.
        *   Vá para a seção "Environment Variables" nas configurações do seu projeto no Vercel.
        *   Adicione as seguintes variáveis de ambiente (substitua os valores pelos seus):
            *   `DATABASE_URL`: A string de conexão completa do seu banco de dados PostgreSQL. Ex: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`.
            *   `NEXTAUTH_URL`: A URL de produção da sua aplicação no Vercel (o Vercel fornecerá isso após o primeiro deploy, mas você pode colocar um placeholder ou a URL que espera ter, ex: `https://agenda-pocketplanner-seunome.vercel.app`). É importante que esta URL seja a URL canônica da sua aplicação.
            *   `NEXTAUTH_SECRET`: Uma string secreta forte para NextAuth. Você pode gerar uma com o comando `openssl rand -base64 32` no seu terminal.
            *   `GOOGLE_CLIENT_ID`: Seu ID de Cliente OAuth do Google.
            *   `GOOGLE_CLIENT_SECRET`: Seu Segredo de Cliente OAuth do Google.
            *   `GITHUB_CLIENT_ID`: Seu ID de Cliente OAuth do GitHub.
            *   `GITHUB_CLIENT_SECRET`: Seu Segredo de Cliente OAuth do GitHub.
            *   (Opcional, para notificações push) `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: Sua chave VAPID pública.
            *   (Opcional, para notificações push) `VAPID_PRIVATE_KEY`: Sua chave VAPID privada.

4.  **Execute o Deploy**:
    *   Após configurar as variáveis de ambiente, clique no botão "Deploy".
    *   O Vercel começará o processo de build e deploy. Você pode acompanhar os logs em tempo real.

5.  **Execute as Migrações do Banco de Dados (Importante!)**:
    *   O Vercel **não** executa migrações do Prisma (ou qualquer ORM) automaticamente durante o processo de build padrão para aplicações Next.js que usam funções serverless.
    *   **Opção 1: Modificar o Comando de Build (Recomendado para simplicidade inicial)**
        *   Nas configurações do projeto no Vercel (Build & Development Settings -> Build Command), você pode tentar modificar o comando de build para incluir a execução da migração. Por exemplo:
            ```bash
            npx prisma migrate deploy && next build
            ```
        *   **Nota**: `prisma migrate deploy` é o comando recomendado para aplicar migrações em ambientes de produção, pois não gera novas migrações nem pergunta por confirmação, apenas aplica as existentes.
    *   **Opção 2: Usar a CLI do Vercel ou um Script de CI/CD (Mais robusto)**
        *   Para um controle mais fino, você pode usar a Vercel CLI para rodar as migrações de um ambiente local seguro que tenha acesso ao banco de produção, ou configurar um pipeline de CI/CD (ex: GitHub Actions) que execute as migrações antes ou depois do deploy no Vercel.
    *   **Opção 3: Conectar-se diretamente ao banco de produção e aplicar (Menos ideal para automação)**
        *   Você pode se conectar ao seu banco de dados de produção a partir do seu ambiente local (com as credenciais corretas) e rodar `npx prisma migrate deploy`.

6.  **Verifique a Aplicação**:
    *   Após o deploy ser concluído com sucesso, o Vercel fornecerá uma URL para sua aplicação (ex: `https://agenda-pocketplanner-xxxx.vercel.app`).
    *   Acesse a URL e teste todas as funcionalidades, especialmente o login e as interações com o banco de dados.

## Atualizações Futuras

*   Cada vez que você fizer um push para o branch configurado (geralmente `main` ou `master`), o Vercel automaticamente fará o build e o deploy da nova versão.
*   Lembre-se de aplicar novas migrações do banco de dados se você alterar o `schema.prisma`.

## Solução de Problemas Comuns

*   **Erros de Build**: Verifique os logs de build no Vercel para identificar a causa. Pode ser algo relacionado a dependências, configuração do Next.js, ou as variáveis de ambiente.
*   **Erro 500 ou Problemas de API**: Verifique os logs das funções serverless no dashboard do Vercel. Frequentemente, isso está relacionado à conexão com o banco de dados ou configuração incorreta do `NEXTAUTH_URL` ou `NEXTAUTH_SECRET`.
*   **Migrações não aplicadas**: Certifique-se de que o comando `prisma migrate deploy` foi executado corretamente contra o banco de dados de produção.

Seguindo estes passos, você deverá conseguir implantar sua aplicação "agenda-pocketplanner" no Vercel com sucesso!

