"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import PushNotificationManager from "./components/PushNotificationManager"; // Importar o gerenciador

export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/api/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Carregando sua sessão...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <PushNotificationManager /> {/* Adicionar o gerenciador de notificações aqui */}
      <aside style={{ width: "250px", backgroundColor: "#f0f0f0", padding: "20px", display: "flex", flexDirection: "column" }}>
        <div>
          <h2>PocketPlanner</h2>
          <nav>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}><Link href="/dashboard">Dashboard (Tarefas)</Link></li>
              <li style={{ marginBottom: "10px" }}><Link href="/financeiro">Financeiro</Link></li>
              {/* Adicionar mais links de navegação aqui (Configurações, etc.) */}
            </ul>
          </nav>
        </div>
        <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid #ccc" }}>
          <p>Usuário: {session.user?.name || session.user?.email}</p>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Sair
          </button>
        </div>
      </aside>
      <main style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}

