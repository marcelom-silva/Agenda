"use client";

import React from 'react';
import { FinancialEntry } from '../page'; // Assuming FinancialEntry interface is in ../page.tsx

interface FinancialEntriesListProps {
  entries: FinancialEntry[];
  onEdit: (entry: FinancialEntry) => void;
  onDelete: (entryId: string) => void; // Callback to trigger delete and refetch
  // TODO: Add filter/sort state and handlers if managed here
}

const FinancialEntriesList: React.FC<FinancialEntriesListProps> = ({ entries, onEdit, onDelete }) => {
  if (entries.length === 0) {
    return <p>Nenhuma entrada financeira registrada para o período selecionado.</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Descrição</th>
            <th style={tableHeaderStyle}>Valor (R$)</th>
            <th style={tableHeaderStyle}>Tipo</th>
            <th style={tableHeaderStyle}>Categoria</th>
            <th style={tableHeaderStyle}>Vencimento</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} style={getRowStyle(entry.type)}>
              <td style={tableCellStyle}>{entry.description}</td>
              <td style={tableCellStyle}>{entry.amount.toFixed(2)}</td>
              <td style={tableCellStyle}>{entry.type === 'income' ? 'Receita' : 'Despesa'}</td>
              <td style={tableCellStyle}>{entry.category}</td>
              <td style={tableCellStyle}>{new Date(entry.dueDate).toLocaleDateString()}</td>
              <td style={tableCellStyle}>{entry.paid ? `Pago em ${entry.paidDate ? new Date(entry.paidDate).toLocaleDateString() : ''}` : 'Pendente'}</td>
              <td style={tableCellStyleLast}>
                <button 
                  onClick={() => onEdit(entry)} 
                  style={{ marginRight: '5px', padding: '5px 8px', fontSize: '12px' }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => onDelete(entry.id)} 
                  style={{ padding: '5px 8px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle: React.CSSProperties = {
  borderBottom: "2px solid #dee2e6",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f8f9fa"
};

const tableCellStyle: React.CSSProperties = {
  borderBottom: "1px solid #e9ecef",
  padding: "10px 12px",
  verticalAlign: "top"
};

const tableCellStyleLast: React.CSSProperties = {
    ...tableCellStyle,
    whiteSpace: "nowrap" // Prevent buttons from wrapping
}

const getRowStyle = (type: 'income' | 'expense'): React.CSSProperties => ({
    backgroundColor: type === 'income' ? '#e6ffed' : '#ffebee',
});

export default FinancialEntriesList;

