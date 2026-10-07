import React from 'react';
import { useForm } from 'react-hook-form';
import { Purchase } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface PurchaseFormProps {
  purchase?: Purchase;
  onSubmit: (data: Partial<Purchase>) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  purchase,
  onSubmit,
  isSubmitting,
  onCancel
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Purchase>>({
    defaultValues: purchase || {
      purchase_date: new Date().toISOString().split('T')[0],
      purchase_type: 'DIAMONDS'
    }
  });

  const purchaseTypes = [
    { value: 'MEMBERSHIP', label: 'Membership' },
    { value: 'DIAMONDS', label: 'Diamonds' },
    { value: 'BUNDLE', label: 'Bundle' },
    { value: 'OTHER', label: 'Other' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Account UID"
        type="number"
        {...register('acc_uid', { 
          required: 'Account UID is required',
          valueAsNumber: true
        })}
        error={errors.acc_uid?.message}
        fullWidth
      />
      
      <Select
        label="Purchase Type"
        options={purchaseTypes}
        {...register('purchase_type', { required: 'Purchase type is required' })}
        error={errors.purchase_type?.message}
        fullWidth
      />
      
      <Input
        label="Diamonds"
        type="number"
        {...register('diamonds', { 
          required: 'Diamonds amount is required',
          valueAsNumber: true
        })}
        error={errors.diamonds?.message}
        fullWidth
      />
      
      <Input
        label="Cost"
        type="number"
        {...register('cost', { 
          required: 'Cost is required',
          valueAsNumber: true,
          min: {
            value: 0,
            message: 'Cost cannot be negative'
          }
        })}
        error={errors.cost?.message}
        fullWidth
      />
      
      <Input
        label="Purchase Date"
        type="date"
        {...register('purchase_date', { required: 'Purchase date is required' })}
        error={errors.purchase_date?.message}
        fullWidth
      />
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
        >
          {purchase ? 'Update Purchase' : 'Record Purchase'}
        </Button>
      </div>
    </form>
  );
};