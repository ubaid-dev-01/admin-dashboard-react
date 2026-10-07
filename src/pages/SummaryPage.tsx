import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, Plus, TrendingUp, Wallet, UserPlus } from 'lucide-react';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Table } from '../components/ui/Table/Table';
import { Column } from '../components/ui/Table/TableHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { SummaryForm } from '../components/summary/SummaryForm';

import { Summary } from '../types';
import { fetchData, createItem, updateItem, deleteItem } from '../api/apiClient';

export const SummaryPage: React.FC = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadSummaries = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData<Summary>('summary');
        setSummaries(data);
      } catch (error) {
        toast.error('Failed to load summaries');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummaries();
  }, []);

  const handleCreateSummary = async (data: Partial<Summary>) => {
    try {
      setIsSubmitting(true);
      await createItem<Summary>('summary', data as Omit<Summary, 'id'>);
      const updatedSummaries = await fetchData<Summary>('summary');
      setSummaries(updatedSummaries);
      setShowCreateModal(false);
      toast.success('Summary created successfully');
    } catch (error) {
      toast.error('Failed to create summary');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSummary = async (data: Partial<Summary>) => {
    if (!selectedSummary) return;
    
    try {
      setIsSubmitting(true);
      await updateItem<Summary>('summary', selectedSummary.summary_id, data);
      const updatedSummaries = await fetchData<Summary>('summary');
      setSummaries(updatedSummaries);
      setShowEditModal(false);
      setSelectedSummary(null);
      toast.success('Summary updated successfully');
    } catch (error) {
      toast.error('Failed to update summary');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSummary = async () => {
    if (!selectedSummary) return;
    
    try {
      setIsSubmitting(true);
      await deleteItem('summary', selectedSummary.summary_id);
      const updatedSummaries = summaries.filter(summary => summary.summary_id !== selectedSummary.summary_id);
      setSummaries(updatedSummaries);
      setShowDeleteModal(false);
      setSelectedSummary(null);
      toast.success('Summary deleted successfully');
    } catch (error) {
      toast.error('Failed to delete summary');
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

  const columns = useMemo<Column[]>(() => [
    {
      id: 'month_year',
      header: 'Month/Year',
      cell: ({ row }) => {
        const summary = row as Summary;
        return `${summary.month} ${summary.year}`;
      },
      isSortable: true
    },
    {
      id: 'total_accounts',
      header: 'Total Accounts',
      accessorKey: 'total_accounts',
      isSortable: true
    },
    {
      id: 'investment',
      header: 'Investment',
      cell: ({ row }) => {
        const summary = row as Summary;
        return formatCurrency(summary.investment);
      },
      isSortable: true
    },
    {
      id: 'sales',
      header: 'Sales',
      cell: ({ row }) => {
        const summary = row as Summary;
        return formatCurrency(summary.sales);
      },
      isSortable: true
    },
    {
      id: 'profit',
      header: 'Profit',
      cell: ({ row }) => {
        const summary = row as Summary;
        const profit = summary.sales - summary.investment;
        return (
          <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
            {formatCurrency(profit)}
          </span>
        );
      },
      isSortable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const summary = row as Summary;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedSummary(summary);
                setShowEditModal(true);
              }}
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedSummary(summary);
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
  const totalInvestment = summaries.reduce((sum, summary) => sum + summary.investment, 0);
  const totalSales = summaries.reduce((sum, summary) => sum + summary.sales, 0);
  const totalProfit = totalSales - totalInvestment;
  const averageAccountsPerMonth = Math.round(
    summaries.reduce((sum, summary) => sum + summary.total_accounts, 0) / 
    (summaries.length || 1)
  );

  // Get latest month data for trend indication
  const latestSummary = summaries.length > 0 
    ? summaries.reduce((latest, current) => {
        if (!latest) return current;
        if (current.year > latest.year) return current;
        if (current.year === latest.year && 
            getMonthIndex(current.month) > getMonthIndex(latest.month)) {
          return current;
        }
        return latest;
      }, null as Summary | null) 
    : null;

  function getMonthIndex(month: string): number {
    const months = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    return months.indexOf(month);
  }

  return (
    <DashboardLayout title="Financial Summary">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Summary</h2>
          <p className="text-gray-500">Monthly financial performance overview</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          icon={<Plus size={16} />}
        >
          Add Summary
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Total Investment" className="bg-gradient-to-r from-red-50 to-pink-50">
          <div className="text-3xl font-bold text-red-700">{formatCurrency(totalInvestment)}</div>
        </Card>
        
        <Card title="Total Sales" className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="text-3xl font-bold text-green-700">{formatCurrency(totalSales)}</div>
        </Card>
        
        <Card title="Net Profit" className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            {formatCurrency(totalProfit)}
          </div>
          {totalProfit !== 0 && (
            <div className="flex items-center mt-1 text-sm">
              <TrendingUp className={`w-4 h-4 mr-1 ${totalProfit > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={totalProfit > 0 ? 'text-green-500' : 'text-red-500'}>
                {((totalProfit / totalInvestment) * 100).toFixed(1)}% {totalProfit > 0 ? 'ROI' : 'Loss'}
              </span>
            </div>
          )}
        </Card>
        
        <Card title="Average Accounts" className="bg-gradient-to-r from-purple-50 to-fuchsia-50">
          <div className="text-3xl font-bold text-purple-700">{averageAccountsPerMonth}</div>
          <div className="text-sm text-gray-500">per month</div>
        </Card>
      </div>
      
      {latestSummary && (
        <Card className="mb-6 p-4">
          <h3 className="text-lg font-medium mb-4">Latest Month: {latestSummary.month} {latestSummary.year}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Total Accounts</p>
                <p className="text-xl font-bold">{latestSummary.total_accounts}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Wallet className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Sales</p>
                <p className="text-xl font-bold">{formatCurrency(latestSummary.sales)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Profit</p>
                <p className={`text-xl font-bold ${
                  latestSummary.sales - latestSummary.investment >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatCurrency(latestSummary.sales - latestSummary.investment)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <Card>
        <Table 
          data={summaries} 
          columns={columns} 
          isLoading={isLoading} 
        />
      </Card>
      
      {/* Create Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Add Monthly Summary"
      >
        <SummaryForm 
          onSubmit={handleCreateSummary}
          isSubmitting={isSubmitting}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
      
      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title={`Edit Summary: ${selectedSummary?.month} ${selectedSummary?.year}`}
      >
        {selectedSummary && (
          <SummaryForm 
            summary={selectedSummary}
            onSubmit={handleUpdateSummary}
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
            Are you sure you want to delete the summary for {selectedSummary?.month} {selectedSummary?.year}?
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
              onClick={handleDeleteSummary}
              isLoading={isSubmitting}
            >
              Delete Summary
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};