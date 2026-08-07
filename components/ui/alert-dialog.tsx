'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertDialogVariants = cva(
    cn(
      'fixed inset-0 z-50 flex items-center justify-center p-4'
    ),
  {
    variants: {
      variant: {
        default: '',
        primary: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface AlertDialogProps
  extends VariantProps<typeof alertDialogVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  cancelLabel?: string
  actionLabel?: string
  onAction?: () => void
  onCancel?: () => void
  actionVariant?: 'default' | 'destructive'
  className?: string
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = 'Cancel',
  actionLabel = 'Confirm',
  onAction,
  onCancel,
  actionVariant = 'default',
  className,
}: AlertDialogProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[var(--overlay)]" />
        <AlertDialogPrimitive.Content
          aria-describedby={description ? 'alert-dialog-description' : undefined}
          className={cn(alertDialogVariants(), className)}
        >
          <div className="relative z-10 w-full max-w-md rounded-lg bg-[var(--popover)] p-6 shadow-floating">
            <AlertDialogPrimitive.Title className="text-lg font-medium text-[var(--popover-foreground)]">
              {title}
            </AlertDialogPrimitive.Title>
            {description && (
              <AlertDialogPrimitive.Description
                className="mt-2 text-sm text-[var(--muted-foreground)]"
                id="alert-dialog-description"
              >
                {description}
              </AlertDialogPrimitive.Description>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <AlertDialogPrimitive.Cancel asChild>
                <button
                  className="rounded-md px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                  type="button"
                  onClick={onCancel}
                >
                  {cancelLabel}
                </button>
              </AlertDialogPrimitive.Cancel>
              <AlertDialogPrimitive.Action asChild>
                <button
                  className={cn(
                    'rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
                    actionVariant === 'destructive'
                      ? 'bg-[var(--danger)] text-[var(--danger-foreground)] hover:brightness-110'
                      : 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110'
                  )}
                  type="button"
                  onClick={onAction}
                >
                  {actionLabel}
                </button>
              </AlertDialogPrimitive.Action>
            </div>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}




