import { useQuery } from "@tanstack/react-query";
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

