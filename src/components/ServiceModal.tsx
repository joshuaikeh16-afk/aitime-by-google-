import React, { useState, useEffect } from 'react';
import { NetworkProvider, ServiceType, Transaction } from '../types';
import { 
  DATA_PLANS, 
  DISCO_PROVIDERS, 
  CABLE_PROVIDERS, 
  BETTING_PROVIDERS, 
  EXAM_PROVIDERS 
} from '../data/mockData';
import { purchaseAirtime, purchaseData, fetchDataPlans } from '../lib/backend';
import { 
  X, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  UserCheck, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle,
  Copy,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

interface ServiceModalProps {
  serviceId: ServiceType | null;
  onClose: () => void;
  walletBalance: number;
  onCompleteTransaction: (transaction: Transaction) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  serviceId,
  onClose,
  walletBalance,
  onCompleteTransaction,
}) => {
  const [network, setNetwork] = useState<NetworkProvider>('MTN');
  const [phone, setPhone] = useState<string>('08149830214');
  const [amount, setAmount] = useState<string>('1000');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [meterNumber, setMeterNumber] = useState<string>('45029184729');
  const [discoProvider, setDiscoProvider] = useState<string>(DISCO_PROVIDERS[0]);
  const [cableProvider, setCableProvider] = useState<string>('DSTV');
  const [cablePlan, setCablePlan] = useState<string>('DSTV Compact');
  const [cablePrice, setCablePrice] = useState<number>(15700);
  const [smartcard, setSmartcard] = useState<string>('1029482910');
  const [bettingSite, setBettingSite] = useState<string>('SportyBet');
  const [bettingUserId, setBettingUserId] = useState<string>('9284019');
  const [examType, setExamType] = useState<string>(EXAM_PROVIDERS[0].name);
  const [examQuantity, setExamQuantity] = useState<number>(1);
  const [socialPlatform, setSocialPlatform] = useState<string>('Instagram Followers');
  const [socialLink, setSocialLink] = useState<string>('https://instagram.com/myaccount');
  const [socialQuantity, setSocialQuantity] = useState<string>('1000');
  const [airToCashNetwork, setAirToCashNetwork] = useState<NetworkProvider>('MTN');
  const [airToCashAmount, setAirToCashAmount] = useState<string>('5000');
  const [withdrawBank, setWithdrawBank] = useState<string>('OPay Microfinance Bank');
  const [withdrawAccount, setWithdrawAccount] = useState<string>('8149830214');
  const [securityPin, setSecurityPin] = useState<string>('1234');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [liveDataPlans, setLiveDataPlans] = useState<{ id: string; name: string; price: number }[] | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Auto-detect network from phone prefix
  useEffect(() => {
    if (phone.length >= 4) {
      const prefix = phone.substring(0, 4);
      if (['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906'].includes(prefix)) {
        setNetwork('MTN');
      } else if (['0802', '0808', '0708', '0812', '0701', '0902', '0907', '0901'].includes(prefix)) {
        setNetwork('AIRTEL');
      } else if (['0805', '0807', '0705', '0815', '0811', '0905'].includes(prefix)) {
        setNetwork('GLO');
      } else if (['0809', '0817', '0818', '0909', '0908'].includes(prefix)) {
        setNetwork('9MOBILE');
      }
    }
  }, [phone]);

  // Real data plans (replaces DATA_PLANS mock) for airtime/data
  // service types -- fetched live from IA-Cafe whenever the network
  // selection changes. Falls back to the mock list if the live fetch
  // fails or returns nothing, so the UI doesn't just break, but a real
  // purchase attempt against a mock plan ID will fail server-side
  // (that's intentional -- better an honest error than a silent fake
  // success).
  useEffect(() => {
    if (serviceId !== 'budget_data' && serviceId !== 'std_data') return;

    let cancelled = false;
    setIsLoadingPlans(true);
    fetchDataPlans(network).then((variations) => {
      if (cancelled) return;
      setIsLoadingPlans(false);
      if (variations.length > 0) {
        setLiveDataPlans(
          variations.map((v) => ({ id: v.variation_code, name: v.name, price: v.price }))
        );
      } else {
        setLiveDataPlans(null); // fall back to mock DATA_PLANS below
      }
    });
    return () => {
      cancelled = true;
    };
  }, [network, serviceId]);

  const activePlans = liveDataPlans ?? DATA_PLANS[network] ?? [];

  // Set default plan for data
  useEffect(() => {
    if (activePlans.length > 0) {
      setSelectedPlanId(activePlans[1]?.id || activePlans[0].id);
    }
  }, [network, liveDataPlans]);

  // Simulate customer name verification
  const handleVerifyCustomer = (target: string) => {
    setIsVerifying(true);
    setVerifiedName(null);
    setTimeout(() => {
      setIsVerifying(false);
      if (target === 'meter') {
        setVerifiedName('OLAWALE JOHNSON ADEBAYO (Prepaid)');
      } else if (target === 'smartcard') {
        setVerifiedName('JOSHUA IKEH (Active)');
      } else if (target === 'betting') {
        setVerifiedName('JOSH_PUNTER_99 (Verified)');
      } else if (target === 'bank') {
        setVerifiedName('JOSHUA CHUKWUEMEKA IKEH');
      }
    }, 600);
  };

  if (!serviceId) return null;

  // Calculate final cost
  const getTransactionCost = (): number => {
    switch (serviceId) {
      case 'airtime':
        const airtimeVal = parseFloat(amount) || 0;
        return Math.max(0, airtimeVal * 0.98); // 2% discount
      case 'budget_data':
      case 'std_data':
        const plan = activePlans?.find((p) => p.id === selectedPlanId);
        return plan ? plan.price : 265;
      case 'electricity':
        return parseFloat(amount) || 2000;
      case 'cable_tv':
        return cablePrice;
      case 'exam_pins':
        const ex = EXAM_PROVIDERS.find((e) => e.name === examType);
        return (ex ? ex.price : 3800) * examQuantity;
      case 'betting':
        return parseFloat(amount) || 1000;
      case 'social_boost':
        return (parseFloat(socialQuantity) || 1000) * 1.8;
      case 'withdraw':
        return (parseFloat(amount) || 5000) + 25; // ₦25 transfer fee
      case 'air_to_cash':
        return 0; // pays into wallet or bank
      case 'epins':
        return parseFloat(amount) || 1000;
      default:
        return parseFloat(amount) || 1000;
    }
  };

  const finalCost = getTransactionCost();

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (serviceId !== 'air_to_cash' && finalCost > walletBalance) {
      setErrorMsg(`Insufficient wallet balance. You need ₦${finalCost.toLocaleString()} but have ₦${walletBalance.toLocaleString()}. Please fund your wallet.`);
      return;
    }

    setIsProcessing(true);

    // --- REAL purchase path: airtime and data only, via the actual
    // IA-Cafe API (server-side, real money moves against your real
    // IA-Cafe wallet). Every other service type below this block
    // remains a UI-only simulation -- out of scope for the Saturday
    // demo, not wired to any real backend. ---
    if (serviceId === 'airtime' || serviceId === 'budget_data' || serviceId === 'std_data') {
      let result;

      if (serviceId === 'airtime') {
        result = await purchaseAirtime(network as any, phone, Number(amount));
      } else {
        const plan = activePlans?.find((p) => p.id === selectedPlanId);
        if (!plan) {
          setIsProcessing(false);
          setErrorMsg('Select a data plan first.');
          return;
        }
        // NOTE: DATA_PLANS is still mock data with made-up IDs (e.g.
        // 'mtn-2'), not real IA-Cafe variation codes yet. This will
        // fail against the real API until DATA_PLANS is replaced with
        // a live fetchDataPlans() call per network -- flagged as the
        // next thing to fix, not silently pretending this works.
        result = await purchaseData(network as any, phone, plan.price, plan.id);
      }

      setIsProcessing(false);

      if (!result.success) {
        setErrorMsg(result.error || 'Purchase failed. Please try again.');
        return;
      }

      const refId = `VTU-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      let title = '';
      let category = '';
      if (serviceId === 'airtime') {
        title = `${network} ₦${Number(amount).toLocaleString()} Instant Airtime`;
        category = 'Airtime';
      } else {
        const plan = activePlans?.find((p) => p.id === selectedPlanId);
        title = `${network} ${plan?.name || 'Data Bundle'}`;
        category = 'Data Bundle';
      }

      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        ref: refId,
        type: serviceId,
        title,
        category,
        amount: finalCost,
        recipient: phone,
        network: network as any,
        status: 'successful',
        date: dateStr,
        time: timeStr,
        paymentMethod: 'Wallet Balance',
        cashbackEarned: serviceId === 'airtime' ? Math.round(finalCost * 0.02) : undefined,
      };

      onCompleteTransaction(tx);
      onClose();
      return;
    }

    // --- Everything below is the original UI-only simulation for
    // service types not in scope for Saturday (electricity, cable,
    // exam pins, betting, social boost, withdraw, air-to-cash). ---
    setTimeout(() => {
      setIsProcessing(false);

      const refId = `VTU-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      let title = 'VTU Service';
      let category = 'Airtime & Data';
      let recipientVal = phone;
      let tokenVal: string | undefined = undefined;

      if (serviceId === 'airtime') {
        title = `${network} ₦${Number(amount).toLocaleString()} Instant Airtime`;
        category = 'Airtime';
        recipientVal = phone;
      } else if (serviceId === 'budget_data' || serviceId === 'std_data') {
        const plan = activePlans?.find((p) => p.id === selectedPlanId);
        title = `${network} ${plan?.name || 'Data Bundle'}`;
        category = 'Data Bundle';
        recipientVal = phone;
      } else if (serviceId === 'electricity') {
        title = `${discoProvider.split('-')[0].trim()} Electricity Token`;
        category = 'Electricity Bill';
        recipientVal = `${meterNumber} (Meter)`;
        tokenVal = `${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}`;
      } else if (serviceId === 'cable_tv') {
        title = `${cableProvider} ${cablePlan}`;
        category = 'Cable Subscription';
        recipientVal = `${smartcard} (${cableProvider})`;
      } else if (serviceId === 'exam_pins') {
        title = `${examType} (x${examQuantity})`;
        category = 'Exam PIN';
        recipientVal = phone;
        tokenVal = `PIN: ${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)} | Serial: EX${Math.floor(1000000 + Math.random()*9000000)}`;
      } else if (serviceId === 'betting') {
        title = `${bettingSite} Wallet Topup`;
        category = 'Betting Funding';
        recipientVal = `${bettingUserId} (${bettingSite})`;
      } else if (serviceId === 'air_to_cash') {
        const receivedCash = Math.round(Number(airToCashAmount) * 0.82);
        title = `Airtime to Cash (${airToCashNetwork} ₦${airToCashAmount})`;
        category = 'Air to Cash';
        recipientVal = `Payout of ₦${receivedCash.toLocaleString()} to ${withdrawBank}`;
      } else if (serviceId === 'withdraw') {
        title = `Withdrawal to ${withdrawBank}`;
        category = 'Bank Payout';
        recipientVal = `${withdrawAccount} (Joshua Ikeh)`;
      } else {
        title = `Instant ${serviceId.replace('_', ' ').toUpperCase()} Purchase`;
        recipientVal = phone;
      }

      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        ref: refId,
        type: serviceId,
        title,
        category,
        amount: serviceId === 'air_to_cash' ? Number(airToCashAmount) : finalCost,
        recipient: recipientVal,
        network: ['airtime', 'budget_data', 'std_data', 'epins'].includes(serviceId) ? network : undefined,
        status: 'successful',
        date: dateStr,
        time: timeStr,
        token: tokenVal,
        paymentMethod: 'Instant Wallet Balance',
        cashbackEarned: serviceId === 'airtime' ? Math.round(finalCost * 0.02) : undefined,
      };

      onCompleteTransaction(tx);
      onClose();
    }, 1000);
  };

  return (
    <div id="service-modal-backdrop" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div 
        id="service-modal-container"
        className="w-full max-w-md bg-[#071920] border border-slate-700/60 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#05141a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide">
                {serviceId.replace(/_/g, ' ')}
              </h3>
              <p className="text-[11px] text-slate-400">Instant Automated Delivery</p>
            </div>
          </div>
          <button 
            id="close-service-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleExecute} className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Network Selector for Telecom Services */}
          {['airtime', 'budget_data', 'std_data', 'epins'].includes(serviceId) && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Network Provider
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['MTN', 'AIRTEL', 'GLO', '9MOBILE'] as NetworkProvider[]).map((net) => {
                  const isSelected = network === net;
                  let colorClasses = 'border-slate-800 bg-[#0a232b] text-slate-300';
                  if (isSelected) {
                    if (net === 'MTN') colorClasses = 'border-yellow-400 bg-yellow-400/20 text-yellow-300 font-bold';
                    if (net === 'AIRTEL') colorClasses = 'border-red-500 bg-red-500/20 text-red-300 font-bold';
                    if (net === 'GLO') colorClasses = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold';
                    if (net === '9MOBILE') colorClasses = 'border-lime-500 bg-lime-500/20 text-lime-300 font-bold';
                  }
                  return (
                    <button
                      key={net}
                      type="button"
                      id={`network-select-${net.toLowerCase()}`}
                      onClick={() => setNetwork(net)}
                      className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center gap-1 border transition ${colorClasses}`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{
                        backgroundColor: net === 'MTN' ? '#facc15' : net === 'AIRTEL' ? '#ef4444' : net === 'GLO' ? '#10b981' : '#84cc16'
                      }}></span>
                      <span>{net}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Phone Number Input */}
          {['airtime', 'budget_data', 'std_data', 'exam_pins', 'epins', 'auto_topup'].includes(serviceId) && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Recipient Phone Number</label>
                <button
                  type="button"
                  id="use-my-phone-btn"
                  onClick={() => setPhone('08149830214')}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Use My Number
                </button>
              </div>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  id="recipient-phone-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678"
                  required
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-white font-medium text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Airtime Amount */}
          {serviceId === 'airtime' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Airtime Amount (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                <input
                  type="number"
                  id="airtime-amount-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="50"
                  max="50000"
                  required
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl pl-8 pr-4 py-2.5 text-white font-bold text-base focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {['200', '500', '1000', '2000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className="py-1 text-[11px] rounded-lg bg-[#0a232b] border border-slate-800 text-slate-300 hover:bg-slate-800"
                  >
                    ₦{val}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3" />
                <span>You pay: <strong>₦{(Number(amount || 0) * 0.98).toLocaleString()}</strong> (2% Instant Discount)</span>
              </div>
            </div>
          )}

          {/* Data Plan Selection */}
          {(serviceId === 'budget_data' || serviceId === 'std_data') && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Data Bundle Plan
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activePlans?.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      id={`data-plan-${plan.id}`}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold shadow-sm'
                          : 'border-slate-800 bg-[#0a232b] text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{plan.name}</p>
                          <span className="text-[10px] text-slate-400 font-normal">{plan.type} Bundle</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400">
                        ₦{plan.price.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Electricity Meter Details */}
          {serviceId === 'electricity' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Disco Distribution</label>
                <select
                  id="disco-select"
                  value={discoProvider}
                  onChange={(e) => setDiscoProvider(e.target.value)}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {DISCO_PROVIDERS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Meter Number</label>
                  <button
                    type="button"
                    id="verify-meter-btn"
                    onClick={() => handleVerifyCustomer('meter')}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {isVerifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
                    Validate Meter
                  </button>
                </div>
                <input
                  type="text"
                  id="meter-number-input"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  placeholder="e.g. 45029184729"
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {verifiedName && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  <span className="text-slate-400 block text-[10px]">Customer Name:</span>
                  <span className="font-bold">{verifiedName}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Token Amount (₦)</label>
                <input
                  type="number"
                  id="electricity-amount-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="500"
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Cable TV */}
          {serviceId === 'cable_tv' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Cable Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {['DSTV', 'GOtv', 'Startimes'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      id={`cable-btn-${p.toLowerCase()}`}
                      onClick={() => {
                        setCableProvider(p);
                        const prov = CABLE_PROVIDERS.find((c) => c.name === p);
                        if (prov && prov.plans[0]) {
                          setCablePlan(prov.plans[0].name);
                          setCablePrice(prov.plans[0].price);
                        }
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        cableProvider === p
                          ? 'border-red-500 bg-red-500/20 text-white'
                          : 'border-slate-800 bg-[#0a232b] text-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Package</label>
                <select
                  id="cable-package-select"
                  value={cablePlan}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setCablePlan(selected);
                    const prov = CABLE_PROVIDERS.find((c) => c.name === cableProvider);
                    const found = prov?.plans.find((pl) => pl.name === selected);
                    if (found) setCablePrice(found.price);
                  }}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {CABLE_PROVIDERS.find((c) => c.name === cableProvider)?.plans.map((pl) => (
                    <option key={pl.name} value={pl.name}>
                      {pl.name} - ₦{pl.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Smartcard / IUC Number</label>
                  <button
                    type="button"
                    id="verify-smartcard-btn"
                    onClick={() => handleVerifyCustomer('smartcard')}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {isVerifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
                    Verify Name
                  </button>
                </div>
                <input
                  type="text"
                  id="smartcard-input"
                  value={smartcard}
                  onChange={(e) => setSmartcard(e.target.value)}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {verifiedName && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  <span className="text-slate-400 block text-[10px]">Subscriber Name:</span>
                  <span className="font-bold">{verifiedName}</span>
                </div>
              )}
            </div>
          )}

          {/* Airtime to Cash */}
          {serviceId === 'air_to_cash' && (
            <div className="space-y-3">
              <div className="bg-pink-950/30 border border-pink-500/30 rounded-xl p-3 text-xs text-pink-200">
                ⚡ Convert unused airtime to instant Naira into your bank account. Rate: <strong>82%</strong> payout.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Airtime Network</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['MTN', 'AIRTEL', 'GLO', '9MOBILE'] as NetworkProvider[]).map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setAirToCashNetwork(net)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        airToCashNetwork === net
                          ? 'border-pink-500 bg-pink-500/20 text-white'
                          : 'border-slate-800 bg-[#0a232b] text-slate-400'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Airtime Amount to Send (₦)</label>
                <input
                  type="number"
                  id="air-to-cash-amount-input"
                  value={airToCashAmount}
                  onChange={(e) => setAirToCashAmount(e.target.value)}
                  min="1000"
                  step="500"
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="p-3 bg-[#0a232b] rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Conversion Rate:</span>
                  <span>82%</span>
                </div>
                <div className="flex justify-between font-bold text-white text-sm">
                  <span>Cash to Receive:</span>
                  <span className="text-emerald-400">
                    ₦{Math.round(Number(airToCashAmount || 0) * 0.82).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Betting Funding */}
          {serviceId === 'betting' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Bookmaker</label>
                <select
                  id="betting-provider-select"
                  value={bettingSite}
                  onChange={(e) => setBettingSite(e.target.value)}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {BETTING_PROVIDERS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Customer User ID</label>
                  <button
                    type="button"
                    id="verify-betting-user-btn"
                    onClick={() => handleVerifyCustomer('betting')}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {isVerifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
                    Verify Account
                  </button>
                </div>
                <input
                  type="text"
                  id="betting-user-id-input"
                  value={bettingUserId}
                  onChange={(e) => setBettingUserId(e.target.value)}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {verifiedName && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  <span className="text-slate-400 block text-[10px]">Punter Name:</span>
                  <span className="font-bold">{verifiedName}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Top-up Amount (₦)</label>
                <input
                  type="number"
                  id="betting-amount-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Exam PINs */}
          {serviceId === 'exam_pins' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exam Examination Body</label>
                <select
                  id="exam-type-select"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {EXAM_PROVIDERS.map((ex) => (
                    <option key={ex.name} value={ex.name}>
                      {ex.name} - ₦{ex.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quantity of PINs</label>
                <div className="flex gap-2">
                  {[1, 2, 5, 10].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setExamQuantity(q)}
                      className={`flex-1 py-2 text-xs rounded-xl border font-bold transition ${
                        examQuantity === q
                          ? 'border-lime-500 bg-lime-500/20 text-lime-300'
                          : 'border-slate-800 bg-[#0a232b] text-slate-300'
                      }`}
                    >
                      {q} PIN{q > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Withdraw */}
          {serviceId === 'withdraw' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destination Bank</label>
                <select
                  id="withdraw-bank-select"
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option>OPay Microfinance Bank</option>
                  <option>PalmPay</option>
                  <option>Moniepoint MFB</option>
                  <option>Kuda Bank</option>
                  <option>Guaranty Trust Bank (GTB)</option>
                  <option>Zenith Bank</option>
                  <option>Access Bank</option>
                  <option>First Bank of Nigeria</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Account Number (10 Digits)</label>
                  <button
                    type="button"
                    id="verify-bank-account-btn"
                    onClick={() => handleVerifyCustomer('bank')}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {isVerifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
                    Confirm Account Name
                  </button>
                </div>
                <input
                  type="text"
                  id="withdraw-account-input"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {verifiedName && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  <span className="text-slate-400 block text-[10px]">Beneficiary Name:</span>
                  <span className="font-bold">{verifiedName}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Withdrawal Amount (₦)</label>
                <input
                  type="number"
                  id="withdraw-amount-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="500"
                  max={walletBalance}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Flat payout fee: ₦25. Max daily limit: ₦1,000,000</p>
              </div>
            </div>
          )}

          {/* Developer API */}
          {serviceId === 'developer' && (
            <div className="space-y-3">
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-3 text-xs text-blue-200">
                🚀 Build your own VTU platform or bot with our lightning-fast JSON API. 99.9% automated uptime.
              </div>

              <div className="bg-[#0a232b] rounded-xl p-3 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Live API Key</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Active</span>
                </div>
                <p className="font-mono text-[11px] bg-black/40 p-2 rounded text-slate-300 break-all select-all">
                  vtu_live_9a8f4c2e1b7d5a0c3f8e9184729182
                </p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Webhook URL: <strong>https://myapp.com/api/vtu</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Social Boost */}
          {serviceId === 'social_boost' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Social Platform & Service</label>
                <select
                  id="social-platform-select"
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value)}
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-rose-500"
                >
                  <option>Instagram Followers (Real & Active)</option>
                  <option>Instagram Likes & Views</option>
                  <option>TikTok Real Followers</option>
                  <option>TikTok Video Views / Likes</option>
                  <option>YouTube Subscribers & Watch Hours</option>
                  <option>Twitter/X Followers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Profile / Post Link</label>
                <input
                  type="url"
                  id="social-link-input"
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quantity (Units)</label>
                <input
                  type="number"
                  id="social-quantity-input"
                  value={socialQuantity}
                  onChange={(e) => setSocialQuantity(e.target.value)}
                  min="100"
                  step="100"
                  className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          {/* Refer & Earn */}
          {serviceId === 'refer_earn' && (
            <div className="space-y-3">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-emerald-200">
                🎁 Share your unique referral code with friends and earn <strong>₦1,000 commission</strong> on their first wallet fund + 1% lifetime bonus on all their transactions.
              </div>

              <div className="bg-[#0a232b] p-3 rounded-xl border border-slate-800 text-center">
                <p className="text-[11px] text-slate-400 mb-1">Your Referral Link</p>
                <p className="font-mono text-xs font-bold text-amber-300 select-all">
                  https://vtuapp.ng/ref/VTU-JOSH77
                </p>
              </div>
            </div>
          )}

          {/* Security 4-Digit PIN */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              4-Digit Transaction Security PIN
            </label>
            <input
              type="password"
              id="security-pin-input"
              maxLength={4}
              value={securityPin}
              onChange={(e) => setSecurityPin(e.target.value)}
              placeholder="••••"
              required
              className="w-full bg-[#0a232b] border border-slate-700/80 rounded-xl px-4 py-2.5 text-center text-white tracking-widest text-lg font-bold focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-400 text-center mt-1">Default PIN: 1234 (Editable in Profile)</p>
          </div>

          {/* Payment Summary Box */}
          <div className="p-3.5 bg-[#05141a] rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Wallet Balance:</span>
              <span className="font-semibold text-slate-200">₦{walletBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Payable:</span>
              <span className="font-extrabold text-emerald-400 text-sm">
                ₦{finalCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            id="confirm-service-btn"
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Automated Delivery...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Pay & Dispense Now</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
