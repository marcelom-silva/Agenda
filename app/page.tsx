"use client"
import Kanban from "./components/Kanban";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Agenda Estratégias Airdrops</h1>
      <Kanban />
    </main>
  );
}
