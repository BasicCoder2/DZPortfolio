'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  deleteCertificationAction,
  setCertificationVisibilityAction,
} from '@/lib/actions/certifications'
import type { Certification } from '@/lib/content/models'
import {
  AdminEmptyState,
  AdminList,
  AdminListRow,
  MetaLine,
  StatusPill,
} from '@/components/admin/primitives'
import { ContentRowActions } from '@/components/admin/ContentRowActions'
import { CertificationForm } from '@/components/admin/CertificationForm'
import { AddRecordButton, InlinePanel } from '@/components/admin/InlinePanel'

/** Certifications list with inline create and edit. Mirrors ExperienceManager. */
export function CertificationsManager({ certifications }: { certifications: Certification[] }) {
  const router = useRouter()
  const [open, setOpen] = useState<string | 'new' | null>(null)

  const handleSaved = useCallback(() => {
    setOpen(null)
    router.refresh()
  }, [router])

  return (
    <>
      <div className="mb-8">
        {open === 'new' ? (
          <InlinePanel title="New certification" onCancel={() => setOpen(null)}>
            <CertificationForm certification={null} onSaved={handleSaved} />
          </InlinePanel>
        ) : (
          <AddRecordButton label="Add certification" onClick={() => setOpen('new')} />
        )}
      </div>

      {certifications.length === 0 ? (
        <AdminEmptyState
          description="The Certifications section is hidden from the homepage until at least one entry is published."
          title="No certifications yet"
        />
      ) : (
        <AdminList>
          {certifications.map((certification) => (
            <AdminListRow key={certification.id}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="text-lg font-semibold text-text-primary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                    type="button"
                    onClick={() => setOpen(open === certification.id ? null : certification.id)}
                  >
                    {certification.title}
                  </button>
                  <StatusPill status={certification.published ? 'visible' : 'hidden'} />
                </div>

                <p className="mt-1 text-text-secondary">{certification.issuer}</p>

                <MetaLine>
                  <span>{certification.issuedLabel}</span>
                  {certification.credentialId && <span>ID {certification.credentialId}</span>}
                  <span>Order {certification.displayOrder}</span>
                  {certification.credentialUrl && <span>Verifiable</span>}
                </MetaLine>

                {open === certification.id && (
                  <div className="mt-6">
                    <InlinePanel title="Edit certification" onCancel={() => setOpen(null)}>
                      <CertificationForm certification={certification} onSaved={handleSaved} />
                    </InlinePanel>
                  </div>
                )}
              </div>

              <ContentRowActions
                deleteAction={deleteCertificationAction}
                deleteDescription="This cannot be undone. Any badge image is removed from storage too."
                draftValue="false"
                field="published"
                id={certification.id}
                isLive={certification.published}
                liveValue="true"
                name={certification.title}
                publishLabel="Show"
                statusAction={setCertificationVisibilityAction}
                unpublishLabel="Hide"
              />
            </AdminListRow>
          ))}
        </AdminList>
      )}
    </>
  )
}
