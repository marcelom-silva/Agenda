// app/api/financial-entries/[entryId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary
import prisma from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library"; // Import Decimal

interface Params {
  params: { entryId: string };
}

// GET: Obter uma entrada financeira específica
export async function GET(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const { entryId } = params;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const financialEntry = await prisma.financialEntry.findUnique({
      where: {
        id: entryId,
        userId: session.user.id, // Garante que o usuário só possa acessar suas próprias entradas
      },
    });

    if (!financialEntry) {
      return NextResponse.json({ error: "Entrada financeira não encontrada" }, { status: 404 });
    }
    return NextResponse.json(financialEntry);
  } catch (error) {
    console.error("Erro ao buscar entrada financeira:", error);
    return NextResponse.json({ error: "Erro ao buscar entrada financeira" }, { status: 500 });
  }
}

// PUT: Atualizar uma entrada financeira existente
export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const { entryId } = params;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { description, amount, type, category, dueDate, isRecurring, recurrenceRule, paid, paidDate } = body;

    // Verificar se a entrada pertence ao usuário
    const existingEntry = await prisma.financialEntry.findFirst({
        where: { id: entryId, userId: session.user.id }
    });

    if (!existingEntry) {
        return NextResponse.json({ error: "Entrada financeira não encontrada ou não pertence ao usuário" }, { status: 404 });
    }
    
    if (type && type !== "expense" && type !== "income") {
        return NextResponse.json({ error: "Tipo inválido. Deve ser 'expense' ou 'income'."}, { status: 400 });
    }

    const updatedFinancialEntry = await prisma.financialEntry.update({
      where: {
        id: entryId,
      },
      data: {
        description,
        amount: amount !== undefined ? new Decimal(amount) : undefined,
        type,
        category,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        isRecurring,
        recurrenceRule,
        paid,
        paidDate: paidDate ? new Date(paidDate) : undefined,
        // Não permitir que userId seja alterado
      },
    });
    return NextResponse.json(updatedFinancialEntry);
  } catch (error) {
    console.error("Erro ao atualizar entrada financeira:", error);
    if (error instanceof Error && error.message.includes("validation")) {
        return NextResponse.json({ error: "Dados inválidos para atualizar entrada financeira", details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao atualizar entrada financeira" }, { status: 500 });
  }
}

// DELETE: Excluir uma entrada financeira
export async function DELETE(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const { entryId } = params;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Verificar se a entrada pertence ao usuário antes de deletar
    const entryToDelete = await prisma.financialEntry.findFirst({
        where: { id: entryId, userId: session.user.id }
    });

    if (!entryToDelete) {
        return NextResponse.json({ error: "Entrada financeira não encontrada ou não pertence ao usuário" }, { status: 404 });
    }

    await prisma.financialEntry.delete({
      where: {
        id: entryId,
      },
    });
    return NextResponse.json({ message: "Entrada financeira excluída com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir entrada financeira:", error);
    return NextResponse.json({ error: "Erro ao excluir entrada financeira" }, { status: 500 });
  }
}

