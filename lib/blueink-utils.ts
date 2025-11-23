import { getBlueinkClient } from "./blueink"

export async function createClearanceBundle(
  studentEmail: string,
  studentName: string,
  facultyEmail: string,
  facultyName: string,
  department: string,
  documentUrl: string,
) {
  const client = getBlueinkClient()

  const bundle = await client.bundles.create({
    signers: [
      {
        email: studentEmail,
        name: studentName,
        signerType: "signer",
        // Student signs first
        signingOrder: 1,
      },
      {
        email: facultyEmail,
        name: facultyName,
        signerType: "signer",
        // Faculty signs second (after student)
        signingOrder: 2,
      },
    ],
    documents: [
      {
        url: documentUrl,
        name: `${studentName}_Clearance_${department}.pdf`,
      },
    ],
    webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/blueink/webhook`,
    tags: {
      department,
      studentName,
      studentEmail,
      type: "clearance",
    },
    // Expire after 30 days if not signed
    expiresIn: 30,
  })

  return {
    bundleId: bundle.id,
    studentSignLink: bundle.signers[0].signLink,
    facultySignLink: bundle.signers[1].signLink,
    status: bundle.status,
  }
}

export async function getBundleStatus(bundleId: string) {
  const client = getBlueinkClient()
  const bundle = await client.bundles.get(bundleId)

  return {
    bundleId: bundle.id,
    status: bundle.status,
    isComplete: bundle.status === "completed",
    signingProgress: {
      total: bundle.signers.length,
      signed: bundle.signers.filter((s: any) => s.signedAt).length,
    },
    signers: bundle.signers.map((signer: any) => ({
      email: signer.email,
      name: signer.name,
      isSigned: !!signer.signedAt,
      signedAt: signer.signedAt,
    })),
  }
}

export async function downloadSignedDocument(bundleId: string) {
  const client = getBlueinkClient()
  const bundle = await client.bundles.get(bundleId)

  return {
    downloadUrl: bundle.documentDownloadUrl,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  }
}
