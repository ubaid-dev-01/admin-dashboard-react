export interface Account {
  acc_id: number;
  level: number;
  username: string;
  email: string;
  password: string;
  uid: number;
  ff_tokens: number;
  curr_diamonds: number;
  coins: number;
  has_membership: boolean;
  ms_start_date: string;
  ms_remaining_days: number;
  has_level_up_pass: boolean;
  has_ff_bundle: boolean;
  voucher_a_quantity: number;
  voucher_a_limit: number;
  voucher_b_quantity: number;
  voucher_b_limit: number;
  voucher_c_quantity: number;
  voucher_c_limit: number;
  voucher_d_quantity: number;
  voucher_d_limit: number;
  pending_diamonds: number;
  ms_end_date: string;
}

export interface Sale {
  sale_id: number;
  crates: number;
  price: number;
  sale_date: string;
  acc_uid: number;
}

export interface Purchase {
  purchase_id: number;
  diamonds: number;
  cost: number;
  purchase_date: string;
  purchase_type: PurchaseType;
  acc_uid: number;
}

export type PurchaseType = 'MEMBERSHIP' | 'DIAMONDS' | 'BUNDLE' | 'OTHER';

export interface Summary {
  summary_id: number;
  total_accounts: number;
  investment: number;
  sales: number;
  month: string;
  year: number;
}

export interface ApiResponse<T> {
  data: T[];
  status: number;
  error?: string;
}