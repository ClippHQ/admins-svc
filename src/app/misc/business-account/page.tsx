"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { BUSINESS_TYPES, BUSINESS_WIZARD_STEPS, ID_COUNTRIES, ID_TYPES, INDUSTRIES } from "src/lib/business-options";
import { readBusinessWizardData, saveBusinessWizardData } from "src/lib/business-wizard-storage";
import { withApplicationToken } from "src/lib/application-token";
import { BusinessBasicInfo } from "src/types";

const DEFAULT_FORM: BusinessBasicInfo = {
  name: "",
  email: "",
  phone: "",
  business_type: "soleProprietor",
  industry: "",
  id_type: "ein",
  id_number: "",
  id_country: "NG",
  dof: "",
};

type FormErrors = Partial<Record<keyof BusinessBasicInfo, string>>;

const PHONE_NUMBER_PATTERN = /^\+[1-9]\d{7,14}$/;

export default function BusinessAccountStepOne() {
  const router = useRouter();
  const [form, setForm] = useState<BusinessBasicInfo>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const saved = readBusinessWizardData();
    if (Object.keys(saved).length > 0) {
      // sessionStorage is only available client-side, so this must run post-mount
      // rather than in the initial state (which would cause an SSR hydration mismatch).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({ ...prev, ...saved }));
    }
  }, []);

  function setField<K extends keyof BusinessBasicInfo>(field: K, value: BusinessBasicInfo[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Business name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone is required";
    } else if (!PHONE_NUMBER_PATTERN.test(form.phone.trim())) {
      nextErrors.phone = "Phone must start with +country code";
    }
    if (!form.industry) nextErrors.industry = "Industry is required";
    if (!form.id_number.trim()) nextErrors.id_number = "ID number is required";
    if (!form.id_country) nextErrors.id_country = "ID country is required";
    if (!form.dof) nextErrors.dof = "Date of formation is required";
    return nextErrors;
  }

  function handleNext() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    saveBusinessWizardData(form);
    router.push(withApplicationToken("/misc/business-account/address"));
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
              Step 1 of {BUSINESS_WIZARD_STEPS.length}: business details
            </div>

            <Stepper activeStep={0} className="mb-6">
              {BUSINESS_WIZARD_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Card variant="outlined" className="max-w-3xl">
              <CardContent>
                <Box className="flex flex-col gap-4">
                  <TextField
                    label="Business Name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                    fullWidth
                  />

                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <TextField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        label="Phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone || "Use international format, e.g. +2348012345678"}
                        slotProps={{
                          htmlInput: {
                            inputMode: "tel",
                            pattern: "\\+[1-9][0-9]{7,14}",
                          },
                        }}
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <TextField
                        select
                        label="Business Type"
                        value={form.business_type}
                        onChange={(e) => setField("business_type", e.target.value)}
                        fullWidth
                      >
                        {BUSINESS_TYPES.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={6}>
                      <Autocomplete
                        options={INDUSTRIES}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        value={INDUSTRIES.find((option) => option.value === form.industry) ?? null}
                        onChange={(_e, value) => setField("industry", value?.value ?? "")}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Industry"
                            error={!!errors.industry}
                            helperText={errors.industry}
                            required
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <TextField
                        select
                        label="ID Type"
                        value={form.id_type}
                        onChange={(e) => setField("id_type", e.target.value as BusinessBasicInfo["id_type"])}
                        fullWidth
                      >
                        {ID_TYPES.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={4}>
                      <TextField
                        label="ID Number"
                        value={form.id_number}
                        onChange={(e) => setField("id_number", e.target.value)}
                        error={!!errors.id_number}
                        helperText={errors.id_number}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid size={4}>
                      <Autocomplete
                        options={ID_COUNTRIES}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        value={ID_COUNTRIES.find((option) => option.value === form.id_country) ?? null}
                        onChange={(_e, value) => setField("id_country", value?.value ?? "")}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="ID Country"
                            error={!!errors.id_country}
                            helperText={errors.id_country}
                            required
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    label="Date of Formation"
                    type="date"
                    value={form.dof}
                    onChange={(e) => setField("dof", e.target.value)}
                    error={!!errors.dof}
                    helperText={errors.dof}
                    slotProps={{ inputLabel: { shrink: true } }}
                    required
                    fullWidth
                  />

                  <div className="flex items-center justify-between gap-4 mt-2">
                    <Link href="/misc">
                      <Button variant="text">Cancel</Button>
                    </Link>
                    <Button variant="contained" onClick={handleNext}>
                      Next
                    </Button>
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
