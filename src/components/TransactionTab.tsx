import React, { useState } from 'react';
import { Transaction } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SpendingD3Analytics } from './SpendingD3Analytics';
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Download, 
  ChevronRight,
  Smartphone,
  Wifi,
  Tv,
  CreditCard,
  Building2
} from 'lucide-react';

interface TransactionTabProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onOpenFundWallet: () => void;
}

export const TransactionTab: React.FC<TransactionTabProps> = ({
  transactions,
  onSelectTransaction,
  onOpenFundWallet,
}) => {
  const { isDark } = useTheme();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'airtime', label: 'Airtime' },
    { id: 'data', label: 'Data Bundles' },
    { id: 'electricity', label: 'Electricity' },
    { id: 'cable', label: 'Cable TV' },
    { id: 'funding', label: 'Wallet Funding' },
    { id: 'withdraw', label: 'Withdrawals' },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    // Category match
    if (filterCategory === 'airtime' && tx.type !== 'airtime') return false;
    if (filterCategory === 'data' && !['budget_data', 'std_data'].includes(tx.type)) return false;
    if (filterCategory === 'electricity' && tx.type !== 'electricity') return false;
    if (filterCategory === 'cable' && tx.type !== 'cable_tv') return false;
    if (filterCategory === 'funding' && tx.type !== 'wallet_funding') return false;
    if (filterCategory === 'withdraw' && tx.type !== 'withdraw') return false;

    // Status match
    if (filterStatus !== 'all' && tx.status !== filterStatus) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = tx.title.toLowerCase().includes(q);
      const matchesRef = tx.ref.toLowerCase().includes(q);
      const matchesRecipient = tx.recipient.toLowerCase().includes(q);
      const matchesToken = tx.token?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesRef && !matchesRecipient && !matchesToken) return false;
    }

    return true;
  });

  const totalSpent = transactions
    .filter((tx) => tx.type !== 'wallet_funding' && tx.type !== 'referral_bonus')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalFunded = transactions
    .filter((tx) => tx.type === 'wallet_funding')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'airtime':
        return <Smartphone className="w-4 h-4 text-emerald-500" />;
      case 'budget_data':
      case 'std_data':
        return <Wifi className="w-4 h-4 text-purple-500" />;
      case 'electricity':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'cable_tv':
        return <Tv className="w-4 h-4 text-red-500" />;
      case 'wallet_funding':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-500" />;
      case 'withdraw':
        return <Building2 className="w-4 h-4 text-orange-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div id="transaction-tab-view" className="space-y-4 pb-20">
      {/* Header */}
      <div className="px-1 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h1 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Transactions & History
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time payment logs & automated receipts
            </p>
          </div>
        </div>
      </div>

      {/* Summary Outflow/Inflow Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className={`border rounded-2xl p-3 space-y-1 shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0a232b] border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Utility Spend</span>
          <p className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>₦{totalSpent.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Delivered
          </span>
        </div>

        <div className={`border rounded-2xl p-3 space-y-1 shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0a232b] border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Funded</span>
          <p className="text-lg font-extrabold text-emerald-500">₦{totalFunded.toLocaleString()}</p>
          <button
            id="history-fund-now-btn"
            onClick={onOpenFundWallet}
            className="text-[10px] text-amber-500 hover:underline font-semibold block cursor-pointer"
          >
            + Fund Wallet Now
          </button>
        </div>
      </div>

      {/* D3.js Monthly Spending Visualization Section */}
      <SpendingD3Analytics transactions={transactions} />

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-slate-400' : 'text-slate-400'
          }`} />
          <input
            type="text"
            id="transaction-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by phone, reference, or token..."
            className={`w-full border rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 transition shadow-sm ${
              isDark 
                ? 'bg-[#0a232b] border-slate-800 text-white placeholder-slate-500' 
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}`}
              onClick={() => setFilterCategory(cat.id)}
              className={`py-1 px-2.5 rounded-lg text-[11px] font-medium whitespace-nowrap border transition cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-sm'
                  : isDark
                    ? 'bg-[#0a232b] border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        <div className={`flex justify-between items-center px-1 text-xs ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span>Showing {filteredTransactions.length} Record{filteredTransactions.length === 1 ? '' : 's'}</span>
          <span className="text-[11px]">Tap to view receipt</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className={`text-center py-10 rounded-2xl border p-6 space-y-2 ${
            isDark ? 'bg-[#0a232b]/50 border-slate-800/80' : 'bg-white border-slate-200'
          }`}>
            <History className="w-8 h-8 text-slate-400 mx-auto" />
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>No Transactions Found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              id={`tx-row-${tx.id}`}
              onClick={() => onSelectTransaction(tx)}
              className={`border rounded-2xl p-3.5 flex items-center justify-between transition cursor-pointer shadow-sm ${
                isDark 
                  ? 'bg-[#0a232b] hover:bg-[#0c2b35] border-slate-800/90 hover:border-emerald-500/40' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  tx.type === 'wallet_funding'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : tx.type === 'withdraw'
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : isDark ? 'bg-[#0e303a] border-slate-700/60' : 'bg-slate-100 border-slate-200'
                }`}>
                  {getIconForType(tx.type)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{tx.title}</h4>
                    {tx.network && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tx.network}
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {tx.recipient}
                  </p>
                  <p className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {tx.date} • {tx.time}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className={`text-xs font-extrabold ${
                  tx.type === 'wallet_funding' ? 'text-emerald-500' : isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {tx.type === 'wallet_funding' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                </p>

                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Successful
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
