import { useMutation } from "@tanstack/react-query";
import businessApiClient from "src/services/businessApiService";
import { API_ENDPOINTS } from "src/services/endpointDefinition";
import { BusinessDocumentType, BusinessSignedUrlResponse } from "src/types";
import { BusinessWizardData } from "src/lib/business-wizard-storage";

export function useBusinessSignedUrl() {
  const getSignedUrl = async (payload: { type: BusinessDocumentType; mime_type: string }) => {
    const res = await businessApiClient.post(API_ENDPOINTS.BUSINESS_SIGNED_URL, payload);
    return res.data.data as BusinessSignedUrlResponse;
  };

  return useMutation({ mutationKey: ["business-signed-url"], mutationFn: getSignedUrl });
}

export function useSubmitBusinessForm() {
  const submitBusinessForm = async (payload: BusinessWizardData) => {
    const res = await businessApiClient.post(API_ENDPOINTS.BUSINESS_FORM, payload);
    return res.data.data;
  };

  return useMutation({ mutationKey: ["submit-business-form"], mutationFn: submitBusinessForm });
}
