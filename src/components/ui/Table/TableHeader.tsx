import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface Column {
  id: string;
  header: string;
  accessorKey?: string;
  cell?: (info: any) => React.ReactNode;
  isSortable?: boolean;
}

interface TableHeaderProps {
  columns: Column[];
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc' | null;
  };
  onSort?: (key: string) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ 
  columns, 
  sortConfig, 
  onSort 
}) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th 
            key={column.id}
            scope="col" 
            className={`
              px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
              ${column.isSortable ? 'cursor-pointer select-none' : ''}
            `}
            onClick={() => {
              if (column.isSortable && onSort) {
                onSort(column.id);
              }
            }}
          >
            <div className="flex items-center space-x-1">
              <span>{column.header}</span>
              {column.isSortable && sortConfig && sortConfig.key === column.id && (
                <span className="inline-flex">
                  {sortConfig.direction === 'asc' ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};