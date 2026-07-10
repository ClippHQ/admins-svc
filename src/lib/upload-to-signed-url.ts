export async function uploadFileToSignedUrl(uploadUri: string, file: File): Promise<void> {
  const res = await fetch(uploadUri, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }
}
