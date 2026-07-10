// Enum values sourced from the "Create Business" API reference (POST /business).

function camelToTitle(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export type BusinessOption = { value: string; label: string };

export const BUSINESS_WIZARD_STEPS = ["Business Details", "Business Address", "Documents"];

export const ADDITIONAL_DOCUMENT_TYPES: BusinessOption[] = [
  { value: "incorporation_certificate", label: "Incorporation Certificate" },
  { value: "memorandum_articles", label: "Memorandum & Articles" },
  { value: "business_license", label: "Business License" },
];

export const BUSINESS_TYPES: BusinessOption[] = [
  { value: "soleProprietor", label: "Sole Proprietor" },
  { value: "singleMemberLLC", label: "Single Member LLC" },
  { value: "limitedLiabilityCompany", label: "Limited Liability Company" },
  { value: "generalPartnership", label: "General Partnership" },
  { value: "unlistedCorporation", label: "Unlisted Corporation" },
  { value: "publiclyTradedCorporation", label: "Publicly Traded Corporation" },
  { value: "association", label: "Association" },
  { value: "nonProfit", label: "Non-Profit" },
  { value: "governmentOrganization", label: "Government Organization" },
  { value: "revocableTrust", label: "Revocable Trust" },
  { value: "irrevocableTrust", label: "Irrevocable Trust" },
  { value: "estate", label: "Estate" },
  { value: "limitedPartnership", label: "Limited Partnership" },
  { value: "limitedLiabilityPartnership", label: "Limited Liability Partnership" },
];

export const ID_TYPES: BusinessOption[] = [
  { value: "ein", label: "EIN" },
  { value: "cac", label: "CAC" },
];

const INDUSTRY_VALUES = [
  "hotelMotel", "otherFoodServices", "restaurants", "artPhotography", "artsEntertainment",
  "fitnessSportsCenters", "sportsTeamsClubs", "construction", "buildingMaterialsHardware",
  "otherTradeContractor", "plumbingHVAC", "healthServices", "otherEducationServices",
  "otherHealthFitness", "accountingTaxPrep", "realEstate", "homeFurnishing",
  "beautyOrBarberShops", "carWash", "computerServiceRepair", "freelanceProfessional",
  "landscapeServices", "legalServices", "massageTanningServices", "otherProfessionalServices",
  "autoDealers", "onlineRetailer", "retail", "gasolineServiceStation", "otherTransportServices",
  "otherTravelServices", "parkingGarage", "staxi", "travelAgency", "truckingShipping",
  "wholesale", "warehouseDistribution", "otherAccomodation", "animalFarmingProduction",
  "cropFarming", "forestryActivities", "fishingHuntingTrapping",
  "otherAgricultureForestryFishing", "museumsHistoricalSites", "hospitals",
  "collegesUniversities", "Schools", "bankFinancialInstitution", "financialInvestments",
  "fundsTrustsOther", "insurance", "moneyTransferRemittance", "privateInvestmentCompanies",
  "otherManufacturing", "industrialCommercialMachinery", "employmentServices",
  "governmentAgency", "nonGovernmentOrganization", "religiousOrganization", "unions",
  "retailJewelerDiamondsGemsGold", "retailCash", "usedClothesDealers", "tourOperator",
  "wholesaleJeweler",
];

export const INDUSTRIES: BusinessOption[] = INDUSTRY_VALUES.map((value) => ({
  value,
  label: camelToTitle(value),
}));

const ID_COUNTRY_CODES = [
  "AD", "AE", "AG", "AI", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA",
  "BB", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT",
  "BV", "BW", "BY", "BZ", "CA", "CC", "CG", "CH", "CI", "CK", "CL", "CM", "CO", "CR", "CV",
  "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "EC", "EE", "EG", "EH", "ES", "FI",
  "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM",
  "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU",
  "ID", "IE", "IL", "IM", "IN", "IO", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH",
  "KI", "KM", "KN", "KR", "KW", "KY", "KZ", "LA", "LC", "LI", "LK", "LR", "LS", "LT", "LU",
  "LV", "MC", "MD", "ME", "MF", "MG", "MH", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU",
  "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NF", "NG", "NL", "NO", "NR", "NU", "NZ", "OM",
  "PA", "PE", "PF", "PG", "PH", "PL", "PM", "PN", "PR", "PT", "PW", "PY", "RE", "RO", "RS",
  "RU", "RW", "SA", "SB", "SC", "SE", "SG", "SH", "SJ", "SK", "SL", "SM", "SN", "SR", "SS",
  "ST", "SV", "SX", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
  "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VG", "VI",
  "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM",
];

const regionNames = typeof Intl !== "undefined" ? new Intl.DisplayNames(["en"], { type: "region" }) : undefined;

export const ID_COUNTRIES: BusinessOption[] = ID_COUNTRY_CODES.map((code) => ({
  value: code,
  label: regionNames?.of(code) ?? code,
}));

// Business address is only supported in these countries.
export const BUSINESS_ADDRESS_COUNTRIES: BusinessOption[] = ["NG", "KE", "GH"].map((code) => ({
  value: code,
  label: regionNames?.of(code) ?? code,
}));
