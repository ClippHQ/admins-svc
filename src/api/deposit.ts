import { useQuery, useMutation, useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useCallback } from "react";
import apiClient from "src/services/apiService";
import { API_ENDPOINTS } from "src/services/endpointDefinition";
import { Deposit, KYCVerification, PaginatedResponse, Profile, Wallet } from "src/types";

type FetchDepositResponse = {deposit: Deposit; profile: Profile; wallet: Wallet; kyc_verification: KYCVerification}

export function useDeposits(limit = 20) {
    async function fetchDeposit(pageNumber: number, limitNumber: number) {
        const res = await apiClient.get(`${API_ENDPOINTS.ALL_DEPOSITS}?page=${pageNumber}&limit=${limitNumber}`);
        return res.data as PaginatedResponse<Deposit>;


    }

   const  extractDepositFromPayload = useCallback((data: InfiniteData<PaginatedResponse<Deposit>>): Deposit[] =>{
        if(!data) return [];
        
        const deposits: Deposit[] = [];
        data.pages.forEach(page => {
            deposits.push(...page.payload);
        });
        return deposits;

    }, [])

   const infiniteQueryResponse = useInfiniteQuery({
                initialPageParam: 1,
            queryKey: ['fetch-all-deposits'],

            queryFn: ({ pageParam = 1 }) => fetchDeposit(pageParam, limit),
            getNextPageParam: (lastPage) => {
                const morePagesExist = lastPage.page >= lastPage.rows;
                if (!morePagesExist) return undefined;
                return lastPage.page + 1;
            }
        })

    const deposits = extractDepositFromPayload(infiniteQueryResponse.data!);

    return {
        ...infiniteQueryResponse,
        rawData: infiniteQueryResponse.data,
        data: deposits,
    }
}

export function useDeposit(id: string) {

    const fetchDepositDetails = async (deposit_id: string) => {
        const res = await apiClient.get(`${API_ENDPOINTS.DEPOSIT_DETAILS}/${deposit_id}`);
  
        return res.data.data as FetchDepositResponse;
    }

    return useQuery<FetchDepositResponse, Error>({
        queryKey: ['deposit', id],
        queryFn: () => fetchDepositDetails(id),
        enabled: !!id, // only run the query if id is provided
    });

}

export function useConfirmRejectDepositMtn() {
    const confirmRejectDeposit = async (payload: {deposit_id: string; action: 'confirm' | 'reject', reason: string}) => {
        const res = await apiClient.post(API_ENDPOINTS.CONFIRM_REJECT_DEPOSIT_MTN + '/' + payload.deposit_id, { action: payload.action, reason: payload.reason });
        return res.data;
    }

    return useMutation({
        mutationKey: ['confirm-reject-deposit-mtn'],
        mutationFn: confirmRejectDeposit,
    })
}