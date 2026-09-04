'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteEngagementAction, setEngagementVisibilityAction } from '@/lib/actions/engagement'
import type { EngagementOption } from '@/lib/content/models'
import {
  AdminEmptyState,
  AdminList,
  AdminListRow,
  MetaLine,
  StatusPill,
} from '@/components/admin/primitives'
import { ContentRowActions } from '@/components/admin/ContentRowActions'
import { EngagementForm } from '@/components/admin/EngagementForm'
import { AddRecordButton, InlinePanel } from '@/components/admin/InlinePanel'

/**
 * Engagement (pricing) list with inline create and edit.
 *
 * The rendered price line is the most important thing on each row — it is what
 * a visitor reads — so it is shown at the size it will actually appear rather
 * than reduced to the raw fields that produced it.
 */
export function EngagementManager({ options }: { options: EngagementOption[] }) {
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
          <InlinePanel title="New engagement option" onCancel={() => setOpen(null)}>
            <EngagementForm option={null} onSaved={handleSaved} />
          </InlinePanel>
        ) : (
          <AddRecordButton label="Add option" onClick={() => setOpen('new')} />
        )}
      </div>

      {options.length === 0 ? (
        <AdminEmptyState
          description="The Engagement section is hidden from the homepage until at least one option is published."
          title="No engagement options yet"
        />
      ) : (
        <AdminList>
          {options.map((option) => (
            <AdminListRow key={option.id}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="text-lg font-semibold text-text-primary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                    type="button"
                    onClick={() => setOpen(open === option.id ? null : option.id)}
                  >
                    {option.title}
                  </button>
                  <StatusPill status={option.published ? 'visible' : 'hidden'} />
                  {option.recommended && (
                    <span className="rounded-full border border-accent-green/40 px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-green">
                      Recommended
                    </span>
                  )}
                </div>

                <p className="mt-2 text-2xl font-semibold text-text-primary">
                  {option.priceDisplay}
                </p>
                {option.description !== '' && (
                  <p className="mt-2 max-w-2xl text-sm text-text-secondary">{option.description}</p>
                )}

                <MetaLine>
                  <span>{currencyLabel(option)}</span>
                  <span>
                    {option.items.length} item{option.items.length === 1 ? '' : 's'}
                  </span>
                  <span>Order {option.displayOrder}</span>
                </MetaLine>

                {open === option.id && (
                  <div className="mt-6">
                    <InlinePanel title="Edit pricing" onCancel={() => setOpen(null)}>
                      <EngagementForm option={option} onSaved={handleSaved} />
                    </InlinePanel>
                  </div>
                )}
              </div>

              <ContentRowActions
                deleteAction={deleteEngagementAction}
                deleteDescription="This cannot be undone. The tier disappears from the Engagement section."
                draftValue="false"
                field="published"
                id={option.id}
                isLive={option.published}
                liveValue="true"
                name={option.title}
                publishLabel="Show"
                statusAction={setEngagementVisibilityAction}
                unpublishLabel="Hide"
              />
            </AdminListRow>
          ))}
        </AdminList>
      )}
    </>
  )
}

function currencyLabel(option: EngagementOption): string {
  switch (option.currency) {
    case 'USD':
      return 'USD'
    case 'ZMW':
      return 'ZMW'
    case 'BOTH':
      return 'USD and ZMW'
    default:
      return 'Text only'
  }
}
