import React from 'react';
import { Column } from './TableHeader';

interface TableBodyProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
}

export const TableBody: React.FC<TableBodyProps> = ({ 
  data, 
  columns,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <tbody>
        {Array(5).fill(0).map((_, i) => (
          <tr key={i} className="animate-pulse">
            {columns.map((column) => (
              <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  if (!data || data.length === 0) {
    return (
      <tbody>
        <tr>
          <td 
            colSpan={columns.length} 
            className="px-6 py-12 whitespace-nowrap text-center text-gray-500"
          >
            No data available
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, rowIndex) => (
        <tr 
          key={rowIndex} 
          className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
        >
          {columns.map((column) => (
            <td key={column.id} className="px-6 py-4 whitespace-nowrap">
              {column.cell 
                ? column.cell({ row, value: column.accessorKey ? row[column.accessorKey] : null })
                : column.accessorKey 
                  ? row[column.accessorKey] 
                  : null
              }
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};