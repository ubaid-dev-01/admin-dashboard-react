import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Table } from '../components/ui/Table/Table';
import { Column } from '../components/ui/Table/TableHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { SaleForm } from '../components/sales/SaleForm';

import { Sale } from '../types';
import { fetchData, createItem, updateItem, deleteItem } from '../api/apiClient';

export const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    const loadSales = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData<Sale>('sales');
        setSales(data);
        setFilteredSales(data);
      } catch (error) {
        toast.error('Failed to load sales');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSales();
  }, []);

  useEffect(() => {
    let filtered = [...sales];
    
    // Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      const start = parse(dateRange.startDate, 'yyyy-MM-dd', new Date());
      const end = parse(dateRange.endDate, 'yyyy-MM-dd', new Date());
      
      if (isValid(start) && isValid(end)) {
        filtered = filtered.filter(sale => {
          const saleDate = parse(sale.sale_date, 'yyyy-MM-dd', new Date());
          return saleDate >= start && saleDate <= end;
        });
      }
    }
    
    setFilteredSales(filtered);
  }, [dateRange, sales]);

  const handleCreateSale = async (data: Partial<Sale>) => {
    try {
      setIsSubmitting(true);
      await createItem<Sale>('sales', data as Omit<Sale, 'id'>);
      const updatedSales = await fetchData<Sale>('sales');
      setSales(updatedSales);
      setFilteredSales(updatedSales);
      setShowCreateModal(false);
      toast.success('Sale recorded successfully');
    } catch (error) {
      toast.error('Failed to record sale');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSale = async (data: Partial<Sale>) => {
    if (!selectedSale) return;
    
    try {
      setIsSubmitting(true);
      await updateItem<Sale>('sales', selectedSale.sale_id, data);
      const updatedSales = await fetchData<Sale>('sales');
      setSales(updatedSales);
      setFilteredSales(updatedSales);
      setShowEditModal(false);
      setSelectedSale(null);
      toast.success('Sale updated successfully');
    } catch (error) {
      toast.error('Failed to update sale');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSale = async () => {
    if (!selectedSale) return;
    
    try {
      setIsSubmitting(true);
      await deleteItem('sales', selectedSale.sale_id);
      const updatedSales = sales.filter(sale => sale.sale_id !== selectedSale.sale_id);
      setSales(updatedSales);
      setFilteredSales(updatedSales);
      setShowDeleteModal(false);
      setSelectedSale(null);
      toast.success('Sale deleted successfully');
    } catch (error) {
      toast.error('Failed to delete sale');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD'
  //   }).format(amount);
  // };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      // minimumFractionDigits: 0,
      // maximumFractionDigits: 0
    })
    .format(amount)
    // .replace('PKR', 'Rs.'); // Custom symbol replacement
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const columns = useMemo<Column[]>(() => [
    {
      id: 'sale_id',
      header: 'ID',
      accessorKey: 'sale_id',
      isSortable: true
    },
    {
      id: 'acc_uid',
      header: 'Account UID',
      accessorKey: 'acc_uid',
      isSortable: true
    },
    {
      id: 'crates',
      header: 'Crates',
      accessorKey: 'crates',
      isSortable: true
    },
    {
      id: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const sale = row as Sale;
        return formatCurrency(sale.price);
      },
      isSortable: true
    },
    {
      id: 'sale_date',
      header: 'Sale Date',
      cell: ({ row }) => {
        const sale = row as Sale;
        return formatDate(sale.sale_date);
      },
      isSortable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const sale = row as Sale;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedSale(sale);
                setShowEditModal(true);
              }}
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedSale(sale);
                setShowDeleteModal(true);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        );
      }
    }
  ], []);

  // Calculate totals for dashboard cards
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.price, 0);
  const totalCrates = sales.reduce((sum, sale) => sum + sale.crates, 0);

  return (
    <DashboardLayout title="Sales">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales</h2>
          <p className="text-gray-500">Track and manage sales records</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          icon={<Plus size={16} />}
        >
          Record Sale
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Total Sales" className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-3xl font-bold text-blue-700">{totalSales}</div>
        </Card>
        
        <Card title="Total Revenue" className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="text-3xl font-bold text-green-700">
            {formatCurrency(totalRevenue)}
          </div>
        </Card>
        
        <Card title="Total Crates" className="bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="text-3xl font-bold text-amber-700">{totalCrates}</div>
        </Card>
      </div>
      
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <Input
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              icon={<Calendar size={18} />}
              fullWidth
            />
          </div>
          <div className="flex-1">
            <Input
              label="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              icon={<Calendar size={18} />}
              fullWidth
            />
          </div>
          <div>
            <Button 
              onClick={() => setDateRange({ startDate: '', endDate: '' })}
              variant="outline"
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>
      
      <Card>
        <Table 
          data={filteredSales} 
          columns={columns} 
          isLoading={isLoading} 
        />
      </Card>
      
      {/* Create Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Record New Sale"
      >
        <SaleForm 
          onSubmit={handleCreateSale}
          isSubmitting={isSubmitting}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
      
      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title={`Edit Sale #${selectedSale?.sale_id}`}
      >
        {selectedSale && (
          <SaleForm 
            sale={selectedSale}
            onSubmit={handleUpdateSale}
            isSubmitting={isSubmitting}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete sale #{selectedSale?.sale_id}?
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteSale}
              isLoading={isSubmitting}
            >
              Delete Sale
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};