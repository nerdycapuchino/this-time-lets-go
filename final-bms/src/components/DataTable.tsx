'use client';

import { ReactNode } from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  loading?: boolean;
  striped?: boolean;
}

export default function DataTable<T extends Record<string, any>>(
  props: DataTableProps<T>
) {
  const {
    columns,
    data,
    title,
    subtitle,
    emptyMessage = 'No data available',
    onRowClick,
    loading = false,
    striped = true,
  } = props;

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded p-6">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(title || subtitle) && (
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
        {data.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            {emptyMessage}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                    style={{ width: col.width }}
                  >
                    {col.sortable ? (
                      <button className="hover:text-slate-300 transition-colors">
                        {col.label}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`border-b border-slate-800 transition-colors ${
                    striped && rowIdx % 2 !== 0 ? 'bg-slate-800/30' : ''
                  } ${
                    onRowClick
                      ? 'hover:bg-slate-800/50 cursor-pointer'
                      : ''
                  }`}
                  onClick={() => onRowClick?.(row, rowIdx)}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-6 py-4 text-sm text-slate-300"
                    >
                      {col.render
                        ? col.render(row[col.key as keyof T], row, rowIdx)
                        : String(row[col.key as keyof T] || '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
