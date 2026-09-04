import { listAllExperience } from '@/lib/content/admin-queries'
import { AdminPageHeader } from '@/components/admin/primitives'
import { ExperienceManager } from '@/components/admin/ExperienceManager'

export default async function AdminExperiencePage() {
  const entries = await listAllExperience()

  return (
    <>
      <AdminPageHeader
        description="The timeline in the Experience section of the homepage. Hidden entries stay here and never reach the site."
        eyebrow="CV"
        title="Experience"
      />
      <ExperienceManager entries={entries} />
    </>
  )
}
