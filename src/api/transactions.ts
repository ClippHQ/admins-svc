import { useInfiniteQuery, InfiniteData, useQuery, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import apiClient from "src/services/apiService";
import { API_ENDPOINTS } from "src/services/endpointDefinition";
import { Conversion, PaginatedResponse, Payout, Profile, TransactionWA, VirtualAccount, WalletAccount } from "src/types";



type FethhVirtualAccountDetailsResponse = {
    data: {
        account: VirtualAccount;
        profile: Profile;
    };
    message: string;
    success: boolean;
}

export function useTransactions({
    limit = 20,
    wallet_id
}: {limit?: number; wallet_id: string}) {
    async function fetchWATransactions(pageNumber: number, limitNumber: number) {
        const res = await apiClient.get(`${API_ENDPOINTS.LIST_WA_TRANSACTIONS}?wallet_id=${wallet_id}&page=${pageNumber}&limit=${limitNumber}`);
        return res.data.data as PaginatedResponse<TransactionWA>;


    }

   const  extractTransactionFromPayload = useCallback((data?: InfiniteData<PaginatedResponse<TransactionWA>>): TransactionWA[] =>{
    console.log("Extracting transactions from payload", data);
        const transactions: TransactionWA[] = [];
        console.log("Pages:", data);
        data?.pages.forEach(page => {
            transactions.push(...page.payload);
        });
        return transactions;

    }, [])

   const infiniteQueryResponse = useInfiniteQuery({
                initialPageParam: 1,
            queryKey: ['fetch-all-wallet-account-transactions', wallet_id],

            queryFn: ({ pageParam = 1 }) => fetchWATransactions(pageParam, limit),
            getNextPageParam: (lastPage) => {
                console.log({lastPage})
                if(!lastPage) return undefined;
                const morePagesExist = lastPage.page <= lastPage.rows;
                if (!morePagesExist) return undefined;
                return lastPage.page + 1;
            }
        })

    const transactions = extractTransactionFromPayload(infiniteQueryResponse.data);

    return {
        ...infiniteQueryResponse,
        rawData: infiniteQueryResponse.data,
        data: transactions,
    }
}


export function usePayouts({limit = 20, status = 'all'}: {limit?: number, status?: string}) {
    async function fetchWATransactions(pageNumber: number, limitNumber: number) {
        const res = await apiClient.get(`${API_ENDPOINTS.ALL_PAYOUTS}?page=${pageNumber}&limit=${limitNumber}${status && status !== 'all' ? `&status=${status}` : ''}`);
        return res.data as PaginatedResponse<Payout>;


    }



   const  extractPayoutsFromPayload = useCallback((data?: InfiniteData<PaginatedResponse<Payout>>): Payout[] =>{
        const payouts: Payout[] = [];
        console.log("Pages:", data);
        data?.pages.forEach(page => {
            payouts.push(...page.payload);
        });
        return payouts;

    }, [])

   const infiniteQueryResponse = useInfiniteQuery({
                initialPageParam: 1,
            queryKey: ['fetch-all-payouts', status],

            queryFn: ({ pageParam = 1 }) => fetchWATransactions(pageParam, limit),
            getNextPageParam: (lastPage) => {
                console.log({lastPage})
                if(!lastPage) return undefined;
                const morePagesExist = lastPage.page <= lastPage.rows;
                if (!morePagesExist) return undefined;
                return lastPage.page + 1;
            }
        })

    const payouts = extractPayoutsFromPayload(infiniteQueryResponse.data);

    return {
        ...infiniteQueryResponse,
        rawData: infiniteQueryResponse.data,
        data: payouts,
    }
}

export function usePayoutDetails(payout_id: string) {
    const fetchPayoutDetails = async (payout_id: string) => {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_PAYOUT_DETAILS}/${payout_id}`);
        return res.data.data as {payout: Payout; profile: Profile};
    }
    return useQuery({
        queryKey: ['fetch-payout-details', payout_id],
        queryFn: () => fetchPayoutDetails(payout_id),
        enabled: !!payout_id, // only run the query if payout_id is provided
    });
}


export function useWalletAccounts(wallet_id: string = '') {

    const fetchWalletAccounts = async (wallet_id: string) => {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_WALLET_ACCOUNTS}/${wallet_id}`);
  
        return res.data.data as WalletAccount[];
    }

    return useQuery<WalletAccount[], Error>({
        queryKey: ['fetch-wallet-accounts', wallet_id],
        queryFn: () => fetchWalletAccounts(wallet_id),
        enabled: !!wallet_id, // only run the query if wallet_id is provided
    });

}

export function useVirtualAccounts(wallet_id: string = '') {

    const fetchVirtualAccounts = async (wallet_id: string) => {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_VIRTUAL_ACCOUNTS}/${wallet_id}`);
  
        return res.data.data as VirtualAccount[];
    }

    return useQuery<VirtualAccount[], Error>({
        queryKey: ['fetch-virtual-accounts', wallet_id],
        queryFn: () => fetchVirtualAccounts(wallet_id),
        enabled: !!wallet_id, // only run the query if wallet_id is provided
    });

}


export function useAllVirtualAccounts({ limit = 20, status = 'all', currency = 'all', provider = 'all' }: { limit?: number; status?: string; currency?: string; provider?: string }) {
    async function fetchAllVirtualAccounts(pageNumber: number, limitNumber: number) {
        const params = new URLSearchParams({ page: String(pageNumber), limit: String(limitNumber) });
        if (status && status !== 'all') params.append('status', status);
        if (currency && currency !== 'all') params.append('currency', currency);
        if (provider && provider !== 'all') params.append('provider', provider);
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_ALL_VIRTUAL_ACCOUNTS}?${params.toString()}`);
        return res.data as PaginatedResponse<VirtualAccount>;
    }

    const extractVirtualAccountsFromPayload = useCallback((data?: InfiniteData<PaginatedResponse<VirtualAccount>>): VirtualAccount[] => {
        const accounts: VirtualAccount[] = [];
        data?.pages.forEach(page => {
            accounts.push(...page.payload);
        });
        return accounts;
    }, []);

    const infiniteQueryResponse = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['fetch-all-virtual-accounts', status, currency, provider],
        queryFn: ({ pageParam = 1 }) => fetchAllVirtualAccounts(pageParam, limit),
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            const morePagesExist = lastPage.page <= lastPage.rows;
            if (!morePagesExist) return undefined;
            return lastPage.page + 1;
        }
    });

    const virtualAccounts = extractVirtualAccountsFromPayload(infiniteQueryResponse.data);

    return {
        ...infiniteQueryResponse,
        rawData: infiniteQueryResponse.data,
        data: virtualAccounts,
    };
}


export function useAddRemovePayoutLien() {
    const addRemovePayoutLien = async (payload: {wallet_id: string; action: 'add' | 'remove'}) => {
        const res = await apiClient.post(API_ENDPOINTS.ADD_REMOVE_PAYOUT_LIEN + '/' + payload.wallet_id, { action: payload.action });
        return res.data;
    }

    return useMutation({
        mutationFn: addRemovePayoutLien,
        mutationKey: ['add-remove-payout-lien'],
    });
}

function resolveConversionFilter(filterValue: string, filterKey: string) {
    if (filterValue === 'all' || !filterValue) return '';
    return `&${filterKey}=${filterValue}`;
}

export function useConversions({ limit = 20, filterDict = {} }: { limit?: number; filterDict?: Partial<Record<string, string>> }) {
    async function fetchConversions(pageNumber: number, limitNumber: number) {
        const filterQuery = Object.entries(filterDict).map(([key, value]) => resolveConversionFilter(value!, key)).join('');
        const res = await apiClient.get(`${API_ENDPOINTS.GET_ALL_CONVERSIONS}?page=${pageNumber}&limit=${limitNumber}${filterQuery}`);
        return res.data as PaginatedResponse<Conversion>;
    }

    const extractConversionsFromPayload = useCallback((data?: InfiniteData<PaginatedResponse<Conversion>>): Conversion[] => {
        const conversions: Conversion[] = [];
        data?.pages.forEach(page => {
            conversions.push(...page.payload);
        });
        return conversions;
    }, []);

    const infiniteQueryResponse = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['fetch-all-conversions', filterDict],
        queryFn: ({ pageParam = 1 }) => fetchConversions(pageParam, limit),
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            const morePagesExist = lastPage.page <= lastPage.rows;
            if (!morePagesExist) return undefined;
            return lastPage.page + 1;
        }
    });

    const conversions = extractConversionsFromPayload(infiniteQueryResponse.data);

    return {
        ...infiniteQueryResponse,
        rawData: infiniteQueryResponse.data,
        data: conversions,
    };
}

export function useConversionDetails(conversion_id: string) {
    const fetchConversionDetails = async (id: string) => {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_CONVERSION_DETAILS}/${id}`);
        return res.data.data as { conversion: Conversion; profile: Profile };
    };
    return useQuery({
        queryKey: ['fetch-conversion-details', conversion_id],
        queryFn: () => fetchConversionDetails(conversion_id),
        enabled: !!conversion_id,
    });
}

export function useVirtualAccountDetails(virtual_account_id: string = '') {

    const fetchVirtualAccountDetails = async (virtual_account_id: string) => {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_VIRTUAL_ACCOUNT_DETAILS}/${virtual_account_id}`);
  
        return res.data as FethhVirtualAccountDetailsResponse;
    }

    return useQuery<FethhVirtualAccountDetailsResponse, Error>({
        queryKey: ['fetch-virtual-account-details', virtual_account_id],
        queryFn: () => fetchVirtualAccountDetails(virtual_account_id),
        enabled: !!virtual_account_id, // only run the query if virtual_account_id is provided
    });

}