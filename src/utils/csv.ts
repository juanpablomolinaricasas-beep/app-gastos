import { Category, Expense } from '../types';

export function exportExpensesToCSV(expenses: Expense[], categories: Category[]): void {
  const nameById = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const header = ['Fecha', 'Categoria', 'Monto', 'Nota'];
  const rows = expenses
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => [e.date, nameById[e.categoryId] ?? e.categoryId, e.amount.toFixed(2), e.note]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gastos-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
