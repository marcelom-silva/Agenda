"use client";

import React, { useState, useEffect, useCallback } from 'react';
import FinancialPieChart from './components/FinancialPieChart';
import FinancialForecastChart from './components/FinancialForecastChart';
import FinancialEntryForm from './components/FinancialEntryForm';
import FinancialEntriesList from './components/FinancialEntriesList';

export interface FinancialEntry {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  dueDate: string; 
  isRecurring?: boolean;
  recurrenceRule?: string | null;
  paid?: boolean;
  paidDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

const FinanceiroPage: React.FC = () => {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchFinancialEntries = useCallback(async (month: number, year: number) => {
    setIsLoading(true);
    try {
      // TODO: Adjust API to accept month and year for filtering if implemented on backend
      // const response = await fetch(`/api/financial-entries?month=${month + 1}&year=${year}`);
      const response = await fetch('/api/financial-entries');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data: FinancialEntry[] = await response.json();
      // Filter by month and year on client-side if not done by API
      data = data.filter(entry => {
          const entryDate = new Date(entry.dueDate);
          return entryDate.getMonth() === month && entryDate.getFullYear() === year;
      });
      setEntries(data.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()));
    } catch (error) {
      console.error("Falha ao buscar entradas financeiras:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinancialEntries(currentMonth, currentYear);
  }, [fetchFinancialEntries, currentMonth, currentYear]);

  const handleOpenForm = (entry?: FinancialEntry) => {
    setEditingEntry(entry || null);
    setShowEntryForm(true);
  };

  const handleCloseForm = () => {
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  const handleSaveSuccess = () => {
    fetchFinancialEntries(currentMonth, currentYear);
    handleCloseForm();
  };

  const handleDeleteSuccess = async (entryId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta entrada?")) return;
    try {
      const response = await fetch(`/api/financial-entries/${entryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchFinancialEntries(currentMonth, currentYear);
    } catch (error) {
      console.error("Falha ao excluir entrada:", error);
      alert(`Erro ao excluir: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const pieChartData = entries
    .filter(entry => entry.type === 'expense')
    .reduce((acc, entry) => {
      const existingCategory = acc.find(item => item.name === entry.category);
      if (existingCategory) {
        existingCategory.value += entry.amount;
      } else {
        acc.push({ name: entry.category, value: entry.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  // TODO: Elaborate forecast data logic
  const forecastData = [
    { name: new Date(currentYear, currentMonth).toLocaleString('default', { month: 'short' }), Gastos: entries.filter(e=>e.type === 'expense').reduce((sum, e) => sum + e.amount, 0), Receitas: entries.filter(e=>e.type === 'income').reduce((sum, e) => sum + e.amount, 0) },
  ];

  const changeMonth = (offset: number) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Gerenciamento Financeiro</h1>
        <button onClick={() => handleOpenForm()} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Nova Entrada</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <button onClick={() => changeMonth(-1)} style={{ padding: '8px 12px' }}>&lt; Mês Anterior</button>
        <h2>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => changeMonth(1)} style={{ padding: '8px 12px' }}>Próximo Mês &gt;</button>
      </div>

      {isLoading ? (
        <p style={{ textAlign: 'center' }}>Carregando dados financeiros...</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
              <h2>Gastos por Categoria</h2>
              <FinancialPieChart data={pieChartData.length > 0 ? pieChartData : [{name: "Sem despesas", value: 1}]} />
            </div>
            <div style={{ flex: 1, minWidth: '300px', border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
              <h2>Resumo do Mês</h2> {/* Changed from Previsão to Resumo for current month focus */}
              <FinancialForecastChart data={forecastData} />
            </div>
          </div>
          <div>
            <h2>Entradas do Mês</h2>
            <FinancialEntriesList entries={entries} onEdit={handleOpenForm} onDelete={handleDeleteSuccess} />
          </div>
        </>
      )}

      {showEntryForm && (
        <FinancialEntryForm 
          isOpen={showEntryForm} 
          onClose={handleCloseForm} 
          onSave={handleSaveSuccess}
          entry={editingEntry} 
        />
      )}
    </div>
  );
};

export default FinanceiroPage;

