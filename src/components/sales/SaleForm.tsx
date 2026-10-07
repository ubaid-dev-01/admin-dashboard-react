import React from 'react';
import { useForm } from 'react-hook-form';
import { Sale } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface SaleFormProps {
  sale?: Sale;
  onSubmit: (data: Partial<Sale>) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({
  sale,
  onSubmit,
  isSubmitting,
  onCancel
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Sale>>({
    defaultValues: sale || {
      sale_date: new Date().toISOString().split('T')[0]
    }
  });

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
      
      <Input
        label="Crates"
        type="number"
        {...register('crates', { 
          required: 'Number of crates is required',
          valueAsNumber: true,
          min: {
            value: 1,
            message: 'Crates must be at least 1'
          }
        })}
        error={errors.crates?.message}
        fullWidth
      />
      
      <Input
        label="Price"
        type="number"
        {...register('price', { 
          required: 'Price is required',
          valueAsNumber: true,
          min: {
            value: 0,
            message: 'Price cannot be negative'
          }
        })}
        error={errors.price?.message}
        fullWidth
      />
      
      <Input
        label="Sale Date"
        type="date"
        {...register('sale_date', { required: 'Sale date is required' })}
        error={errors.sale_date?.message}
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
          {sale ? 'Update Sale' : 'Record Sale'}
        </Button>
      </div>
    </form>
  );
};