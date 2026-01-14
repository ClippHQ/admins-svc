export type CreditObject = {
    payer: {
        name: string;
        bank_name: string;
        account_number: string;
    };
};
export interface TransactionWA {
    id: string;
    wallet_id: string;
    account_id: string;
    code: string;
    deposit_id?: string;
    payout_id?: string;
    conversion_id?: string;
    description: string;
    balance_before: number;
    balance_after: number;
    amount_total: number;
    amount: number;
    fee: number;
    created_at: string;
    updated_at: string;
    object?: string | CreditObject | DebitObject;

    type: "credit" | "debit";
    kind: "conversion" | "payout" | "deposit" | "earning";
    currency: "NGN" | "USD" | "GBP" | "EUR";
    status: "pending" | "successful" | "failed";
}

export interface Payout {
    id: string;
    created_at: string;
    updated_at: string;
    wallet_id: string;
    provider: string;
    provider_code: string;
    reference: string;
    quote_reference: string | null;
    currency_destination: string;
    currency_source: string;
    amount_destination: number;
    amount_source: number;
    fee: number;
    account_number: string;
    account_name: string;
    bank_code: string;
    bank_name: string;
    sort_code: string | null;
    swift_code: string | null;
    country: string;
    is_document_required: number;
    recipient_information: Record<string, unknown>;
    required_documents: string[];
    status: "pending" | "successful" | "failed" | 'reversed' | 'sent';
    payment_scheme: string | null;
    narration: string | null;
    provider_destination_id: string | null;
    bank_address: string | null;
}
export interface Deposit {
    created_at: string;
    updated_at: string;
    id: string;
    wallet_id: string;
    account_id: string;
    address_id: string | null;
    type: string;
    provider: string;
    provider_code: string | number | null;
    provider_fee?: number;
    confirmations: number;
    amount: number;
    chain_hash: string | null;
    currency: string;
    status: "pending" | "successful" | "failed" | "confirmed" | "rejected" | 'in_review';
    payer: string;
    amount_settled: number;
    fee: number;
    transaction_object?: {
        id: string;
        payer: {
            name: string;
            bank_code: string;
            bank_name: string;
            account_number: string;
        };
        reason: string;
    };
}

export type DebitObject = {
    id: string;
    bank_code: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    currency_destination: string;
};


export type User = {
  created_at: string;
  updated_at: string;
  id: string;
  profile_id: string;
  status: "pending" | "verified" | "restricted";
  is_flagged:  number;  // 0 or 1
  wallet_id: string;
  kyc_verification_id: string;
  
  referral_code: string
  pin?: string;

};
export type Profile = {
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
  name_first: string;
  name_other: string;
  name_last: string;
  dob: string;
  phone: string;
  phone_prefix: string;
  gender?: string;
  avatar?: string;
  email: string;
  email_verified: number;
  phone_verified: number;
};


export interface KYCVerification {
    created_at: string;
    updated_at: string;
    id: string
    user_id: string;
    address_city: string;
    address_country: string;
    address_state: string;
    address_zip: string;
    occupation: string;
    comment: string;
    status: string;
    address_street_2: string;
    is_stale: boolean;
    address_number: string;
    address_street: string;
    tax_number: string;
    tax_country: string;
};

export interface Wallet {
    created_at: string;
    updated_at: string;
    id: string;
    user_id: string;
    uuid: string;
    fincra_id: string | null;
    anchor_id: string | null;
    anchor_dep_acc_id: string | null;
    bridge_card_id: string | null;
    oval_id: string | null;
    mono_id: string | null;
    quidax_id: string | null;
    hifi_id: string | null;
    noah_id: string | null;
    brails_id: string | null;
}

export interface CryptoCurrency {
  provider: string;
  provider_code?: string;
  code: string;
  name: string;
  status: string;
  white_paper: string;
  meta_data: string;
  created_at: string;
  id: string;
  updated_at: string;
}

export interface WalletAccount {
  id: string;
  currency: string;
  status: 'active' | 'locked' | 'disabled';
  type: 'banking' | 'yield' | 'crypto-currency';
  balance_ledger: number;
  balance_available: number;
  earnings: number;
  lock_start: string;
  lock_end: string;
  created_datetime: string;
  updated_datetime: string;
  crypto_currency?: CryptoCurrency;
};
export type PaginatedResponse<T> = {
    payload: T[];
    "total": number;
    "size": number
    "rows": number;
    "page": number
};


type AddressObject = {
    city: string;
    line1: string;
    state: string;
    country: string;
    postal_code: string;

}
export interface VirtualAccount {
  id: string;
  wallet_id: string;
  provider: string;
  provider_code?: string;
  account_name?: string;
  account_number?: string;
  iban?: string;
  bank_name?: string;
  bank_code?: string;
  swift_code?: string;
  sort_code?: string;
  bank_address?: AddressObject;
  currency: "NGN" | "USD" | "GBP" | "CAD";
  status: "pending" | "active" | "suspended" | 'failed' | 'empty';
  created_at: string;
  updated_at: string;
  routing_number?: string;
  wire_routing_number?: string;
};
