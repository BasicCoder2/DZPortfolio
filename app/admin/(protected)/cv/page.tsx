import { requireAdmin } from '@/lib/auth/admin'
import { AdminPageHeader } from '@/components/admin/primitives'
import { CvForm } from '@/components/admin/CvForm'

export default async function AdminCvPage() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('site_cv')
    .select('*')
    .eq('id', 'current')
    .maybeSingle()
  return (
    <>
      <AdminPageHeader
        description="Upload your latest CV and update every download button on the site."
        eyebrow="Downloads"
        title="CV"
      />
      <div className="max-w-2xl space-y-6">
        {error ? (
          <p role="alert">
            CV setup is incomplete or unavailable. Apply the CV migration in Supabase and reload
            this page.
          </p>
        ) : (
          <>
            <p className="text-text-secondary">
              {data
                ? `Current CV: ${data.filename}. Updated ${new Date(data.updated_at).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC.`
                : 'No hosted CV yet. Upload a PDF to replace the existing download.'}
            </p>
            <a className="inline-block text-accent-green underline" href="/cv">
              Download current CV
            </a>
            <CvForm />
          </>
        )}
      </div>
    </>
  )
}
