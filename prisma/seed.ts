// prisma/seed.ts
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// IMPORTANTE: O usuário deve substituir este ID pelo SEU userId após criar uma conta na aplicação.
// Este ID é apenas um placeholder e o script NÃO FUNCIONARÁ corretamente sem o ID do usuário real.
const USER_ID_PLACEHOLDER = "seu-user-id-aqui";

const airdropTasks: Omit<Prisma.TaskCreateManyInput, "userId">[] = [
  // Segunda-feira
  { title: "Coletar $veSONIC e resgatar por $SONIC (Sonic Node)", description: "Perfil principal", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO", colorTag: "#4287f5", originalDueDateForRecurrence: new Date() },
  { title: "Coletar $LAYER (Solayer)", description: "Perfil principal", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO", colorTag: "#42f5ad", originalDueDateForRecurrence: new Date() },
  { title: "Coletar $NIRV e trocar por $USDC (Nirvana)", description: "Perfil 5", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO", colorTag: "#f542d4", originalDueDateForRecurrence: new Date() },
  { title: "Coletar $ORE (ORE)", description: "Perfil principal", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO", colorTag: "#f5a442", originalDueDateForRecurrence: new Date() },
  { title: "Check-in diário (LANCA)", description: "Todos os perfis", status: "todo", isRecurring: true, recurrenceRule: "FREQ=DAILY", colorTag: "#7e42f5", originalDueDateForRecurrence: new Date() }, // LANCA é diário, então uma entrada geral
  { title: "Estratégias MegaETH", description: "Perfis 0,1,2,3,Manu", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO", colorTag: "#f54242", originalDueDateForRecurrence: new Date() },
  { title: "Estratégias MONAD", description: "Perfis 0,1,2,3,Manu", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO", colorTag: "#f56942", originalDueDateForRecurrence: new Date() },
  { title: "Usar bate-papo SESSION", description: "Perfil principal", status: "todo", isRecurring: true, recurrenceRule: "FREQ=DAILY", colorTag: "#42c5f5", originalDueDateForRecurrence: new Date() }, // SESSION é diário
  { title: "Usar bate-papo e Check-in diário (TOWNS)", description: "Todos os perfis", status: "todo", isRecurring: true, recurrenceRule: "FREQ=DAILY", colorTag: "#42f584", originalDueDateForRecurrence: new Date() }, // TOWNS é diário
  { title: "Estratégias TITAN (aprox. 20x/dia)", description: "Perfil principal. Fazer várias vezes ao dia.", status: "todo", isRecurring: true, recurrenceRule: "FREQ=DAILY", colorTag: "#8a42f5", originalDueDateForRecurrence: new Date() }, // TITAN é diário

  // Terça-feira (LANCA, SESSION, TOWNS, TITAN já cobertos por serem diários)
  { title: "Estratégias MegaETH", description: "Perfis 6,7,8,9,Dorita", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=TU", colorTag: "#f54242", originalDueDateForRecurrence: new Date() },
  { title: "Estratégias MONAD", description: "Perfis 6,7,8,9,Dorita", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=TU", colorTag: "#f56942", originalDueDateForRecurrence: new Date() },
  { title: "Criação de threads/memes para X", description: "Conteúdo para redes sociais", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=TU", colorTag: "#26a7de", originalDueDateForRecurrence: new Date() },

  // Quarta-feira (LANCA, SESSION, TOWNS, TITAN já cobertos)
  { title: "Coletar $LAYER (Solayer)", description: "Todos os perfis", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=WE", colorTag: "#42f5ad", originalDueDateForRecurrence: new Date() },
  { title: "Estratégias MegaETH", description: "Perfis 11,12,13,14", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=WE", colorTag: "#f54242", originalDueDateForRecurrence: new Date() },
  { title: "Estratégias MONAD", description: "Perfis 11,12,13,14", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=WE", colorTag: "#f56942", originalDueDateForRecurrence: new Date() },
  { title: "Estratégias SonicLABS e depositar na RIVO", description: "Perfil principal", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=WE", colorTag: "#f5d142", originalDueDateForRecurrence: new Date() },

  // Quinta-feira (LANCA, SESSION, TOWNS, TITAN já cobertos)
  { title: "Estratégias MegaETH", description: "Perfis 16,17,18,19", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=TH", colorTag: "#f54242", originalDueDateForRecurrence: new Date() },
  { title: "Estratégias MONAD", description: "Perfis 16,17,18,19", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=TH", colorTag: "#f56942", originalDueDateForRecurrence: new Date() },
  { title: "SWAP (INFINEX)", description: "Perfil DeFi", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=TH", colorTag: "#42f5e9", originalDueDateForRecurrence: new Date() },

  // Sexta-feira (LANCA, SESSION, TOWNS, TITAN já cobertos)
  // Nenhuma tarefa nova específica de airdrop para sexta, além das diárias.

  // Sábado (LANCA, SESSION, TOWNS, TITAN já cobertos)
  { title: "Estratégias MegaETH", description: "Perfis 4,10,15,20,i9vest", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=SA", colorTag: "#f54242", originalDueDateForRecurrence: new Date() },
  { title: "Estratégias MONAD", description: "Perfis 4,10,15,20,i9vest", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=SA", colorTag: "#f56942", originalDueDateForRecurrence: new Date() },
  { title: "Estratégias SonicLABS e depositar na AAVE", description: "Perfil principal", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=SA", colorTag: "#f5d142", originalDueDateForRecurrence: new Date() },

  // Domingo (LANCA, SESSION, TOWNS já cobertos)
  // Nenhuma tarefa nova específica de airdrop para domingo, além das diárias.
];

const routineTasks: Omit<Prisma.TaskCreateManyInput, "userId">[] = [
  { title: "Academia (21h)", description: "Treino na academia", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH", colorTag: "#3498db", originalDueDateForRecurrence: new Date() }, // Dividido para 4 dias
  { title: "Natação (20h-21h)", description: "Aula de natação", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,WE", colorTag: "#1abc9c", originalDueDateForRecurrence: new Date() }, // Dividido para 2 dias
  { title: "Vôlei", description: "Jogo/treino de vôlei", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=SA", colorTag: "#e67e22", originalDueDateForRecurrence: new Date() },
  { title: "Levar Manu para o SENAC (7h30)", description: "Compromisso familiar", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=TH", colorTag: "#9b59b6", originalDueDateForRecurrence: new Date() },
  { title: "Buscar Dorita na CECB (17h45)", description: "Compromisso familiar", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=TU,TH", colorTag: "#9b59b6", originalDueDateForRecurrence: new Date() },
  { title: "Buscar Dorita na CECB (17h30)", description: "Compromisso familiar", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=WE", colorTag: "#9b59b6", originalDueDateForRecurrence: new Date() },
  { title: "Reunião equipe Banco Central (14h)", description: "Trabalho", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,WE,FR", colorTag: "#e74c3c", originalDueDateForRecurrence: new Date() },
  { title: "Passear com os pets", description: "Lazer/Pets", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,WE,FR,SU", colorTag: "#2ecc71", originalDueDateForRecurrence: new Date() }, // 4x por semana
  { title: "Trabalho Home Office (9h-18h)", description: "Bloco de trabalho principal", status: "todo", isRecurring: true, recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR", colorTag: "#34495e", originalDueDateForRecurrence: new Date() },
];

async function main() {
  console.log("Iniciando o script de semeadura...");

  if (USER_ID_PLACEHOLDER === "seu-user-id-aqui") {
    console.error("ERRO: Por favor, substitua 'USER_ID_PLACEHOLDER' no arquivo prisma/seed.ts pelo ID do seu usuário real.");
    console.error("Você pode obter o ID do usuário após criar uma conta na aplicação (ex: consultando o banco de dados ou através do perfil do usuário, se implementado).");
    console.error("O script de semeadura não será executado até que o ID do usuário seja fornecido.");
    return;
  }

  const allTasks = [
    ...airdropTasks.map(task => ({ ...task, userId: USER_ID_PLACEHOLDER })),
    ...routineTasks.map(task => ({ ...task, userId: USER_ID_PLACEHOLDER })),
  ];

  // Limpar tarefas existentes para este usuário para evitar duplicatas ao rodar o seed múltiplas vezes
  // CUIDADO: Isso removerá todas as tarefas do usuário especificado antes de semear.
  // Comente a linha abaixo se não desejar este comportamento.
  await prisma.task.deleteMany({ where: { userId: USER_ID_PLACEHOLDER } });
  console.log(`Tarefas antigas do usuário ${USER_ID_PLACEHOLDER} foram deletadas.`);

  // SQLite não suporta createMany, então vamos usar um loop com create
  let createdCount = 0;
  for (const task of allTasks) {
    await prisma.task.create({
      data: task
    });
    createdCount++;
  }

  console.log(`${createdCount} tarefas foram criadas com sucesso para o usuário ${USER_ID_PLACEHOLDER}.`);
  console.log("Script de semeadura concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Para executar este script:
// 1. Certifique-se de que suas variáveis de ambiente (DATABASE_URL) estão configuradas em .env
// 2. Substitua USER_ID_PLACEHOLDER pelo ID do usuário real.
// 3. Execute no terminal: npx prisma db seed
//
// Adicione ao seu package.json em "prisma":
// "seed": "ts-node --compiler-options {\\\"module\\\":\\\"CommonJS\\\"} prisma/seed.ts"
// Ou, se estiver usando ES Modules e o Next.js já configura o ts-node adequadamente:
// "seed": "ts-node prisma/seed.ts"
//
// Se ts-node não estiver global ou no projeto, instale: npm install -D ts-node typescript
// E então você pode precisar de um comando mais explícito no package.json ou rodar com `node --loader ts-node/esm prisma/seed.ts` para ESM.
// A forma mais simples é usar o comando que o Prisma sugere na documentação para `prisma db seed`.
