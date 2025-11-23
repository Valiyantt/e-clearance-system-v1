import { getBlueinkClient } from "./blueink"

export async function getSignedDocument(bundleId: string) {
  const client = getBlueinkClient()

  const bundle = await client.bundles.get(bundleId)

  if (bundle.status !== "completed") {
    throw new Error("Bundle is not yet signed by all parties")
  }

  return {
    downloadUrl: bundle.documentDownloadLink,
    status: bundle.status,
    signerInfo: bundle.signers.map((signer: any) => ({
      name: signer.name,
      email: signer.email,
      signedAt: signer.signedAt,
    })),
  }
}

export async function embedBlueinkSignatures(pdfBuffer: Buffer, bundleId: string) {
  try {
    const signedDoc = await getSignedDocument(bundleId)

    return {
      bundleId,
      signatureMetadata: {
        method: "blueink",
        signers: signedDoc.signerInfo,
        downloadUrl: signedDoc.downloadUrl,
      },
    }
  } catch (error) {
    console.error("Error embedding BlueInk signatures:", error)
    throw error
  }
}
