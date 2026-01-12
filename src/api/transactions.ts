import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useCallback } from "react";
import apiClient from "src/pages/services/apiService";
import { API_ENDPOINTS } from "src/pages/services/endpointDefinition";
import { PaginatedResponse, TransactionWA } from "src/types";



export function useTransactions({
    limit = 20,
    wallet_id
}: {limit?: number; wallet_id: string}) {
    async function fetchWATransactions(pageNumber: number, limitNumber: number) {
        const res = await apiClient.get(`${API_ENDPOINTS.LIST_WA_TRANSACTIONS}?wallet_id=${wallet_id}&page=${pageNumber}&limit=${limitNumber}`);
        return res.data.payload as PaginatedResponse<TransactionWA>;


    }

   const  extractTransactionFromPayload = useCallback((data: InfiniteData<PaginatedResponse<TransactionWA>>): TransactionWA[] =>{
        const transactions: TransactionWA[] = [];
        data.pages.forEach(page => {
            transactions.push(...page.payload);
        });
        return transactions;

    }, [])

   const infiniteQueryResponse = useInfiniteQuery({
                initialPageParam: 1,
            queryKey: ['fetch-all-wallet-account-transactions', wallet_id],

            queryFn: ({ pageParam = 1 }) => fetchWATransactions(pageParam, limit),
            getNextPageParam: (lastPage) => {
                const morePagesExist = lastPage.page >= lastPage.rows;
                if (!morePagesExist) return undefined;
                return lastPage.page + 1;
            }
        })

    const transactions = extractTransactionFromPayload(infiniteQueryResponse.data!);

    return {
        ...infiniteQueryResponse,
        rawData: infiniteQueryResponse.data,
        data: transactions,
    }
}
