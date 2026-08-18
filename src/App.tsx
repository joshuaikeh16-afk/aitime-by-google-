import React, { useState } from 'react';
import { BonanzaDeal, ServiceType, TabType, Transaction, UserProfile } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_USER } from './data/mockData';
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
import { CheckCircle2, Zap } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [walletBalance, setWalletBalance] = useState<number>(52800);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [isFundWalletOpen, setIsFundWalletOpen] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle successful service completion
  const handleCompleteTransaction = (newTx: Transaction) => {
    // Deduct or add to wallet
    if (newTx.type === 'air_to_cash') {
      const cashReceived = Math.round(newTx.amount * 0.82);
      setWalletBalance((prev) => prev + cashReceived);
      showToast(`Airtime converted! ₦${cashReceived.toLocaleString()} added.`);
    } else {
      setWalletBalance((prev) => Math.max(0, prev - newTx.amount));
      showToast(`Instant Delivery Successful for ${newTx.title}!`);
    }

    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceipt(newTx);
  };

  // Handle wallet funding
  const handleFundSuccess = (amount: number, method: string) => {
    setWalletBalance((prev) => prev + amount);

    const now = new Date();
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      ref: `DEP-${Math.floor(100000000 + Math.random() * 900000000)}`,
      type: 'wallet_funding',
      title: 'Automated Wallet Deposit',
      category: 'Wallet Deposit',
      amount,
      recipient: user.fullName,
      status: 'successful',
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: method,
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Wallet credited with ₦${amount.toLocaleString()}!`);
    setActiveReceipt(newTx);
  };

  // Handle claiming bonanza deals from Task tab
  const handleClaimBonanzaDeal = (deal: BonanzaDeal) => {
    setActiveService('budget_data');
  };

  // Handle rewards & bonuses
  const handleRewardClaimed = (amount: number, msg: string) => {
    setWalletBalance((prev) => prev + amount);
    showToast(`🎉 ${msg} (+₦${amount.toLocaleString()})`);
  };

  return (
    <MobileFrame currentTab={currentTab} onTabChange={setCurrentTab}>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          id="global-toast-banner"
          className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 border border-emerald-400"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: Home (Matches Screenshot) */}
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

      {/* Tab 2: Task (Bonanza Deals & Rewards) */}
      {currentTab === 'task' && (
        <TaskTab
          onClaimDeal={handleClaimBonanzaDeal}
          onRewardClaimed={handleRewardClaimed}
        />
      )}

      {/* Tab 3: History / Transaction (Payments & Withdrawals) */}
      {currentTab === 'transaction' && (
        <TransactionTab
          transactions={transactions}
          onSelectTransaction={(tx) => setActiveReceipt(tx)}
          onOpenFundWallet={() => setIsFundWalletOpen(true)}
        />
      )}

      {/* Tab 4: Profile (Credentials & Account Settings) */}
      {currentTab === 'profile' && (
        <ProfileTab
          user={user}
          onOpenFundWallet={() => setIsFundWalletOpen(true)}
          onRewardClaimed={handleRewardClaimed}
        />
      )}

      {/* Modal: Service Form & Checkout */}
      {activeService && (
        <ServiceModal
          serviceId={activeService}
          walletBalance={walletBalance}
          onClose={() => setActiveService(null)}
          onCompleteTransaction={handleCompleteTransaction}
        />
      )}

      {/* Modal: Fund Wallet Gateway */}
      <FundWalletModal
        isOpen={isFundWalletOpen}
        onClose={() => setIsFundWalletOpen(false)}
        user={user}
        onFundSuccess={handleFundSuccess}
      />

      {/* Modal: Digital Receipt */}
      {activeReceipt && (
        <ReceiptModal
          transaction={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}

      {/* Floating 24/7 Support Chat Button (From screenshot) */}
      <FloatingChat />
    </MobileFrame>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
