import { listAllCertifications } from '@/lib/content/admin-queries'
import { AdminPageHeader } from '@/components/admin/primitives'
import { CertificationsManager } from '@/components/admin/CertificationsManager'

export default async function AdminCertificationsPage() {
  const certifications = await listAllCertifications()

  return (
    <>
      <AdminPageHeader
        description="The Certifications list on the homepage. Hidden entries stay here and never reach the site."
        eyebrow="CV"
        title="Certifications"
      />
      <CertificationsManager certifications={certifications} />
    </>
  )
}
