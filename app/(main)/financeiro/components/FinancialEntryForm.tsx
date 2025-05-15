"use client";

import React, { useState, useEffect } from 'react';
import { FinancialEntry } from '../page'; // Assuming FinancialEntry interface is in ../page.tsx

interface FinancialEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // Callback to refetch entries after save
  entry?: FinancialEntry | null; // Entry to edit, if any
}

const FinancialEntryForm: React.FC<FinancialEntryFormProps> = ({ isOpen, onClose, onSave, entry }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | string>(''); // Allow string for input flexibility
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState(''); // Format YYYY-MM-DD for input type="date"
  // TODO: Add fields for isRecurring, recurrenceRule, paid, paidDate
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entry) {
      setDescription(entry.description || '');
      setAmount(entry.amount !== undefined ? entry.amount.toString() : '');
      setType(entry.type || 'expense');
      setCategory(entry.category || '');
      setDueDate(entry.dueDate ? new Date(entry.dueDate).toISOString().split('T')[0] : '');
      // TODO: Set other fields from entry for editing
    } else {
      // Reset form for new entry
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('');
      setDueDate(new Date().toISOString().split('T')[0]); // Default to today
    }
    setError(null); // Clear error when form opens or entry changes
  }, [entry, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!description.trim() || !amount || !dueDate) {
      setError('Descrição, valor e data de vencimento são obrigatórios.');
      setIsSubmitting(false);
      return;
    }
    const numericAmount = parseFloat(String(amount));
    if (isNaN(numericAmount)) {
        setError('O valor deve ser um número.');
        setIsSubmitting(false);
        return;
    }

    const entryData = {
      ...(entry || {}),
      description,
      amount: numericAmount,
      type,
      category: category.trim() || (type === 'expense' ? 'Despesa Diversa' : 'Receita Diversa'),
      dueDate,
      // TODO: Add other fields to entryData
    };

    try {
      let response;
      if (entry && entry.id) {
        // Update existing entry
        response = await fetch(`/api/financial-entries/${entry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData),
        });
      } else {
        // Create new entry
        const { id, ...newEntryData } = entryData as FinancialEntry; // Remove id if present for new entry
        response = await fetch('/api/financial-entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntryData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      onSave(); // Callback to refetch entries
      onClose(); // Close the form

    } catch (err) {
      console.error("Falha ao salvar entrada financeira:", err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>{entry ? 'Editar Entrada Financeira' : 'Nova Entrada Financeira'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="description">Descrição:</label>
            <input 
              type="text" 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required 
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="amount">Valor (R$):</label>
            <input 
              type="number" 
              id="amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required 
              step="0.01"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="type">Tipo:</label>
            <select 
              id="type" 
              value={type} 
              onChange={(e) => setType(e.target.value as 'income' | 'expense')} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="category">Categoria:</label>
            <input 
              type="text" 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="Ex: Alimentação, Salário, Contas"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="dueDate">Data de Vencimento/Ocorrência:</label>
            <input 
              type="date" 
              id="dueDate" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required 
            />
          </div>
          {/* TODO: Add inputs for isRecurring, recurrenceRule, paid, paidDate */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 15px' }} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none' }} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialEntryForm;

