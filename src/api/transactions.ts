import { useInfiniteQuery, InfiniteData, useQuery, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import apiClient from "src/services/apiService";
import { API_ENDPOINTS } from "src/services/endpointDefinition";
import { PaginatedResponse, Payout, TransactionWA, VirtualAccount, WalletAccount } from "src/types";



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


export function usePayouts(limit = 20) {
    async function fetchWATransactions(pageNumber: number, limitNumber: number) {
        const res = await apiClient.get(`${API_ENDPOINTS.ALL_PAYOUTS}?page=${pageNumber}&limit=${limitNumber}`);
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
            queryKey: ['fetch-all-payouts'],

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