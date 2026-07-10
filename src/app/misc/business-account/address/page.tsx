"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { BUSINESS_ADDRESS_COUNTRIES, BUSINESS_WIZARD_STEPS } from "src/lib/business-options";
import { readBusinessWizardData, saveBusinessWizardData } from "src/lib/business-wizard-storage";
import { withApplicationToken } from "src/lib/application-token";
import { AddressObject, BusinessServiceInformation } from "src/types";

const DEFAULT_ADDRESS: AddressObject = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "NG",
  postal_code: "",
};

const DEFAULT_SERVICE_INFORMATION: BusinessServiceInformation = {
  estimated_annual_revenue: 0,
  expected_monthly_inflow: 0,
  financial_services_usage: false,
  third_party_usage: false,
};

type AddressErrors = Partial<Record<keyof AddressObject, string>>;

export default function BusinessAccountStepTwo() {
  const router = useRouter();
  const [address, setAddress] = useState<AddressObject>(DEFAULT_ADDRESS);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [includeServiceInformation, setIncludeServiceInformation] = useState(false);
  const [serviceInformation, setServiceInformation] = useState<BusinessServiceInformation>(
    DEFAULT_SERVICE_INFORMATION
  );

  useEffect(() => {
    const saved = readBusinessWizardData();
    if (!saved.name) {
      router.replace(withApplicationToken("/misc/business-account"));
      return;
    }
    if (saved.address) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress((prev) => ({ ...prev, ...saved.address }));
    }
    if (saved.service_information) {
      setServiceInformation((prev) => ({ ...prev, ...saved.service_information }));
      setIncludeServiceInformation(true);
    }
  }, [router]);

  function setAddressField<K extends keyof AddressObject>(field: K, value: AddressObject[K]) {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function setServiceInformationField<K extends keyof BusinessServiceInformation>(
    field: K,
    value: BusinessServiceInformation[K]
  ) {
    setServiceInformation((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): AddressErrors {
    const nextErrors: AddressErrors = {};
    if (!address.line1.trim()) nextErrors.line1 = "Address line 1 is required";
    if (!address.city.trim()) nextErrors.city = "City is required";
    if (!address.state.trim()) nextErrors.state = "State is required";
    if (!address.country) nextErrors.country = "Country is required";
    if (!address.postal_code.trim()) nextErrors.postal_code = "Postal code is required";
    return nextErrors;
  }

  function handleBack() {
    saveBusinessWizardData({
      address,
      service_information: includeServiceInformation ? serviceInformation : undefined,
    });
    router.push(withApplicationToken("/misc/business-account"));
  }

  function handleNext() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    saveBusinessWizardData({
      address,
      service_information: includeServiceInformation ? serviceInformation : undefined,
    });
    router.push(withApplicationToken("/misc/business-account/documents"));
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <Head>
        <title>Create Business - Kite Admin Dashboard</title>
        <meta name="description" content="Create a new business account." />
      </Head>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          <main className="col-span-12 md:col-span-10">
            <Typography variant="h5" component="h1" gutterBottom>
              Create Business Account
            </Typography>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Step 2 of {BUSINESS_WIZARD_STEPS.length}: business address
            </div>

            <Stepper activeStep={1} className="mb-6">
              {BUSINESS_WIZARD_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Card variant="outlined" className="max-w-3xl">
              <CardContent>
                <Box className="flex flex-col gap-4">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Business Address
                  </Typography>

                  <TextField
                    label="Address Line 1"
                    value={address.line1}
                    onChange={(e) => setAddressField("line1", e.target.value)}
                    error={!!errors.line1}
                    helperText={errors.line1}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Address Line 2"
                    value={address.line2}
                    onChange={(e) => setAddressField("line2", e.target.value)}
                    fullWidth
                  />

                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <TextField
                        label="City"
                        value={address.city}
                        onChange={(e) => setAddressField("city", e.target.value)}
                        error={!!errors.city}
                        helperText={errors.city}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid size={4}>
                      <TextField
                        label="State"
                        value={address.state}
                        onChange={(e) => setAddressField("state", e.target.value)}
                        error={!!errors.state}
                        helperText={errors.state}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid size={4}>
                      <TextField
                        label="Postal Code"
                        value={address.postal_code}
                        onChange={(e) => setAddressField("postal_code", e.target.value)}
                        error={!!errors.postal_code}
                        helperText={errors.postal_code}
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    select
                    label="Country"
                    value={address.country}
                    onChange={(e) => setAddressField("country", e.target.value)}
                    error={!!errors.country}
                    helperText={errors.country}
                    required
                    fullWidth
                  >
                    {BUSINESS_ADDRESS_COUNTRIES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Divider className="my-2" />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeServiceInformation}
                        onChange={(e) => setIncludeServiceInformation(e.target.checked)}
                      />
                    }
                    label="Add service information (optional)"
                  />

                  {includeServiceInformation && (
                    <Box className="flex flex-col gap-4">
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <TextField
                            label="Estimated Annual Revenue"
                            type="number"
                            value={serviceInformation.estimated_annual_revenue}
                            onChange={(e) =>
                              setServiceInformationField("estimated_annual_revenue", Number(e.target.value))
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            label="Expected Monthly Inflow"
                            type="number"
                            value={serviceInformation.expected_monthly_inflow}
                            onChange={(e) =>
                              setServiceInformationField("expected_monthly_inflow", Number(e.target.value))
                            }
                            fullWidth
                          />
                        </Grid>
                      </Grid>

                      <FormControlLabel
                        control={
                          <Switch
                            checked={serviceInformation.financial_services_usage}
                            onChange={(e) =>
                              setServiceInformationField("financial_services_usage", e.target.checked)
                            }
                          />
                        }
                        label="Financial Services Usage"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={serviceInformation.third_party_usage}
                            onChange={(e) => setServiceInformationField("third_party_usage", e.target.checked)}
                          />
                        }
                        label="Third-Party Usage"
                      />
                    </Box>
                  )}

                  <div className="flex items-center justify-between gap-4 mt-2">
                    <Button variant="text" onClick={handleBack}>
                      Back
                    </Button>
                    <div className="flex items-center gap-4">
                      <Link href="/misc">
                        <Button variant="text">Cancel</Button>
                      </Link>
                      <Button variant="contained" onClick={handleNext}>
                        Next
                      </Button>
                    </div>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
