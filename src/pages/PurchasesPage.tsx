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
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { PurchaseForm } from '../components/purchases/PurchaseForm';

import { Purchase, PurchaseType } from '../types';
import { fetchData, createItem, updateItem, deleteItem } from '../api/apiClient';

export const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData<Purchase>('purchases');
        setPurchases(data);
        setFilteredPurchases(data);
      } catch (error) {
        toast.error('Failed to load purchases');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPurchases();
  }, []);

  useEffect(() => {
    let filtered = [...purchases];
    
    // Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      const start = parse(dateRange.startDate, 'yyyy-MM-dd', new Date());
      const end = parse(dateRange.endDate, 'yyyy-MM-dd', new Date());
      
      if (isValid(start) && isValid(end)) {
        filtered = filtered.filter(purchase => {
          const purchaseDate = parse(purchase.purchase_date, 'yyyy-MM-dd', new Date());
          return purchaseDate >= start && purchaseDate <= end;
        });
      }
    }
    
    // Filter by purchase type
    if (selectedType) {
      filtered = filtered.filter(purchase => purchase.purchase_type === selectedType);
    }
    
    setFilteredPurchases(filtered);
  }, [dateRange, selectedType, purchases]);

  const handleCreatePurchase = async (data: Partial<Purchase>) => {
    try {
      setIsSubmitting(true);
      await createItem<Purchase>('purchases', data as Omit<Purchase, 'id'>);
      const updatedPurchases = await fetchData<Purchase>('purchases');
      setPurchases(updatedPurchases);
      setFilteredPurchases(updatedPurchases);
      setShowCreateModal(false);
      toast.success('Purchase recorded successfully');
    } catch (error) {
      toast.error('Failed to record purchase');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePurchase = async (data: Partial<Purchase>) => {
    if (!selectedPurchase) return;
    
    try {
      setIsSubmitting(true);
      await updateItem<Purchase>('purchases', selectedPurchase.purchase_id, data);
      const updatedPurchases = await fetchData<Purchase>('purchases');
      setPurchases(updatedPurchases);
      setFilteredPurchases(updatedPurchases);
      setShowEditModal(false);
      setSelectedPurchase(null);
      toast.success('Purchase updated successfully');
    } catch (error) {
      toast.error('Failed to update purchase');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePurchase = async () => {
    if (!selectedPurchase) return;
    
    try {
      setIsSubmitting(true);
      await deleteItem('purchases', selectedPurchase.purchase_id);
      const updatedPurchases = purchases.filter(purchase => purchase.purchase_id !== selectedPurchase.purchase_id);
      setPurchases(updatedPurchases);
      setFilteredPurchases(updatedPurchases);
      setShowDeleteModal(false);
      setSelectedPurchase(null);
      toast.success('Purchase deleted successfully');
    } catch (error) {
      toast.error('Failed to delete purchase');
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

  const getPurchaseTypeBadge = (type: PurchaseType) => {
    const styles: Record<PurchaseType, { variant: string, label: string }> = {
      'MEMBERSHIP': { variant: 'success', label: 'Membership' },
      'DIAMONDS': { variant: 'info', label: 'Diamonds' },
      'BUNDLE': { variant: 'warning', label: 'Bundle' },
      'OTHER': { variant: 'default', label: 'Other' }
    };
    
    const style = styles[type] || styles.OTHER;
    
    return (
      <Badge variant={style.variant as any}>
        {style.label}
      </Badge>
    );
  };

  const columns = useMemo<Column[]>(() => [
    {
      id: 'purchase_id',
      header: 'ID',
      accessorKey: 'purchase_id',
      isSortable: true
    },
    {
      id: 'acc_uid',
      header: 'Account UID',
      accessorKey: 'acc_uid',
      isSortable: true
    },
    {
      id: 'purchase_type',
      header: 'Type',
      cell: ({ row }) => {
        const purchase = row as Purchase;
        return getPurchaseTypeBadge(purchase.purchase_type);
      },
      isSortable: true
    },
    {
      id: 'diamonds',
      header: 'Diamonds',
      accessorKey: 'diamonds',
      isSortable: true
    },
    {
      id: 'cost',
      header: 'Cost',
      cell: ({ row }) => {
        const purchase = row as Purchase;
        return formatCurrency(purchase.cost);
      },
      isSortable: true
    },
    {
      id: 'purchase_date',
      header: 'Purchase Date',
      cell: ({ row }) => {
        const purchase = row as Purchase;
        return formatDate(purchase.purchase_date);
      },
      isSortable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const purchase = row as Purchase;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedPurchase(purchase);
                setShowEditModal(true);
              }}
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedPurchase(purchase);
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
  const totalPurchases = purchases.length;
  const totalCost = purchases.reduce((sum, purchase) => sum + purchase.cost, 0);
  const totalDiamonds = purchases.reduce((sum, purchase) => sum + purchase.diamonds, 0);

  // Purchase type options for filter
  const purchaseTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'MEMBERSHIP', label: 'Membership' },
    { value: 'DIAMONDS', label: 'Diamonds' },
    { value: 'BUNDLE', label: 'Bundle' },
    { value: 'OTHER', label: 'Other' }
  ];

  return (
    <DashboardLayout title="Purchases">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchases</h2>
          <p className="text-gray-500">Track and manage purchase records</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          icon={<Plus size={16} />}
        >
          Record Purchase
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Total Purchases" className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-3xl font-bold text-blue-700">{totalPurchases}</div>
        </Card>
        
        <Card title="Total Cost" className="bg-gradient-to-r from-red-50 to-pink-50">
          <div className="text-3xl font-bold text-red-700">
            {formatCurrency(totalCost)}
          </div>
        </Card>
        
        <Card title="Total Diamonds" className="bg-gradient-to-r from-purple-50 to-fuchsia-50">
          <div className="text-3xl font-bold text-purple-700">{totalDiamonds}</div>
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
          <div className="flex-1">
            <Select
              label="Purchase Type"
              options={purchaseTypeOptions}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              fullWidth
            />
          </div>
          <div>
            <Button 
              onClick={() => {
                setDateRange({ startDate: '', endDate: '' });
                setSelectedType('');
              }}
              variant="outline"
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>
      
      <Card>
        <Table 
          data={filteredPurchases} 
          columns={columns} 
          isLoading={isLoading} 
        />
      </Card>
      
      {/* Create Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Record New Purchase"
      >
        <PurchaseForm 
          onSubmit={handleCreatePurchase}
          isSubmitting={isSubmitting}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
      
      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title={`Edit Purchase #${selectedPurchase?.purchase_id}`}
      >
        {selectedPurchase && (
          <PurchaseForm 
            purchase={selectedPurchase}
            onSubmit={handleUpdatePurchase}
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
            Are you sure you want to delete purchase #{selectedPurchase?.purchase_id}?
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
              onClick={handleDeletePurchase}
              isLoading={isSubmitting}
            >
              Delete Purchase
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};