// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
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

    // Criar o usuário
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
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      { message: 'Erro ao registrar usuário' },
      { status: 500 }
    );
  }
}
