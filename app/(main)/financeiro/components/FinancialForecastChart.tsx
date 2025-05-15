import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data - this would come from API/database
const sampleForecastData = [
  { name: 'Jan', Gastos: 4000, Receitas: 5000 },
  { name: 'Fev', Gastos: 3000, Receitas: 4500 },
  { name: 'Mar', Gastos: 2000, Receitas: 6000 },
  { name: 'Abr', Gastos: 2780, Receitas: 3908 },
  { name: 'Mai', Gastos: 1890, Receitas: 4800 },
  { name: 'Jun', Gastos: 2390, Receitas: 3800 },
  { name: 'Jul', Gastos: 3490, Receitas: 4300 },
];

interface FinancialForecastChartProps {
  data?: Array<{ name: string; Gastos: number; Receitas: number }>;
}

const FinancialForecastChart: React.FC<FinancialForecastChartProps> = ({ data = sampleForecastData }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <Legend />
          <Line type="monotone" dataKey="Receitas" stroke="#82ca9d" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Gastos" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialForecastChart;

