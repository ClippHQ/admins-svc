"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useSubmitBusinessForm } from "src/api/business";
import BusinessDocumentUpload from "src/components/business-document-upload";
import { ADDITIONAL_DOCUMENT_TYPES, BUSINESS_WIZARD_STEPS } from "src/lib/business-options";
import {
  clearBusinessWizardData,
  readBusinessWizardData,
  saveBusinessWizardData,
} from "src/lib/business-wizard-storage";
import { withApplicationToken } from "src/lib/application-token";
import { BusinessDocument } from "src/types";

export default function BusinessAccountStepThree() {
  const router = useRouter();
  const [documents, setDocuments] = useState<BusinessDocument[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitBusinessForm = useSubmitBusinessForm();

  useEffect(() => {
    const saved = readBusinessWizardData();
    if (!saved.name) {
      router.replace(withApplicationToken("/misc/business-account"));
      return;
    }
    if (!saved.address) {
      router.replace(withApplicationToken("/misc/business-account/address"));
      return;
    }
    if (saved.documents) {
      setDocuments(saved.documents);
    }
  }, [router]);

  function handleUploaded(doc: BusinessDocument) {
    setDocuments((prev) => {
      const next = [...prev.filter((d) => d.type !== doc.type), doc];
      saveBusinessWizardData({ documents: next });
      return next;
    });
  }

  function handleRemove(type: BusinessDocument["type"]) {
    setDocuments((prev) => {
      const next = prev.filter((d) => d.type !== type);
      saveBusinessWizardData({ documents: next });
      return next;
    });
  }

  const businessRegistration = documents.find((d) => d.type === "business_registration");
  const remainingAdditionalTypes = ADDITIONAL_DOCUMENT_TYPES.filter(
    (option) => !documents.some((d) => d.type === option.value)
  );

  async function handleSubmit() {
    if (!businessRegistration) {
      setSubmitError("Business registration document is required");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const saved = readBusinessWizardData();
      await submitBusinessForm.mutateAsync({ ...saved, documents });
      clearBusinessWizardData();
      router.push(withApplicationToken("/misc/business-account/success"));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { data?: { message?: string } } } })?.response?.data?.data?.message ||
        "Failed to create business account. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
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
              Step 3 of {BUSINESS_WIZARD_STEPS.length}: documents
            </div>

            <Stepper activeStep={2} className="mb-6">
              {BUSINESS_WIZARD_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Card variant="outlined" className="max-w-3xl">
              <CardContent>
                <Box className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Documents
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {documents.length} of 4 added
                    </Typography>
                  </div>

                  {documents.length > 0 && (
                    <Box className="flex flex-wrap gap-2">
                      {documents.map((doc) => (
                        <Chip key={doc.type} label={doc.type} onDelete={() => handleRemove(doc.type)} />
                      ))}
                    </Box>
                  )}

                  {businessRegistration ? (
                    <Typography variant="body2" color="textSecondary">
                      Business Registration uploaded.
                    </Typography>
                  ) : (
                    <BusinessDocumentUpload
                      label="Business Registration"
                      fixedType="business_registration"
                      onUploaded={handleUploaded}
                    />
                  )}

                  {remainingAdditionalTypes.length > 0 ? (
                    <BusinessDocumentUpload
                      label="Additional Document (optional)"
                      typeOptions={remainingAdditionalTypes}
                      onUploaded={handleUploaded}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      All optional documents added.
                    </Typography>
                  )}

                  <div className="flex items-center justify-between gap-4 mt-2">
                    <Button
                      variant="text"
                      onClick={() => router.push(withApplicationToken("/misc/business-account/address"))}
                    >
                      Back
                    </Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      <Snackbar
        open={!!submitError}
        autoHideDuration={5000}
        onClose={() => setSubmitError("")}
        message={submitError}
      />
    </div>
  );
}
