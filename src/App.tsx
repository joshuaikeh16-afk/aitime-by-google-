import React, { useState, useEffect, useCallback } from 'react';
import { BonanzaDeal, ServiceType, TabType, Transaction, UserProfile } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { MobileFrame } from './components/MobileFrame';
import { HomeTab } from './components/HomeTab';
import { TaskTab } from './components/TaskTab';
import { TransactionTab } from './components/TransactionTab';
import { ProfileTab } from './components/ProfileTab';
import { ServiceModal } from './components/ServiceModal';
import { FundWalletModal } from './components/FundWalletModal';
import { ReceiptModal } from './components/ReceiptModal';
import { FloatingChat } from './components/FloatingChat';
import { AuthGate } from './components/AuthGate';
import { getWalletBalance, getTransactionHistory, signOut } from './lib/backend';
import { CheckCircle2 } from 'lucide-react';

function AppContent({ session }: { session: any }) {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [isFundWalletOpen, setIsFundWalletOpen] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user: UserProfile = {
    fullName: session.user.email?.split('@')[0] ?? 'User',
    username: session.user.email?.split('@')[0] ?? 'user',
    email: session.user.email ?? '',
    phone: '',
    tier: 'Tier 1',
    avatarUrl: '',
    referralCode: '',
    totalReferrals: 0,
    referralEarnings: 0,
    // Virtual accounts (bank-transfer funding) aren't wired for the
    // Saturday demo -- real card payment via Paystack is the only
    // funding method that's actually live right now.
    virtualAccounts: [],
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /** Re-fetches real balance + transaction history from Supabase -- call this after any successful purchase or top-up, rather than locally mutating fake state. */
  const refreshWalletData = useCallback(async () => {
    const [balance, history] = await Promise.all([
      getWalletBalance(session.user.id),
      getTransactionHistory(session.user.id),
    ]);
    setWalletBalance(balance);
    setTransactions(history);
  }, [session.user.id]);

  useEffect(() => {
    refreshWalletData().finally(() => setIsLoading(false));
  }, [refreshWalletData]);

  // Called by ServiceModal after a REAL purchase completes (success or
  // failure already resolved server-side by the iacafe-purchase Edge
  // Function -- this just refreshes the UI to reflect the real result).
  const handleCompleteTransaction = async (newTx: Transaction) => {
    await refreshWalletData();
    showToast(`Instant Delivery Successful for ${newTx.title}!`);
    setActiveReceipt(newTx);
  };

  // Called by FundWalletModal after a REAL Paystack payment is verified
  // server-side. `method` param kept for prop-type compatibility with
  // the existing modal but unused -- real payment method is already
  // recorded server-side in wallet_transactions.
  const handleFundSuccess = async (amount: number, _method: string) => {
    await refreshWalletData();
    showToast(`Wallet credited with ₦${amount.toLocaleString()}!`);
  };

  const handleClaimBonanzaDeal = (deal: BonanzaDeal) => {
    setActiveService('budget_data');
  };

  // NOTE: reward/bonanza claiming is a gamification feature that isn't
  // wired to real money -- out of scope for the Saturday demo. Left as
  // a local-only toast for now so the UI doesn't break, but this does
  // NOT touch the real wallet balance.
  const handleRewardClaimed = (amount: number, msg: string) => {
    showToast(`${msg} (not credited -- rewards feature not live yet)`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#051115]">
        <p className="text-slate-400 text-sm">Loading your wallet...</p>
      </div>
    );
  }

  return (
    <MobileFrame currentTab={currentTab} onTabChange={setCurrentTab}>
      {toastMessage && (
        <div
          id="global-toast-banner"
          className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 border border-emerald-400"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {currentTab === 'home' && (
        <HomeTab
          user={user}
          walletBalance={walletBalance}
          recentTransactions={transactions}
          onOpenService={(srv) => setActiveService(srv)}
          onOpenFundWallet={() => setIsFundWalletOpen(true)}
          onNavigateToTransactions={() => setCurrentTab('transaction')}
          onNavigateToTasks={() => setCurrentTab('task')}
          onSelectTransaction={(tx) => setActiveReceipt(tx)}
        />
      )}

      {currentTab === 'task' && (
        <TaskTab onClaimDeal={handleClaimBonanzaDeal} onRewardClaimed={handleRewardClaimed} />
      )}

      {currentTab === 'transaction' && (
        <TransactionTab
          transactions={transactions}
          onSelectTransaction={(tx) => setActiveReceipt(tx)}
          onOpenFundWallet={() => setIsFundWalletOpen(true)}
        />
      )}

      {currentTab === 'profile' && (
        <ProfileTab user={user} onOpenFundWallet={() => setIsFundWalletOpen(true)} onRewardClaimed={handleRewardClaimed} />
      )}

      {activeService && (
        <ServiceModal
          serviceId={activeService}
          walletBalance={walletBalance}
          onClose={() => setActiveService(null)}
          onCompleteTransaction={handleCompleteTransaction}
        />
      )}

      <FundWalletModal
        isOpen={isFundWalletOpen}
        onClose={() => setIsFundWalletOpen(false)}
        user={user}
        onFundSuccess={handleFundSuccess}
      />

      {activeReceipt && <ReceiptModal transaction={activeReceipt} onClose={() => setActiveReceipt(null)} />}

      <FloatingChat />
    </MobileFrame>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthGate>{(session) => <AppContent session={session} />}</AuthGate>
    </ThemeProvider>
  );
}
