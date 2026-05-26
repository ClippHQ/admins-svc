import { useQuery } from "@tanstack/react-query";
import { Rates } from "src/lib/amount";
import apiClient from "src/services/apiService";
import { API_ENDPOINTS } from "src/services/endpointDefinition";


type ProviderBalances = Record<"smile_id" | "brails" | "graph", Array<{currency: "USD" | "NGN" | "EUR" | "GBP"; balance: number}>>;


export function useProviderBalances() {
    const fetchProviderBalances = async () => {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_PROVIDER_BALANCES}`);
        return res.data.data as ProviderBalances;
    }

    return useQuery<ProviderBalances, Error>({
        queryKey: ['provider-balances'],
        queryFn: fetchProviderBalances,
    });
}


export function useWalletBalances() {
    const fetchWalletBalances = async () => {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_WALLET_BALANCES}`);
        return res.data.data as Array<{ currency: string; total_balance: number }>;
    }

    return useQuery<Array<{ currency: string; total_balance: number }>, Error>({
        queryKey: ['wallet-balances'],
        queryFn: fetchWalletBalances,
    });
}

export function useConversionsToNGN() {
    const fetchConversionsToNGN = async () => {
        const res = await apiClient.get(`${API_ENDPOINTS.CONVERSIONS_TO_NGN}`);
        return res.data.data as { total_converted_amount: number };
    }

    return useQuery<{ total_converted_amount: number }, Error>({
        queryKey: ['conversions-to-ngn'],
        queryFn: fetchConversionsToNGN,
    });
}

export function useRecentlyApprovedAmounts() {
    const fetchRecentlyApprovedAmounts = async () => {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_RECENTLY_APPROVED_AMOUNTS}`);
        return res.data.data as Array<{ currency: string; amount: number }>;
    };

    return useQuery<Array<{ currency: string; amount: number }>, Error>({
        queryKey: ['recently-approved-amounts'],
        queryFn: fetchRecentlyApprovedAmounts,
    });
}

export function useRates() {
    const fetchRates = async () => {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_RATES}`);
        return res.data.data as Rates;
    }

    return useQuery<Rates, Error>({
        queryKey: ['rates'],
        queryFn: fetchRates,
    });
}