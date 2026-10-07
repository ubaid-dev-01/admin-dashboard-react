import React, { useState, useMemo } from 'react';
import { TableHeader, Column } from './TableHeader';
import { TableBody } from './TableBody';
import { TablePagination } from './TablePagination';

interface TableProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
  initialPageSize?: number;
}

export const Table: React.FC<TableProps> = ({ 
  data,
  columns,
  isLoading = false,
  initialPageSize = 30
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  } | null>(null);

  const handleSort = (key: string) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig && prevSortConfig.key === key) {
        // Toggle direction or reset if already descending
        const nextDirection = prevSortConfig.direction === 'asc' ? 'desc' : null;
        return nextDirection ? { key, direction: nextDirection } : null;
      }
      // Initial sort (ascending)
      return { key, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig || !data) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] === null) return 1;
      if (b[sortConfig.key] === null) return -1;
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData?.slice(startIndex, startIndex + pageSize) || [];
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil((data?.length || 0) / pageSize);

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <TableHeader 
            columns={columns} 
            sortConfig={sortConfig || undefined} 
            onSort={handleSort} 
          />
          <TableBody 
            data={paginatedData} 
            columns={columns} 
            isLoading={isLoading} 
          />
        </table>
      </div>
      
      {!isLoading && data && data.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalItems={data.length}
        />
      )}
    </div>
  );
};