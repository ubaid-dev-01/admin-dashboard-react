import React from 'react';
import { useForm } from 'react-hook-form';
import { Summary } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface SummaryFormProps {
  summary?: Summary;
  onSubmit: (data: Partial<Summary>) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({
  summary,
  onSubmit,
  isSubmitting,
  onCancel
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Summary>>({
    defaultValues: summary || {
      year: new Date().getFullYear()
    }
  });

  const months = [
    { value: 'JANUARY', label: 'January' },
    { value: 'FEBRUARY', label: 'February' },
    { value: 'MARCH', label: 'March' },
    { value: 'APRIL', label: 'April' },
    { value: 'MAY', label: 'May' },
    { value: 'JUNE', label: 'June' },
    { value: 'JULY', label: 'July' },
    { value: 'AUGUST', label: 'August' },
    { value: 'SEPTEMBER', label: 'September' },
    { value: 'OCTOBER', label: 'October' },
    { value: 'NOVEMBER', label: 'November' },
    { value: 'DECEMBER', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - 2 + i).toString(),
    label: (currentYear - 2 + i).toString()
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Month"
          options={months}
          {...register('month', { required: 'Month is required' })}
          error={errors.month?.message}
          fullWidth
        />
        
        <Select
          label="Year"
          options={years}
          {...register('year', { 
            required: 'Year is required',
            valueAsNumber: true
          })}
          error={errors.year?.message}
          fullWidth
        />
      </div>
      
      <Input
        label="Total Accounts"
        type="number"
        {...register('total_accounts', { 
          required: 'Total accounts is required',
          valueAsNumber: true,
          min: {
            value: 0,
            message: 'Total accounts cannot be negative'
          }
        })}
        error={errors.total_accounts?.message}
        fullWidth
      />
      
      <Input
        label="Investment"
        type="number"
        {...register('investment', { 
          required: 'Investment is required',
          valueAsNumber: true
        })}
        error={errors.investment?.message}
        fullWidth
      />
      
      <Input
        label="Sales"
        type="number"
        {...register('sales', { 
          required: 'Sales is required',
          valueAsNumber: true
        })}
        error={errors.sales?.message}
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
          {summary ? 'Update Summary' : 'Add Summary'}
        </Button>
      </div>
    </form>
  );
};