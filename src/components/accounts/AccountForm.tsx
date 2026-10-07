import React from 'react';
import { useForm } from 'react-hook-form';
import { Account } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: Partial<Account>) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  account,
  onSubmit,
  isSubmitting,
  onCancel
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Account>>({
    defaultValues: account || {
      has_membership: false,
      has_level_up_pass: false,
      has_ff_bundle: false
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Username"
          {...register('username', { required: 'Username is required' })}
          error={errors.username?.message}
          fullWidth
        />
        
        <Input
          label="Email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          error={errors.email?.message}
          fullWidth
        />
        
        <Input
          label="Level"
          type="number"
          {...register('level', { 
            required: 'Level is required',
            valueAsNumber: true
          })}
          error={errors.level?.message}
          fullWidth
        />
        
        <Input
          label="UID"
          type="number"
          {...register('uid', { 
            required: 'UID is required',
            valueAsNumber: true
          })}
          error={errors.uid?.message}
          fullWidth
        />
        
        <Input
          label="Current Diamonds"
          type="number"
          {...register('curr_diamonds', { 
            required: 'Diamonds are required',
            valueAsNumber: true
          })}
          error={errors.curr_diamonds?.message}
          fullWidth
        />
        
        <Input
          label="FF Tokens"
          type="number"
          {...register('ff_tokens', { 
            required: 'FF Tokens are required',
            valueAsNumber: true
          })}
          error={errors.ff_tokens?.message}
          fullWidth
        />
        
        <Input
          label="Coins"
          type="number"
          {...register('coins', { 
            required: 'Coins are required',
            valueAsNumber: true
          })}
          error={errors.coins?.message}
          fullWidth
        />
        
        <Select
          label="Membership Status"
          options={[
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' }
          ]}
          {...register('has_membership')}
          fullWidth
        />
        
        {/* Only show if has_membership is true */}
        <Input
          label="Membership Start Date"
          type="date"
          {...register('ms_start_date')}
          fullWidth
        />
        
        <Input
          label="Membership End Date"
          type="date"
          {...register('ms_end_date')}
          fullWidth
        />
        
        <Input
          label="Membership Remaining Days"
          type="number"
          {...register('ms_remaining_days', { valueAsNumber: true })}
          fullWidth
        />
        
        <Select
          label="Level Up Pass"
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ]}
          {...register('has_level_up_pass')}
          fullWidth
        />
        
        <Select
          label="FF Bundle"
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ]}
          {...register('has_ff_bundle')}
          fullWidth
        />

        <Input
          label="Pending Diamonds"
          type="number"
          {...register('pending_diamonds', { valueAsNumber: true })}
          fullWidth
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Voucher A */}
        <div className="col-span-1">
          <Input
            label="Voucher A Quantity"
            type="number"
            {...register('voucher_a_quantity', { valueAsNumber: true })}
            fullWidth
          />
        </div>
        <div className="col-span-1">
          <Input
            label="Voucher A Limit"
            type="number"
            {...register('voucher_a_limit', { valueAsNumber: true })}
            fullWidth
          />
        </div>
        
        {/* Voucher B */}
        <div className="col-span-1">
          <Input
            label="Voucher B Quantity"
            type="number"
            {...register('voucher_b_quantity', { valueAsNumber: true })}
            fullWidth
          />
        </div>
        <div className="col-span-1">
          <Input
            label="Voucher B Limit"
            type="number"
            {...register('voucher_b_limit', { valueAsNumber: true })}
            fullWidth
          />
        </div>
        
        {/* Voucher C */}
        <div className="col-span-1">
          <Input
            label="Voucher C Quantity"
            type="number"
            {...register('voucher_c_quantity', { valueAsNumber: true })}
            fullWidth
          />
        </div>
        <div className="col-span-1">
          <Input
            label="Voucher C Limit"
            type="number"
            {...register('voucher_c_limit', { valueAsNumber: true })}
            fullWidth
          />
        </div>
        
        {/* Voucher D */}
        <div className="col-span-1">
          <Input
            label="Voucher D Quantity"
            type="number"
            {...register('voucher_d_quantity', { valueAsNumber: true })}
            fullWidth
          />
        </div>
        <div className="col-span-1">
          <Input
            label="Voucher D Limit"
            type="number"
            {...register('voucher_d_limit', { valueAsNumber: true })}
            fullWidth
          />
        </div>
      </div>
      
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
          {account ? 'Update Account' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};