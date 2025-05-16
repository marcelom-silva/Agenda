// app/api/tasks/[taskId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Importação com caminho absoluto
import { prisma } from "@/lib/db"; // Importação com caminho absoluto corrigida

interface Params {
  params: { taskId: string };
}

// GET: Obter uma tarefa específica (pode não ser necessário se o GET geral for suficiente)
export async function GET(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const { taskId } = params;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId: session.user.id, // Garante que o usuário só possa acessar suas próprias tarefas
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    return NextResponse.json({ error: "Erro ao buscar tarefa" }, { status: 500 });
  }
}

// PUT: Atualizar uma tarefa existente
export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const { taskId } = params;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    // Validar quais campos podem ser atualizados
    const { title, description, status, dueDate, colorTag, isRecurring, recurrenceRule, order } = body;

    // Verificar se a tarefa pertence ao usuário
    const existingTask = await prisma.task.findFirst({
        where: { id: taskId, userId: session.user.id }
    });

    if (!existingTask) {
        return NextResponse.json({ error: "Tarefa não encontrada ou não pertence ao usuário" }, { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        // Adicionar userId aqui também para segurança, embora já verificado acima
        // userId: session.user.id, 
      },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined, // undefined para não alterar se não fornecido
        colorTag,
        isRecurring,
        recurrenceRule,
        order,
        // Não permitir que userId seja alterado
      },
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    if (error instanceof Error && error.message.includes("validation")) {
        return NextResponse.json({ error: "Dados inválidos para atualizar tarefa", details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao atualizar tarefa" }, { status: 500 });
  }
}

// DELETE: Excluir uma tarefa
export async function DELETE(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const { taskId } = params;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Verificar se a tarefa pertence ao usuário antes de deletar
    const taskToDelete = await prisma.task.findFirst({
        where: { id: taskId, userId: session.user.id }
    });

    if (!taskToDelete) {
        return NextResponse.json({ error: "Tarefa não encontrada ou não pertence ao usuário" }, { status: 404 });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
        // userId: session.user.id, // Prisma delete não suporta múltiplos campos no where unique por padrão assim
      },
    });
    return NextResponse.json({ message: "Tarefa excluída com sucesso" }, { status: 200 }); // Ou 204 No Content
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    return NextResponse.json({ error: "Erro ao excluir tarefa" }, { status: 500 });
  }
}

