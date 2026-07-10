"use client";

import { useState } from "react";
import { Autocomplete, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useBusinessSignedUrl } from "src/api/business";
import { BusinessOption } from "src/lib/business-options";
import { uploadFileToSignedUrl } from "src/lib/upload-to-signed-url";
import { BusinessDocument, BusinessDocumentType } from "src/types";

const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg"];

type Props = {
  label: string;
  fixedType?: BusinessDocumentType;
  typeOptions?: BusinessOption[];
  onUploaded: (doc: BusinessDocument) => void;
};

export default function BusinessDocumentUpload({ label, fixedType, typeOptions, onUploaded }: Props) {
  const [selectedType, setSelectedType] = useState<BusinessDocumentType | "">(fixedType ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const signedUrlMutation = useBusinessSignedUrl();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const type = fixedType ?? selectedType;
    if (!type) {
      setError("Select a document type first");
      return;
    }

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setError("Only PDF or JPEG files are allowed");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const { upload_uri, public_uri } = await signedUrlMutation.mutateAsync({ type, mime_type: file.type });
      await uploadFileToSignedUrl(upload_uri, file);
      onUploaded({ type, url: public_uri });
      if (!fixedType) setSelectedType("");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const needsTypeSelection = !fixedType && !selectedType;

  return (
    <Box className="flex flex-col gap-2">
      <Typography variant="subtitle2">{label}</Typography>

      {typeOptions && (
        <Autocomplete
          options={typeOptions}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={typeOptions.find((option) => option.value === selectedType) ?? null}
          onChange={(_e, value) => setSelectedType((value?.value as BusinessDocumentType) ?? "")}
          renderInput={(params) => <TextField {...params} label="Document Type" size="small" />}
        />
      )}

      <Button variant="outlined" component="label" disabled={uploading || needsTypeSelection}>
        {uploading ? <CircularProgress size={20} /> : "Choose File"}
        <input type="file" accept=".pdf,.jpeg,.jpg,application/pdf,image/jpeg" hidden onChange={handleFileChange} />
      </Button>

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
}
