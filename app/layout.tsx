// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers"; // Importando o novo componente Providers

export const metadata: Metadata = {
  title: "Agenda Pocket Planner",
  description: "Sua agenda pessoal e financeira",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers> {/* Envolvendo children com Providers */}
      </body>
    </html>
  );
}

