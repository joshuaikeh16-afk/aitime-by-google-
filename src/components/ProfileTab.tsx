import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Copy, 
  Check, 
  KeyRound, 
  Fingerprint, 
  Code2, 
  Users, 
  Headphones, 
  LogOut, 
  ExternalLink, 
  ChevronRight,
  Sparkles,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Share2,
  Moon,
  Sun,
  Palette,
  CheckCheck
} from 'lucide-react';

interface ProfileTabProps {
  user: UserProfile;
  onOpenFundWallet: () => void;
  onRewardClaimed: (amount: number, message: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onOpenFundWallet,
  onRewardClaimed,
}) => {
  const { theme, setTheme, isDark } = useTheme();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [currentPin, setCurrentPin] = useState<string>('1234');
  const [newPin, setNewPin] = useState<string>('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleTransferCommission = () => {
    if (user.referralEarnings <= 0) return;
    onRewardClaimed(user.referralEarnings, 'Transferred Referral Commission to Main Wallet');
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      setCurrentPin(newPin);
      setPinChangeSuccess(true);
      setTimeout(() => {
        setPinChangeSuccess(false);
        setShowPinModal(false);
        setNewPin('');
      }, 1200);
    }
  };

  return (
    <div id="profile-tab-view" className="space-y-4 pb-20">
      {/* Header */}
      <div className="px-1 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}>
              <User className="w-4 h-4" />
            </div>
            <div>
              <h1 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Account & Settings
              </h1>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Manage preferences, security & themes
              </p>
            </div>
          </div>

          {/* Quick theme pill indicator */}
          <button
            id="quick-theme-toggle-header-btn"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
              isDark 
                ? 'bg-[#0a232b] text-amber-300 border-slate-700 hover:bg-[#0f2f3a]' 
                : 'bg-white text-slate-800 border-slate-200 shadow-sm hover:bg-slate-50'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
          >
            {isDark ? <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" /> : <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30" />}
            <span className="text-[10px] uppercase font-bold">{theme}</span>
          </button>
        </div>
      </div>

      {/* User Identity Card */}
      <div 
        id="user-profile-summary-card"
        className={`border rounded-2xl p-4 space-y-3 shadow-lg transition-colors duration-300 ${
          isDark 
            ? 'bg-[#0a232b] border-slate-800' 
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img 
              src={user.avatarUrl} 
              alt={user.fullName} 
              className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 rounded-full ${
              isDark ? 'border-[#0a232b]' : 'border-white'
            }`} />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.fullName}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified
              </span>
            </div>
            <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>@{user.username}</p>
            <span className="inline-block text-[11px] text-amber-400 font-semibold">
              Package: {user.tier}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className={`space-y-1.5 pt-2 border-t text-xs ${
          isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-100 text-slate-700'
        }`}>
          <div className={`flex items-center justify-between py-1 border-b ${
            isDark ? 'border-slate-800/60' : 'border-slate-100'
          }`}>
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Phone
            </span>
            <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{user.phone}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
            </span>
            <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{user.email}</span>
          </div>
        </div>
      </div>

      {/* THEME & ACCESSIBILITY SWITCHER SECTION */}
      <div id="theme-switcher-section" className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-amber-400" />
            <h2 className={`text-xs font-bold uppercase tracking-wide ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Appearance & Accessibility
            </h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20">
            WCAG AA Compliant
          </span>
        </div>

        <div className={`border rounded-2xl p-3.5 space-y-3.5 shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0a232b] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Segmented Theme Switcher */}
          <div className="grid grid-cols-2 gap-2">
            {/* Dark Theme Button */}
            <button
              id="theme-switch-dark-btn"
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer relative ${
                theme === 'dark'
                  ? 'bg-[#06181e] border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/50'
                  : isDark
                    ? 'bg-[#071920] border-slate-800 text-slate-400 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  theme === 'dark' ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Moon className="w-4 h-4" />
                </div>
                {theme === 'dark' && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                    <CheckCheck className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs font-bold">Dark Theme</p>
              <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>
                Eye-friendly cyan night mode
              </p>
            </button>

            {/* Light Theme Button */}
            <button
              id="theme-switch-light-btn"
              onClick={() => setTheme('light')}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer relative ${
                theme === 'light'
                  ? 'bg-slate-50 border-emerald-600 text-slate-900 shadow-md ring-1 ring-emerald-600/50'
                  : isDark
                    ? 'bg-[#071920] border-slate-800 text-slate-400 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'bg-amber-500/20 text-amber-600' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Sun className="w-4 h-4" />
                </div>
                {theme === 'light' && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <CheckCheck className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs font-bold">Light Theme</p>
              <p className={`text-[10px] mt-0.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-500'}`}>
                High-contrast clean daylight
              </p>
            </button>
          </div>

          {/* Accessibility Info Bar */}
          <div className={`p-2.5 rounded-xl border text-[11px] flex items-center gap-2.5 ${
            isDark 
              ? 'bg-[#071920] border-slate-800/80 text-slate-300' 
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Theme preference is stored locally for instant switching on any device or lighting condition.
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Virtual Bank Accounts */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h2 className={`text-xs font-bold uppercase tracking-wide ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Dedicated Virtual Bank Accounts
            </h2>
          </div>
          <button
            id="profile-fund-wallet-btn"
            onClick={onOpenFundWallet}
            className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
          >
            Fund Wallet
          </button>
        </div>

        <div className="space-y-2">
          {user.virtualAccounts.map((acc, index) => (
            <div 
              key={index}
              className={`border rounded-2xl p-3.5 flex items-center justify-between shadow-sm transition-colors duration-300 ${
                isDark 
                  ? 'bg-[#0a232b] border-slate-800' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{acc.bankName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                    isDark ? 'bg-[#071920] text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {acc.accountNumber}
                  </span>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{acc.accountName}</p>
                <p className="text-[10px] text-emerald-400 font-medium">⚡ 1% fee capped at ₦50 • Instant automated credit</p>
              </div>

              <button
                id={`copy-account-btn-${index}`}
                onClick={() => handleCopy(acc.accountNumber, `acc-${index}`)}
                className={`p-2.5 rounded-xl transition cursor-pointer ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                }`}
                title="Copy Account Number"
              >
                {copiedText === `acc-${index}` ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Access Controls */}
      <div className="space-y-2.5">
        <h2 className={`text-xs font-bold uppercase tracking-wide px-1 ${
          isDark ? 'text-slate-200' : 'text-slate-800'
        }`}>
          Security & Access Controls
        </h2>

        <div className={`border rounded-2xl divide-y shadow-sm transition-colors duration-300 ${
          isDark 
            ? 'bg-[#0a232b] border-slate-800 divide-slate-800/80' 
            : 'bg-white border-slate-200 divide-slate-100'
        }`}>
          {/* Change PIN */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <p className={`font-bold text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Transaction PIN</p>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current PIN: ••••</p>
              </div>
            </div>
            <button
              id="change-pin-btn"
              onClick={() => setShowPinModal(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              Change PIN
            </button>
          </div>

          {/* Biometrics Status */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <p className={`font-bold text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Biometric Authentication</p>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Face ID & Fingerprint Login</p>
              </div>
            </div>
            <button
              id="toggle-biometrics-btn"
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer ${
                biometricsEnabled ? 'bg-emerald-600' : isDark ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2FA Status */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className={`font-bold text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>2FA SMS / Email OTP</p>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Instant login protection</p>
              </div>
            </div>
            <button
              id="toggle-2fa-btn"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer ${
                twoFactorEnabled ? 'bg-emerald-600' : isDark ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Developer API & Webhooks */}
      <div className="space-y-2.5">
        <h2 className={`text-xs font-bold uppercase tracking-wide px-1 ${
          isDark ? 'text-slate-200' : 'text-slate-800'
        }`}>
          Developer API Credentials
        </h2>

        <div className={`border rounded-2xl p-3.5 space-y-3 text-xs shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0a232b] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>REST API Key</span>
            </div>
            <button
              id="toggle-api-key-btn"
              onClick={() => setShowApiKey(!showApiKey)}
              className={`flex items-center gap-1 text-[11px] cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showApiKey ? 'Hide' : 'Reveal'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={showApiKey ? 'vtu_live_9a8f4c2e1b7d5a0c3f8e9184729182' : 'vtu_live_••••••••••••••••••••••••••••'}
              className={`flex-1 border rounded-xl px-3 py-2 text-[11px] font-mono select-all ${
                isDark ? 'bg-[#071920] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
            <button
              id="copy-api-key-btn"
              onClick={() => handleCopy('vtu_live_9a8f4c2e1b7d5a0c3f8e9184729182', 'api-key')}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {copiedText === 'api-key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Integrate Airtime & Data directly into your website, bot, or mobile app.
          </p>
        </div>
      </div>

      {/* Referral Program Summary */}
      <div className={`border rounded-2xl p-4 space-y-3 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-emerald-950/40 via-[#0a232b] to-[#0a232b] border-emerald-500/30' 
          : 'bg-emerald-50/70 border-emerald-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Referral Earnings</h3>
          </div>
          <span className="text-xs font-bold text-amber-500">
            ₦{user.referralEarnings.toLocaleString()}
          </span>
        </div>

        <div className={`flex items-center justify-between text-xs ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <span>Total Referred Users:</span>
          <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{user.totalReferrals} Active Members</span>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            id="copy-ref-link-btn"
            onClick={() => handleCopy(`https://vtuapp.ng/ref/${user.referralCode}`, 'ref-link')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-800'
            }`}
          >
            {copiedText === 'ref-link' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            Copy Link
          </button>
          <button
            id="withdraw-commission-btn"
            onClick={handleTransferCommission}
            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer"
          >
            Transfer to Wallet
          </button>
        </div>
      </div>

      {/* Support Center */}
      <div className={`border rounded-2xl divide-y text-xs shadow-sm transition-colors duration-300 ${
        isDark ? 'bg-[#0a232b] border-slate-800 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100'
      }`}>
        <a 
          href="https://wa.me/2348123534689?text=Hello%2C%20I%20need%20assistance%20with%20my%20VTU%20service"
          target="_blank"
          rel="noreferrer"
          className={`p-3.5 flex items-center justify-between transition ${
            isDark ? 'hover:bg-[#0c2e39]' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Headphones className="w-4 h-4 text-emerald-500" />
            <div>
              <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>24/7 WhatsApp Live Support</span>
              <span className="text-[10px] text-emerald-500 font-mono">+234 812 353 4689</span>
            </div>
          </div>
          <ExternalLink className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
        </a>
      </div>

      {/* Sign Out */}
      <button
        id="sign-out-btn"
        className={`w-full py-3 rounded-2xl border text-rose-500 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
          isDark 
            ? 'bg-[#0a232b] hover:bg-rose-950/20 border-slate-800 hover:border-rose-500/30' 
            : 'bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-200'
        }`}
      >
        <LogOut className="w-4 h-4" />
        Sign Out Account
      </button>

      {/* Change PIN Modal */}
      {showPinModal && (
        <div id="change-pin-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-xs border rounded-2xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 ${
            isDark ? 'bg-[#071920] border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>Change Security PIN</h3>
            
            {pinChangeSuccess ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 text-center font-bold">
                ✓ PIN Updated Successfully!
              </div>
            ) : (
              <form onSubmit={handleSaveNewPin} className="space-y-3">
                <div>
                  <label className={`block text-[11px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Enter New 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="••••"
                    required
                    className={`w-full border rounded-xl py-2 text-center text-lg font-bold tracking-widest focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-[#0a232b] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-bold cursor-pointer shadow-sm"
                  >
                    Save PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
