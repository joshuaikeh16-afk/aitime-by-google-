import React, { useState } from 'react';
import { ServiceItem, ServiceType, Transaction, UserProfile } from '../types';
import { INITIAL_SERVICES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { 
  Smartphone, 
  Wifi, 
  Signal, 
  Zap, 
  Tv, 
  CreditCard, 
  Gamepad2, 
  Ticket, 
  FileText, 
  Rocket, 
  Repeat, 
  Film, 
  Users, 
  ArrowDownCircle, 
  Code2, 
  LayoutGrid,
  Shield, 
  UtensilsCrossed, 
  Car,
  Eye,
  EyeOff,
  PlusCircle,
  ArrowUpRight,
  ChevronRight,
  Bell,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface HomeTabProps {
  user: UserProfile;
  walletBalance: number;
  recentTransactions: Transaction[];
  onOpenService: (serviceId: ServiceType) => void;
  onOpenFundWallet: () => void;
  onNavigateToTransactions: () => void;
  onNavigateToTasks: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  walletBalance,
  recentTransactions,
  onOpenService,
  onOpenFundWallet,
  onNavigateToTransactions,
  onNavigateToTasks,
  onSelectTransaction,
}) => {
  const { isDark } = useTheme();
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [activePromoIndex, setActivePromoIndex] = useState<number>(0);

  const promos = [
    {
      title: '⚡ MTN SME Flash Bonanza',
      desc: '10GB Data now ₦1,950 for limited time only',
      bg: isDark 
        ? 'from-amber-600/30 via-amber-900/20 to-transparent border-amber-500/30' 
        : 'from-amber-500/20 via-amber-500/10 to-transparent border-amber-300',
      tag: '60% OFF',
    },
    {
      title: '💸 Instant Airtime to Cash',
      desc: 'Convert excess MTN & Airtel airtime at 82% cash rate',
      bg: isDark 
        ? 'from-pink-600/30 via-purple-900/20 to-transparent border-pink-500/30' 
        : 'from-pink-500/20 via-purple-500/10 to-transparent border-pink-300',
      tag: 'NEW FEATURE',
    },
    {
      title: '🏦 Dedicated Virtual Bank Accounts',
      desc: 'Moniepoint & Wema Bank automated 0-second deposits',
      bg: isDark 
        ? 'from-emerald-600/30 via-teal-900/20 to-transparent border-emerald-500/30' 
        : 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-300',
      tag: 'AUTOMATED',
    },
  ];

  const getServiceIcon = (id: ServiceType) => {
    switch (id) {
      case 'airtime':
        return <Smartphone className="w-6 h-6 text-white" />;
      case 'budget_data':
        return <Wifi className="w-6 h-6 text-white" />;
      case 'std_data':
        return <Signal className="w-6 h-6 text-white" />;
      case 'electricity':
        return <Zap className="w-6 h-6 text-white" />;
      case 'cable_tv':
        return <Tv className="w-6 h-6 text-white" />;
      case 'air_to_cash':
        return <CreditCard className="w-6 h-6 text-white" />;
      case 'betting':
        return <Gamepad2 className="w-6 h-6 text-white" />;
      case 'epins':
        return <Ticket className="w-6 h-6 text-white" />;
      case 'exam_pins':
        return <FileText className="w-6 h-6 text-white" />;
      case 'social_boost':
        return <Rocket className="w-6 h-6 text-white" />;
      case 'auto_topup':
        return <Repeat className="w-6 h-6 text-white" />;
      case 'tickets':
        return <Film className="w-6 h-6 text-white" />;
      case 'refer_earn':
        return <Users className="w-6 h-6 text-white" />;
      case 'withdraw':
        return <ArrowDownCircle className="w-6 h-6 text-white" />;
      case 'developer':
        return <Code2 className="w-6 h-6 text-white" />;
      case 'more':
        return <LayoutGrid className="w-6 h-6 text-white" />;
      default:
        return <Smartphone className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div id="home-tab-view" className="space-y-4 pb-20">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={user.avatarUrl} 
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50" 
            />
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 rounded-full ${
              isDark ? 'border-[#07161b]' : 'border-white'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Welcome back,
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Tier 2
              </span>
            </div>
            <h1 className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {user.fullName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            id="task-bonanza-banner-btn"
            onClick={onNavigateToTasks}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold animate-pulse cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Bonanza
          </button>
          <button 
            id="notifications-btn"
            className={`w-9 h-9 rounded-full border flex items-center justify-center relative transition cursor-pointer ${
              isDark 
                ? 'bg-[#0a232b] border-slate-800 text-slate-300 hover:text-white' 
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full" />
          </button>
        </div>
      </div>

      {/* Main Balance Card */}
      <div 
        id="wallet-balance-card"
        className={`rounded-2xl border p-4 shadow-xl relative overflow-hidden transition-all duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-[#0a2832] via-[#09222a] to-[#06181e] border-emerald-500/20 text-white' 
            : 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 border-emerald-400/30 text-white shadow-emerald-950/20'
        }`}
      >
        {/* Subtle geometric background glow */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs mb-1 text-emerald-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-100/80">Wallet Balance</span>
            <button
              id="toggle-balance-btn"
              onClick={() => setShowBalance(!showBalance)}
              className="text-emerald-200 hover:text-white transition cursor-pointer"
              title="Toggle Balance Visibility"
            >
              {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="text-[11px] text-emerald-200 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
            Live Automated
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {showBalance ? `₦${walletBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '₦ ••••••••'}
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-200/80 block">Commission</span>
            <span className="text-xs font-bold text-amber-300">
              {showBalance ? `₦${user.referralEarnings.toLocaleString()}` : '••••'}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15">
          <button
            id="fund-wallet-main-btn"
            onClick={onOpenFundWallet}
            className="py-2 px-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
            Fund Wallet
          </button>
          <button
            id="quick-transfer-btn"
            onClick={() => onOpenService('withdraw')}
            className="py-2 px-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/20 transition cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300" />
            Withdraw
          </button>
          <button
            id="quick-deals-btn"
            onClick={onNavigateToTasks}
            className="py-2 px-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Deals
          </button>
        </div>
      </div>

      {/* Interactive Carousel Announcement */}
      <div 
        id="promo-banner-slider"
        onClick={onNavigateToTasks}
        className={`p-3 rounded-2xl bg-gradient-to-r ${promos[activePromoIndex].bg} border backdrop-blur-sm cursor-pointer transition flex items-center justify-between shadow-sm`}
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-black shadow-sm">
              {promos[activePromoIndex].tag}
            </span>
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {promos[activePromoIndex].title}
            </span>
          </div>
          <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {promos[activePromoIndex].desc}
          </p>
        </div>
        <ChevronRight className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
      </div>

      {/* Services Grid Header */}
      <div className="flex items-center justify-between pt-1 px-1">
        <h2 className={`text-base font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Services
        </h2>
        <button 
          id="services-view-all-btn"
          onClick={() => onOpenService('more')}
          className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Services 4x4 Grid */}
      <div id="services-grid" className="grid grid-cols-4 gap-3">
        {INITIAL_SERVICES.map((srv) => (
          <button
            key={srv.id}
            id={`service-btn-${srv.id}`}
            onClick={() => onOpenService(srv.id)}
            className="flex flex-col items-center group focus:outline-none transition active:scale-95 cursor-pointer relative"
          >
            {/* Service Icon Container */}
            <div className="relative">
              <div 
                className={`w-14 h-14 rounded-2xl ${srv.iconBg} flex items-center justify-center shadow-md group-hover:brightness-110 transition duration-200`}
              >
                {getServiceIcon(srv.id)}
              </div>

              {/* Badges (e.g. NEW, HOT) */}
              {srv.badge && (
                <span 
                  className={`absolute -top-1.5 -right-2 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow-sm uppercase ${
                    srv.badgeColor || 'bg-rose-500 text-white'
                  }`}
                >
                  {srv.badge}
                </span>
              )}
            </div>

            {/* Service Label */}
            <span className={`text-[11px] font-medium text-center mt-1.5 leading-tight line-clamp-1 transition-colors ${
              isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900 font-semibold'
            }`}>
              {srv.title}
            </span>
          </button>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="pt-2">
        <h2 className={`text-base font-bold tracking-wide mb-2.5 px-1 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Coming Soon
        </h2>

        <div className="grid grid-cols-3 gap-2.5">
          <div 
            id="coming-soon-insurance"
            className={`border rounded-2xl p-3 flex flex-col items-center justify-center text-center opacity-90 hover:opacity-100 transition shadow-sm ${
              isDark ? 'bg-[#0a232b]/80 border-slate-800/80' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
              isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Insurance</span>
            <span className={`text-[10px] font-medium mt-0.5 px-2 py-0.2 rounded-full ${
              isDark ? 'text-slate-500 bg-slate-800/40' : 'text-slate-500 bg-slate-100'
            }`}>
              Soon
            </span>
          </div>

          <div 
            id="coming-soon-food"
            className={`border rounded-2xl p-3 flex flex-col items-center justify-center text-center opacity-90 hover:opacity-100 transition shadow-sm ${
              isDark ? 'bg-[#0a232b]/80 border-slate-800/80' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
              isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Food Order</span>
            <span className={`text-[10px] font-medium mt-0.5 px-2 py-0.2 rounded-full ${
              isDark ? 'text-slate-500 bg-slate-800/40' : 'text-slate-500 bg-slate-100'
            }`}>
              Soon
            </span>
          </div>

          <div 
            id="coming-soon-ride"
            className={`border rounded-2xl p-3 flex flex-col items-center justify-center text-center opacity-90 hover:opacity-100 transition shadow-sm ${
              isDark ? 'bg-[#0a232b]/80 border-slate-800/80' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
              isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <Car className="w-5 h-5" />
            </div>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Ride Booking</span>
            <span className={`text-[10px] font-medium mt-0.5 px-2 py-0.2 rounded-full ${
              isDark ? 'text-slate-500 bg-slate-800/40' : 'text-slate-500 bg-slate-100'
            }`}>
              Soon
            </span>
          </div>
        </div>
      </div>

      {/* Quick Recent Activity */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className={`text-xs font-bold tracking-wide uppercase ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Recent Transactions
          </h2>
          <button
            id="view-all-transactions-link"
            onClick={onNavigateToTransactions}
            className="text-[11px] text-emerald-500 hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {recentTransactions.slice(0, 3).map((tx) => (
            <div
              key={tx.id}
              id={`recent-tx-${tx.id}`}
              onClick={() => onSelectTransaction(tx)}
              className={`p-3 border rounded-xl flex items-center justify-between transition cursor-pointer shadow-sm ${
                isDark 
                  ? 'bg-[#0a232b] hover:bg-[#0d2c36] border-slate-800/80' 
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  tx.type === 'airtime' ? 'bg-emerald-500/20 text-emerald-500' :
                  tx.type === 'budget_data' ? 'bg-purple-500/20 text-purple-500' :
                  tx.type === 'electricity' ? 'bg-amber-500/20 text-amber-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{tx.title}</p>
                  <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tx.recipient} • {tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>₦{tx.amount.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-500 font-semibold">Success</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
