export type TabType = 'home' | 'task' | 'transaction' | 'profile';
export type ThemeMode = 'dark' | 'light';

export type NetworkProvider = 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE';

export type ServiceType =
  | 'airtime'
  | 'budget_data'
  | 'std_data'
  | 'electricity'
  | 'cable_tv'
  | 'air_to_cash'
  | 'betting'
  | 'epins'
  | 'exam_pins'
  | 'social_boost'
  | 'auto_topup'
  | 'tickets'
  | 'refer_earn'
  | 'withdraw'
  | 'developer'
  | 'more';

export interface ServiceItem {
  id: ServiceType;
  title: string;
  subtitle?: string;
  iconBg: string;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
  category: 'telecom' | 'bills' | 'finance' | 'tools';
  keywords?: string[];
}

export interface Transaction {
  id: string;
  ref: string;
  type: ServiceType | 'wallet_funding' | 'referral_bonus';
  title: string;
  category: string;
  amount: number;
  recipient: string;
  network?: NetworkProvider;
  status: 'successful' | 'pending' | 'failed';
  date: string;
  time: string;
  token?: string; // For electricity or exam pins
  meterNumber?: string;
  smartcardNumber?: string;
  paymentMethod: string;
  cashbackEarned?: number;
}

export interface UserProfile {
  fullName: string;
  username: string;
  phone: string;
  email: string;
  tier: 'Tier 1' | 'Tier 2 (Verified)' | 'VIP Reseller';
  avatarUrl: string;
  referralCode: string;
  totalReferrals: number;
  referralEarnings: number;
  virtualAccounts: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    charge: string;
  }[];
}

export interface BonanzaDeal {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  network: NetworkProvider;
  originalPrice: number;
  bonanzaPrice: number;
  volume: string;
  validity: string;
  timeLeft: string;
  soldPercentage: number;
}

export interface RewardTask {
  id: string;
  title: string;
  reward: number;
  rewardType: 'cash' | 'points' | 'data';
  completed: boolean;
  progress: number;
  maxProgress: number;
  description: string;
}
