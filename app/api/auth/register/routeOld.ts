// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validação básica
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email já está em uso' },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await hash(password, 10);

    try {
      // Criar o usuário com tratamento de erro específico
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Retornar o usuário criado (sem a senha)
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json(
        { 
          message: 'Usuário registrado com sucesso',
          user: userWithoutPassword
        },
        { status: 201 }
      );
    } catch (error: unknown) {
      console.error('Erro específico ao criar usuário:', error);
      
      // Verificar se é um erro relacionado ao schema
      if (error instanceof Error && error.message.includes('password')) {
        return NextResponse.json(
          { message: 'Erro no schema do banco de dados. Verifique se o campo password está definido no modelo User.' },
          { status: 500 }
        );
      }
      
      throw error; // Propagar para o catch externo
    }
  } catch (error: unknown) {
    console.error('Erro ao registrar usuário:', error);
    
    // Mensagem de erro mais detalhada
    const errorMessage = error instanceof Error 
      ? `Erro ao registrar usuário: ${error.message}` 
      : 'Erro desconhecido ao registrar usuário';
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
