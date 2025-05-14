import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Exemplo de dados - isso viria da API/banco de dados
const dataExemploGastos = [
  { name: 'Alimentação', value: 400 },
  { name: 'Transporte', value: 300 },
  { name: 'Moradia', value: 800 },
  { name: 'Lazer', value: 200 },
  { name: 'Outros', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface FinancialPieChartProps {
  data?: { name: string; value: number }[]; // Tornar os dados opcionais para o exemplo inicial
}

const FinancialPieChart: React.FC<FinancialPieChartProps> = ({ data = dataExemploGastos }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialPieChart;

