import { BusinessAddressInfo, BusinessBasicInfo, BusinessDocument } from "src/types";

const STORAGE_KEY = "business-wizard-data";

export type BusinessWizardData = Partial<BusinessBasicInfo> &
  Partial<BusinessAddressInfo> & { documents?: BusinessDocument[] };

export function readBusinessWizardData(): BusinessWizardData {
  if (typeof window === "undefined") return {};
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as BusinessWizardData;
  } catch {
    return {};
  }
}

export function saveBusinessWizardData(data: BusinessWizardData) {
  if (typeof window === "undefined") return;
  const existing = readBusinessWizardData();
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
}

export function clearBusinessWizardData() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
