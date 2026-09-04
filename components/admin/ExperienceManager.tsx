'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteExperienceAction, setExperienceVisibilityAction } from '@/lib/actions/experience'
import type { ExperienceEntry } from '@/lib/content/models'
import {
  AdminEmptyState,
  AdminList,
  AdminListRow,
  MetaLine,
  StatusPill,
} from '@/components/admin/primitives'
import { ContentRowActions } from '@/components/admin/ContentRowActions'
import { ExperienceForm } from '@/components/admin/ExperienceForm'
import { AddRecordButton, InlinePanel } from '@/components/admin/InlinePanel'

/**
 * Experience list with inline create and edit.
 *
 * Experience entries have no page of their own — they render as rows in a
 * homepage section — so sending the operator to a dedicated route to change
 * two dates would be more navigation than the record deserves. One row is open
 * at a time, which keeps the "which form am I in" question from arising.
 *
 * `router.refresh()` after a save re-runs the server component and pulls the
 * updated list down; the Server Action has already revalidated the public
 * homepage by then.
 */
export function ExperienceManager({ entries }: { entries: ExperienceEntry[] }) {
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
          <InlinePanel title="New experience entry" onCancel={() => setOpen(null)}>
            <ExperienceForm entry={null} onSaved={handleSaved} />
          </InlinePanel>
        ) : (
          <AddRecordButton label="Add entry" onClick={() => setOpen('new')} />
        )}
      </div>

      {entries.length === 0 ? (
        <AdminEmptyState
          description="The Experience section is hidden from the homepage until at least one entry is published."
          title="No experience entries yet"
        />
      ) : (
        <AdminList>
          {entries.map((entry) => (
            <AdminListRow key={entry.id}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="text-lg font-semibold text-text-primary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                    type="button"
                    onClick={() => setOpen(open === entry.id ? null : entry.id)}
                  >
                    {entry.organization}
                  </button>
                  <StatusPill status={entry.published ? 'visible' : 'hidden'} />
                </div>

                <p className="mt-1 text-text-secondary">{entry.role}</p>
                {entry.summary !== '' && (
                  <p className="mt-2 max-w-2xl text-sm text-text-secondary">{entry.summary}</p>
                )}

                <MetaLine>
                  <span>{entry.period}</span>
                  {entry.location !== '' && <span>{entry.location}</span>}
                  <span>Order {entry.displayOrder}</span>
                </MetaLine>

                {open === entry.id && (
                  <div className="mt-6">
                    <InlinePanel title="Edit entry" onCancel={() => setOpen(null)}>
                      <ExperienceForm entry={entry} onSaved={handleSaved} />
                    </InlinePanel>
                  </div>
                )}
              </div>

              <ContentRowActions
                deleteAction={deleteExperienceAction}
                deleteDescription="This cannot be undone. The entry is removed from the homepage timeline."
                draftValue="false"
                field="published"
                id={entry.id}
                isLive={entry.published}
                liveValue="true"
                name={`${entry.role} at ${entry.organization}`}
                publishLabel="Show"
                statusAction={setExperienceVisibilityAction}
                unpublishLabel="Hide"
              />
            </AdminListRow>
          ))}
        </AdminList>
      )}
    </>
  )
}
