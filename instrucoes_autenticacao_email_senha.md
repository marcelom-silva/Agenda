# Implementação de Autenticação por Email e Senha no Agenda PocketPlanner

Este documento contém instruções para implementar a autenticação por email e senha no Agenda PocketPlanner, como alternativa temporária enquanto resolvemos os problemas com a autenticação OAuth do Google.

## Arquivos Incluídos

1. `prisma/schema_updated.prisma` - Schema atualizado com campo de senha
2. `lib/authOptions_credentials.ts` - Configuração do NextAuth com CredentialsProvider
3. `app/auth/login/page.tsx` - Página de login
4. `app/auth/register/page.tsx` - Página de registro
5. `app/api/auth/register/route.ts` - API para registro de usuários

## Passos para Implementação

### 1. Atualizar o Schema do Prisma

1. Substitua o conteúdo do arquivo `prisma/schema.prisma` pelo conteúdo do arquivo `prisma/schema_updated.prisma`
2. Execute a migração do banco de dados:
   ```bash
   npx prisma migrate dev --name add_password_field
   ```

### 2. Instalar Dependências Necessárias

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

### 3. Configurar o NextAuth

1. Substitua o conteúdo do arquivo `lib/authOptions.ts` pelo conteúdo do arquivo `lib/authOptions_credentials.ts`

### 4. Adicionar Páginas de Autenticação

1. Crie a pasta `app/auth/login` e adicione o arquivo `page.tsx` com o conteúdo fornecido
2. Crie a pasta `app/auth/register` e adicione o arquivo `page.tsx` com o conteúdo fornecido

### 5. Adicionar API de Registro

1. Crie a pasta `app/api/auth/register` e adicione o arquivo `route.ts` com o conteúdo fornecido

### 6. Configurar Redirecionamento

1. Atualize o arquivo `app/page.tsx` para redirecionar para a página de login:

```tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/auth/login');
}
```

## Como Testar

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:3000` e você será redirecionado para a página de login

3. Clique em "Registre-se" para criar uma nova conta

4. Após o registro, faça login com as credenciais criadas

5. Você será redirecionado para o dashboard após o login bem-sucedido

## Observações Importantes

- Esta implementação mantém os provedores OAuth (Google e GitHub) configurados, então você pode continuar tentando resolver os problemas com eles paralelamente.
- As senhas são armazenadas de forma segura usando hash bcrypt.
- Você pode personalizar as páginas de login e registro conforme necessário para se adequar ao design do seu aplicativo.
- Lembre-se de atualizar as variáveis de ambiente no Vercel após o deploy.

## Próximos Passos

Após implementar e testar a autenticação por email e senha, você pode:

1. Continuar o desenvolvimento e teste das funcionalidades do dashboard
2. Trabalhar na resolução dos problemas com a autenticação OAuth do Google
3. Adicionar recursos adicionais como recuperação de senha, verificação de email, etc.

Se precisar de mais ajuda ou tiver dúvidas, estou à disposição!
