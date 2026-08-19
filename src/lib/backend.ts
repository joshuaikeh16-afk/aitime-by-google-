import { supabase } from './supabaseClient';
import { Transaction, NetworkProvider } from '../types';

// ---------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => callback(session));
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

// ---------------------------------------------------------------------
// Wallet
// ---------------------------------------------------------------------

export async function getWalletBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return 0;
  return Number(data.balance);
}

/** Real transaction history, mapped into the app's existing Transaction shape so the UI doesn't need to change. */
export async function getTransactionHistory(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*, vtu_orders(service_type, provider, recipient, iacafe_reference)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((row: any): Transaction => {
    const vtu = Array.isArray(row.vtu_orders) ? row.vtu_orders[0] : row.vtu_orders;
    const date = new Date(row.created_at);
    const isCredit = row.type === 'credit' || row.type === 'refund';

    return {
      id: row.id,
      ref: row.reference,
      type: vtu?.service_type ?? (isCredit ? 'wallet_funding' : 'airtime'),
      title: row.description ?? (isCredit ? 'Wallet Top-up' : 'Purchase'),
      category: vtu?.service_type === 'data' ? 'Data Bundle' : vtu?.service_type === 'airtime' ? 'Airtime' : 'Wallet',
      amount: Number(row.amount),
      recipient: vtu?.recipient ?? '',
      network: vtu?.provider ? (vtu.provider.toUpperCase() as NetworkProvider) : undefined,
      status: row.status === 'completed' ? 'successful' : row.status === 'failed' ? 'failed' : 'pending',
      date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: isCredit ? 'Paystack' : 'Wallet Balance',
    };
  });
}

// ---------------------------------------------------------------------
// IA-Cafe purchases (airtime + data)
// ---------------------------------------------------------------------

interface DataPlanVariation {
  variation_code: string;
  name: string;
  price: number;
}

/** Fetches REAL data plans from IA-Cafe for a given network -- never hardcoded. */
export async function fetchDataPlans(network: NetworkProvider): Promise<DataPlanVariation[]> {
  const { data, error } = await supabase.functions.invoke('iacafe-variations', {
    body: { product: 'data', serviceId: network.toLowerCase() },
  });
  if (error || !data) return [];
  // IA-Cafe's exact response shape for /variations hasn't been verified
  // against a live call yet -- this defensively checks a couple of
  // likely shapes. Confirm against a real response and adjust the key
  // names below if this doesn't match.
  const variations = data.variations ?? data.data?.variations ?? data.data ?? [];
  return Array.isArray(variations) ? variations : [];
}

interface PurchaseResult {
  success: boolean;
  error?: string;
  orderId?: string;
}

export async function purchaseAirtime(network: NetworkProvider, phone: string, amount: number): Promise<PurchaseResult> {
  const { data, error } = await supabase.functions.invoke('iacafe-purchase', {
    body: { serviceType: 'airtime', network: network.toLowerCase(), phone, amount },
  });
  if (error) return { success: false, error: error.message };
  if (data?.error) return { success: false, error: data.error };
  return { success: true, orderId: data?.orderId };
}

export async function purchaseData(
  network: NetworkProvider,
  phone: string,
  amount: number,
  variationCode: string
): Promise<PurchaseResult> {
  const { data, error } = await supabase.functions.invoke('iacafe-purchase', {
    body: { serviceType: 'data', network: network.toLowerCase(), phone, amount, variationCode },
  });
  if (error) return { success: false, error: error.message };
  if (data?.error) return { success: false, error: data.error };
  return { success: true, orderId: data?.orderId };
}

// ---------------------------------------------------------------------
// Paystack wallet top-up
// ---------------------------------------------------------------------

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string;

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).PaystackPop) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

/**
 * Initiates a top-up: creates a tracked order server-side (paystack-init),
 * then opens the real Paystack popup, then verifies server-side
 * (paystack-verify) once the popup closes. The webhook is the reliable
 * backstop if the user closes the browser mid-flow -- this client-side
 * verify is just for a fast UI update.
 */
export async function initiateTopUp(
  userEmail: string,
  amount: number,
  onSuccess: (creditedAmount: number) => void,
  onError: (message: string) => void
) {
  const { data: initData, error: initError } = await supabase.functions.invoke('paystack-init', {
    body: { amount },
  });
  if (initError || !initData?.reference) {
    onError('Could not start payment. Try again.');
    return;
  }

  await loadPaystackScript();

  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: userEmail,
    amount: Math.round(amount * 100), // Paystack expects kobo
    ref: initData.reference,
    callback: (response: any) => {
      // Popup closed with a completed charge -- verify server-side
      supabase.functions
        .invoke('paystack-verify', { body: { reference: response.reference } })
        .then(({ data, error }) => {
          if (error || data?.error) {
            onError('Payment could not be verified. If you were charged, it will reflect shortly via automatic confirmation.');
            return;
          }
          onSuccess(data.amount);
        });
    },
    onClose: () => {
      // User closed the popup without paying -- nothing to do, the
      // order stays 'pending' in the orders table.
    },
  });

  handler.openIframe();
}
