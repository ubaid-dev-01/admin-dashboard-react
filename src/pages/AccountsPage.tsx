import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, Plus, ShieldCheck, ShieldX } from 'lucide-react';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Table } from '../components/ui/Table/Table';
import { Column } from '../components/ui/Table/TableHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge as StatusBadge } from '../components/ui/Badge';
import { AccountForm } from '../components/accounts/AccountForm';

import { Account } from '../types';
import { fetchData, createItem, updateItem, deleteItem } from '../api/apiClient';
import { format } from 'date-fns';

export const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData<Account>('accounts');
        setAccounts(data);
        setFilteredAccounts(data);
      } catch (error) {
        toast.error('Failed to load accounts');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = accounts.filter(account => 
        account.uid.toString().includes(term) || 
        account.username.toLowerCase().includes(term) ||
        account.email.toLowerCase().includes(term)
      );
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts);
    }
  }, [searchTerm, accounts]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCreateAccount = async (data: Partial<Account>) => {
    try {
      setIsSubmitting(true);
      await createItem<Account>('accounts', data as Omit<Account, 'id'>);
      const updatedAccounts = await fetchData<Account>('accounts');
      setAccounts(updatedAccounts);
      setFilteredAccounts(updatedAccounts);
      setShowCreateModal(false);
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Failed to create account');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAccount = async (data: Partial<Account>) => {
    if (!selectedAccount) return;
    
    try {
      setIsSubmitting(true);
      await updateItem<Account>('accounts', selectedAccount.uid, data);
      const updatedAccounts = await fetchData<Account>('accounts');
      setAccounts(updatedAccounts);
      setFilteredAccounts(updatedAccounts);
      setShowEditModal(false);
      setSelectedAccount(null);
      toast.success('Account updated successfully');
    } catch (error) {
      toast.error('Failed to update account');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    
    try {
      setIsSubmitting(true);
      await deleteItem('accounts', selectedAccount.uid);
      const updatedAccounts = accounts.filter(account => account.uid !== selectedAccount.uid);
      setAccounts(updatedAccounts);
      setFilteredAccounts(updatedAccounts);
      setShowDeleteModal(false);
      setSelectedAccount(null);
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useMemo<Column[]>(() => [
    
    {
      id: 'acc_id',
      header: 'ACC_ID',
      accessorKey: 'acc_id',
      isSortable: true
    },
    {
      id: 'uid',
      header: 'UID',
      accessorKey: 'uid',
      isSortable: true
    },
    {
      id: 'username',
      header: 'Username',
      accessorKey: 'username',
      isSortable: true
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email'
    },
    {
      id: 'level',
      header: 'Level',
      accessorKey: 'level',
      isSortable: true
    },
    {
      id: 'diamonds',
      header: 'Diamonds',
      accessorKey: 'curr_diamonds',
      isSortable: true
    },
    {
      id: 'ff_tokens',
      header: 'FF Tokens',
      accessorKey: 'ff_tokens',
      isSortable: true
    },
    {
      id: 'curr_diamonds',
      header: 'Current Diamonds',
      accessorKey: 'curr_diamonds',
      isSortable: true
    },
    {
      id: 'pending_diamonds',
      header: 'Pending Diamonds',
      accessorKey: 'pending_diamonds',
      isSortable: true
    },
    {
      id: 'coins',
      header: 'Coins',
      accessorKey: 'coins',
      isSortable: true
    },
    {
      id: 'membership',
      header: 'Membership',
      cell: ({ row }) => {
        const account = row as Account;
        return account.has_membership ? (
          <div className="flex items-center">
            <StatusBadge variant="success">
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{account.ms_remaining_days} days</span>
              </div>
            </StatusBadge>
          </div>
        ) : (
          <StatusBadge variant="default">
            <div className="flex items-center space-x-1">
              <ShieldX className="w-3 h-3" />
              <span>Inactive</span>
            </div>
          </StatusBadge>
        );
      }
    },
    {
      id: 'ms_dates',
      header: 'Membership Dates',
      cell: ({ row }) => {
        const account = row as Account;
        if (!account.has_membership) return '-';
        return (
          <div className="text-sm">
            <div>Start: {format(new Date(account.ms_start_date), 'MMM dd, yyyy')}</div>
            <div>End: {format(new Date(account.ms_end_date), 'MMM dd, yyyy')}</div>
          </div>
        );
      }
    },
    {
      id: 'passes',
      header: 'Passes',
      cell: ({ row }) => {
        const account = row as Account;
        return (
          <div className="space-y-1">
            {account.has_level_up_pass && (
              <StatusBadge variant="info">Level Up Pass</StatusBadge>
            )}
            {account.has_ff_bundle && (
              <StatusBadge variant="warning">FF Bundle</StatusBadge>
            )}
          </div>
        );
      }
    },
    {
      id: 'vouchers',
      header: 'Vouchers',
      cell: ({ row }) => {
        const account = row as Account;
        return (
          <div className="text-sm space-y-1">
            <div>A: {account.voucher_a_quantity}/{account.voucher_a_limit}</div>
            <div>B: {account.voucher_b_quantity}/{account.voucher_b_limit}</div>
            <div>C: {account.voucher_c_quantity}/{account.voucher_c_limit}</div>
            <div>D: {account.voucher_d_quantity}/{account.voucher_d_limit}</div>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const account = row as Account;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedAccount(account);
                setShowEditModal(true);
              }}
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedAccount(account);
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

  return (
    <DashboardLayout title="Accounts" onSearch={handleSearch}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accounts</h2>
          <p className="text-gray-500">Manage user accounts</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          icon={<Plus size={16} />}
        >
          Add Account
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Total Accounts" className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-3xl font-bold text-blue-700">{accounts.length}</div>
        </Card>
        
        <Card title="Premium Accounts" className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="text-3xl font-bold text-green-700">
            {accounts.filter(a => a.has_membership).length}
          </div>
        </Card>
        
        <Card title="Total Diamonds" className="bg-gradient-to-r from-purple-50 to-fuchsia-50">
          <div className="text-3xl font-bold text-purple-700">
            {accounts.reduce((sum, account) => sum + account.curr_diamonds, 0)}
          </div>
        </Card>
      </div>
      
      <Card>
        <Table 
          data={filteredAccounts} 
          columns={columns} 
          isLoading={isLoading} 
        />
      </Card>
      
      {/* Create Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Create New Account"
        size="lg"
      >
        <AccountForm 
          onSubmit={handleCreateAccount}
          isSubmitting={isSubmitting}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
      
      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title={`Edit Account: ${selectedAccount?.username}`}
        size="lg"
      >
        {selectedAccount && (
          <AccountForm 
            account={selectedAccount}
            onSubmit={handleUpdateAccount}
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
            Are you sure you want to delete the account for <span className="font-bold">{selectedAccount?.username}</span>?
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
              onClick={handleDeleteAccount}
              isLoading={isSubmitting}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};