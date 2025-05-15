// app/api/save-subscription/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary
import prisma from "@/lib/db";

// POST: Salvar a inscrição push do usuário
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const subscription = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Dados de inscrição inválidos" }, { status: 400 });
    }

    // TODO: Em um cenário real, você salvaria esta inscrição no banco de dados,
    // associada ao session.user.id.
    // Por exemplo:
    // await prisma.pushSubscription.upsert({
    //   where: { endpoint: subscription.endpoint }, // Ou um ID de usuário se cada usuário só pode ter uma
    //   update: { ...subscription, userId: session.user.id },
    //   create: { ...subscription, userId: session.user.id },
    // });

    console.log("Inscrição Push Recebida:", subscription);
    // Por enquanto, apenas confirmamos o recebimento.
    return NextResponse.json({ message: "Inscrição recebida com sucesso" }, { status: 201 });

  } catch (error) {
    console.error("Erro ao salvar inscrição push:", error);
    if (error instanceof Error && error.message.includes("validation")) {
        return NextResponse.json({ error: "Dados inválidos para salvar inscrição", details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao salvar inscrição push" }, { status: 500 });
  }
}

