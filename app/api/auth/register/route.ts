// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    console.log('[REGISTRO DEBUG] Iniciando processo de registro');
    const body = await request.json();
    const { name, email, password } = body;
    console.log(`[REGISTRO DEBUG] Dados recebidos: nome=${name}, email=${email}, senha=***`);

    // Validação básica
    if (!name || !email || !password) {
      console.log('[REGISTRO DEBUG] Validação falhou: campos obrigatórios ausentes');
      return NextResponse.json(
        { message: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o email já está em uso
    try {
      console.log(`[REGISTRO DEBUG] Verificando se email já existe: ${email}`);
      console.log('[REGISTRO DEBUG] Detalhes do Prisma:', {
        databaseUrl: process.env.DATABASE_URL || 'não definido',
        nodeEnv: process.env.NODE_ENV || 'não definido'
      });
      
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        console.log('[REGISTRO DEBUG] Email já em uso');
        return NextResponse.json(
          { message: 'Este email já está em uso' },
          { status: 400 }
        );
      }
      console.log('[REGISTRO DEBUG] Email disponível para registro');
    } catch (dbError) {
      console.error('[REGISTRO DEBUG] Erro ao verificar usuário existente:', dbError);
      // Retornar detalhes do erro para depuração em produção
      return NextResponse.json(
        { 
          message: 'Não foi possível verificar o cadastro. Por favor, tente novamente mais tarde.',
          debug: {
            errorMessage: dbError instanceof Error ? dbError.message : 'Erro desconhecido',
            errorStack: dbError instanceof Error ? dbError.stack : 'Stack não disponível',
            errorType: dbError instanceof Error ? dbError.constructor.name : typeof dbError
          }
        },
        { status: 503 }
      );
    }

    // Hash da senha
    console.log('[REGISTRO DEBUG] Gerando hash da senha');
    const hashedPassword = await hash(password, 10);

    try {
      // Criar o usuário com tratamento de erro específico
      console.log('[REGISTRO DEBUG] Tentando criar usuário no banco de dados');
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Retornar o usuário criado (sem a senha)
      const { password: _, ...userWithoutPassword } = user;
      console.log('[REGISTRO DEBUG] Usuário criado com sucesso:', userWithoutPassword);
      
      return NextResponse.json(
        { 
          message: 'Usuário registrado com sucesso',
          user: userWithoutPassword
        },
        { status: 201 }
      );
    } catch (createError) {
      console.error('[REGISTRO DEBUG] Erro específico ao criar usuário:', createError);
      
      // Retornar detalhes do erro para depuração em produção
      return NextResponse.json(
        { 
          message: 'Não foi possível criar sua conta. Por favor, tente novamente mais tarde.',
          debug: {
            errorMessage: createError instanceof Error ? createError.message : 'Erro desconhecido',
            errorStack: createError instanceof Error ? createError.stack : 'Stack não disponível',
            errorType: createError instanceof Error ? createError.constructor.name : typeof createError
          }
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('[REGISTRO DEBUG] Erro geral ao registrar usuário:', error);
    
    // Retornar detalhes do erro para depuração em produção
    return NextResponse.json(
      { 
        message: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
        debug: {
          errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
          errorStack: error instanceof Error ? error.stack : 'Stack não disponível',
          errorType: error instanceof Error ? error.constructor.name : typeof error
        }
      },
      { status: 500 }
    );
  }
}
