import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Building2, 
  CreditCard, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Smartphone, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onFundSuccess: (amount: number, method: string) => void;
}

export const FundWalletModal: React.FC<FundWalletModalProps> = ({
  isOpen,
  onClose,
  user,
  onFundSuccess,
}) => {
  const [activeGateway, setActiveGateway] = useState<'bank' | 'card' | 'ussd'>('bank');
  const [cardAmount, setCardAmount] = useState<string>('5000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [ussdBank, setUssdBank] = useState('GTBank (*737#)');

  if (!isOpen) return null;

  const handleCopy = (accNumber: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedAccount(accNumber);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleSimulateCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(cardAmount);
    if (!num || num < 100) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onFundSuccess(num, 'Paystack Online Card');
      onClose();
    }, 1200);
  };

  const handleSimulateBankTransferReceived = (account: string, bank: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onFundSuccess(5000, `Automated Transfer (${bank})`);
      onClose();
    }, 1000);
  };

  return (
    <div id="fund-wallet-modal" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div 
        id="fund-wallet-container"
        className="w-full max-w-md bg-[#071920] border border-slate-700/60 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#05141a]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Fund Wallet</h3>
              <p className="text-[11px] text-slate-400">Instant Automated Credit Gateway</p>
            </div>
          </div>
          <button 
            id="close-fund-wallet-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 p-1.5 mx-4 mt-3 bg-[#0a232b] rounded-xl border border-slate-800 text-xs">
          <button
            id="fund-tab-bank"
            onClick={() => setActiveGateway('bank')}
            className={`py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeGateway === 'bank'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Bank Transfer
          </button>
          <button
            id="fund-tab-card"
            onClick={() => setActiveGateway('card')}
            className={`py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeGateway === 'card'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Card / Online
          </button>
          <button
            id="fund-tab-ussd"
            onClick={() => setActiveGateway('ussd')}
            className={`py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeGateway === 'ussd'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            USSD Code
          </button>
        </div>

        {/* Gateway Content */}
        <div className="p-4 overflow-y-auto space-y-3.5">
          {activeGateway === 'bank' && (
            <div className="space-y-3">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Transfer any amount to your dedicated account number below. Your wallet is <strong className="text-white">credited automatically within 5 seconds</strong>.
                </span>
              </div>

              {user.virtualAccounts.map((acc, idx) => (
                <div 
                  key={idx}
                  className="bg-[#0b242c] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-300">{acc.bankName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                      {acc.charge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wide">Account Number</p>
                      <p className="text-xl font-mono font-extrabold text-white tracking-wider">
                        {acc.accountNumber}
                      </p>
                    </div>
                    <button
                      id={`copy-acc-${idx}`}
                      onClick={() => handleCopy(acc.accountNumber)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      {copiedAccount === acc.accountNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Account Name: <strong className="text-slate-200">{acc.accountName}</strong></span>
                    <button
                      id={`simulate-credit-${idx}`}
                      onClick={() => handleSimulateBankTransferReceived(acc.accountNumber, acc.bankName)}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Test Auto-Deposit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeGateway === 'card' && (
            <form onSubmit={handleSimulateCardPayment} className="space-y-4">
              <div className="bg-[#0b242c] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Amount to Deposit (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₦</span>
                    <input
                      type="number"
                      id="card-amount-input"
                      value={cardAmount}
                      onChange={(e) => setCardAmount(e.target.value)}
                      placeholder="e.g. 5000"
                      min="100"
                      className="w-full bg-[#071920] border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-bold text-base focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {['1000', '2000', '5000', '10000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCardAmount(preset)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border transition ${
                        cardAmount === preset
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-[#071920] border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      +₦{Number(preset).toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Gateway Fee (1.4%):</span>
                  <span className="text-slate-200">₦{Math.round(Number(cardAmount || 0) * 0.014)}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between font-semibold">
                  <span>Total Debit:</span>
                  <span className="text-emerald-400 font-bold">
                    ₦{(Number(cardAmount || 0) + Math.round(Number(cardAmount || 0) * 0.014)).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                id="paystack-submit-btn"
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Connecting Secure Gateway...
                  </>
                ) : (
                  <>
                    <span>Proceed with Paystack / Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {activeGateway === 'ussd' && (
            <div className="space-y-3">
              <div className="bg-[#0b242c] border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Select Your Bank</label>
                  <select
                    id="ussd-bank-select"
                    value={ussdBank}
                    onChange={(e) => setUssdBank(e.target.value)}
                    className="w-full bg-[#071920] border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>GTBank (*737#)</option>
                    <option>Zenith Bank (*966#)</option>
                    <option>Access Bank (*901#)</option>
                    <option>First Bank (*894#)</option>
                    <option>UBA (*919#)</option>
                    <option>Stanbic IBTC (*909#)</option>
                  </select>
                </div>

                <div className="p-3 bg-[#071920] rounded-xl border border-slate-800 text-center space-y-1">
                  <p className="text-slate-400 text-[11px]">Dial this code on your registered SIM:</p>
                  <p className="font-mono text-base font-bold text-amber-400 tracking-wider">
                    *737*50*5000*6584920194#
                  </p>
                </div>

                <button
                  id="ussd-complete-btn"
                  onClick={() => {
                    onFundSuccess(5000, 'USSD Instant Topup');
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> I have completed the dial
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="p-3.5 bg-[#05141a] border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-Bit SSL Encrypted & CBN Regulated Payouts</span>
        </div>
      </div>
    </div>
  );
};
