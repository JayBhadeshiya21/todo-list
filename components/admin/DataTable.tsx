import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Column {
  key: string;
  header: string;
  render?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete: (item: any) => void;
  title: string;
  onCreate?: () => void;
  isLoading?: boolean;
}

export function DataTable({ columns, data, onEdit, onDelete, title, onCreate, isLoading }: DataTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        {onCreate && (
          <Button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700">
            + Add New
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 uppercase font-medium border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-zinc-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
                <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-zinc-500">
                        No records found.
                    </td>
                </tr>
            ) : (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-zinc-900 dark:text-zinc-300">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right space-x-2">
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(item)}
                          className="text-zinc-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => onDelete(item)}
                        className="text-zinc-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
