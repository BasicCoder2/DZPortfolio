import { listAllEngagementOptions } from '@/lib/content/admin-queries'
import { AdminPageHeader } from '@/components/admin/primitives'
import { EngagementManager } from '@/components/admin/EngagementManager'

export default async function AdminEngagementPage() {
  const options = await listAllEngagementOptions()

  return (
    <>
      <AdminPageHeader
        description="Pricing tiers for the Engagement section. Each tier shows either a fixed amount in USD, in kwacha, in both, or free text such as Custom Quote."
        eyebrow="Commercial"
        title="Engagement"
      />
      <EngagementManager options={options} />
    </>
  )
}
