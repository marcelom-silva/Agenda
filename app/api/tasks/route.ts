// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ajuste o caminho se necessário
import prisma from "@/lib/db";

// GET: Listar tarefas do usuário logado
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        order: "asc", // Ou createdAt, ou como preferir
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    return NextResponse.json({ error: "Erro ao buscar tarefas" }, { status: 500 });
  }
}

// POST: Criar uma nova tarefa
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, status, dueDate, colorTag, isRecurring, recurrenceRule, order } = body;

    if (!title) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "todo",
        dueDate: dueDate ? new Date(dueDate) : null,
        colorTag,
        isRecurring,
        recurrenceRule,
        order,
        userId: session.user.id,
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    // Adicionar mais detalhes do erro se for um erro de validação do Prisma, por exemplo
    if (error instanceof Error && error.message.includes("validation")) {
        return NextResponse.json({ error: "Dados inválidos para criar tarefa", details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar tarefa" }, { status: 500 });
  }
}

