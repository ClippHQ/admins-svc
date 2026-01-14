
import { useQuery, useMutation, useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { useCallback } from "react";
import apiClient from "src/services/apiService";
import { API_ENDPOINTS } from "src/services/endpointDefinition";
import { KYCVerification, PaginatedResponse, Profile, User } from "src/types";

type FetchProfileResponse = {
    profile: Profile;
    user: User;
    kyc_verification: KYCVerification;
};


export function useProfiles(limit = 20) {
    async function fetchProfile(pageNumber: number, limitNumber: number) {
        const res = await apiClient.get(`${API_ENDPOINTS.FETCH_USER_PROFILES}?page=${pageNumber}&limit=${limitNumber}`);
        return res.data.data as PaginatedResponse<Profile>;


    }

   const  extractProfileFromPayload = useCallback((data: InfiniteData<PaginatedResponse<Profile>>): Profile[] =>{
        if(!data) return [];
        
        const profiles: Profile[] = [];
        data.pages.forEach(page => {
            profiles.push(...page.payload);
        });
        return profiles;

    }, [])

   const infiniteQueryResponse = useInfiniteQuery({
                initialPageParam: 1,
            queryKey: ['fetch-all-profiles'],

            queryFn: ({ pageParam = 1 }) => fetchProfile(pageParam, limit),
            getNextPageParam: (lastPage) => {
                const morePagesExist = lastPage.page < lastPage.rows;
                if (!morePagesExist) return undefined;
                return lastPage.page + 1;
            }
        })

    const profiles = extractProfileFromPayload(infiniteQueryResponse.data!);

    return {
        ...infiniteQueryResponse,
        rawData: infiniteQueryResponse.data,
        data: profiles,
    }
}

export function useProfile({id, email}: {id?: string; email?: string}) {

    async function fetchUserProfile({user_id, email}: {user_id?: string; email?: string}) {
        if(!user_id && !email) throw new Error("Either user_id or email must be provided");
        if (user_id) {
            const res = await apiClient.get(`${API_ENDPOINTS.FETCH_USER_PROFILE}/${user_id}`);
            return res.data.data as FetchProfileResponse;
        }
        else {
            const res = await apiClient.get(`${API_ENDPOINTS.FETCH_USER_PROFILE_BY_EMAIL}/${email}`);
            return res.data.data as FetchProfileResponse;
        }
    }

    return useQuery<FetchProfileResponse, Error>({
        queryKey: ['fetch-user-profile', id ?? email],
        queryFn: () => fetchUserProfile({user_id: id, email}),
        enabled: !!id || !!email, // only run the query if id or email is provided
    });
}


export function useActivateDeactivateUserAccount() {
    async function deactivateUserAccount(user_id: string) {
        const res = await apiClient.post(`${API_ENDPOINTS.DEACTIVATE_USER_ACCOUNT}/${user_id}`);
        return res.data as {message: string};
    }

    async function activateUserAccount(user_id: string) {
        const res = await apiClient.post(`${API_ENDPOINTS.ACTIVATE_USER_ACCOUNT}/${user_id}`);
        return res.data as {message: string};
    }

    function activateDeactivateUserAccount(user_id: string, action: 'activate' | 'deactivate') {
        if(action === 'activate') {
            return activateUserAccount(user_id);
        }
        return deactivateUserAccount(user_id);
    }

    return useMutation<{message: string}, Error, {user_id: string; action: 'activate' | 'deactivate'}>({
        mutationFn: ({user_id, action}: {user_id: string; action: 'activate' | 'deactivate'}) => activateDeactivateUserAccount(user_id, action),
        mutationKey: ['activate-user-account']
    });
}
