// app/api/financial-entries/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Importação com caminho absoluto
import { prisma } from "@/lib/db"; // Importação com caminho absoluto corrigida
// Removida importação do Decimal que não é mais necessária

// GET: Listar entradas financeiras do usuário logado
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // TODO: Add query params for filtering (month, year, type, category)
  // const { searchParams } = new URL(request.url);
  // const month = searchParams.get("month");
  // const year = searchParams.get("year");

  try {
    const financialEntries = await prisma.financialEntry.findMany({
      where: {
        userId: session.user.id,
        // Add filtering logic here based on query params
      },
      orderBy: {
        dueDate: "desc", // Ou createdAt
      },
    });
    return NextResponse.json(financialEntries);
  } catch (error) {
    console.error("Erro ao buscar entradas financeiras:", error);
    return NextResponse.json({ error: "Erro ao buscar entradas financeiras" }, { status: 500 });
  }
}

// POST: Criar uma nova entrada financeira
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { description, amount, type, category, dueDate, isRecurring, recurrenceRule, paid, paidDate } = body;

    if (!description || amount === undefined || !type || !dueDate) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes (descrição, valor, tipo, data de vencimento)" }, { status: 400 });
    }
    
    if (type !== "expense" && type !== "income") {
        return NextResponse.json({ error: "Tipo inválido. Deve ser 'expense' ou 'income'."}, { status: 400 });
    }

    const newFinancialEntry = await prisma.financialEntry.create({
      data: {
        description,
        amount: parseFloat(amount), // Convertido para Float em vez de Decimal
        type,
        category: category || "Outros", // Default category if not provided
        dueDate: new Date(dueDate),
        isRecurring: isRecurring || false,
        recurrenceRule,
        paid: paid || false,
        paidDate: paidDate ? new Date(paidDate) : null,
        userId: session.user.id,
      },
    });
    return NextResponse.json(newFinancialEntry, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar entrada financeira:", error);
    if (error instanceof Error && error.message.includes("validation")) {
        return NextResponse.json({ error: "Dados inválidos para criar entrada financeira", details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar entrada financeira" }, { status: 500 });
  }
}
