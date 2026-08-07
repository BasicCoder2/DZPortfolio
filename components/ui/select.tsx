'use client'

import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const triggerVariants = {
  default:
    'bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-sm focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2',
  filled:
    'bg-[var(--surface-subtle)] border border-transparent rounded-[var(--radius-md)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2',
}

const errorTriggerStyles = 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]'

export interface SelectProps extends RadixSelect.SelectProps {
  variant?: 'default' | 'filled'
  error?: boolean
  placeholder?: string
  children: React.ReactNode
  className?: string
}

export function Select({ variant = 'default', error = false, placeholder, children, className, ...props }: SelectProps) {
  return (
    <RadixSelect.Root {...props}>
      <RadixSelect.Trigger
        className={cn(
          'flex h-10 w-full items-center justify-between px-3 py-2 text-sm text-[var(--foreground)] transition-colors data-[state=open]:border-[var(--ring)]',
          triggerVariants[variant],
          error && errorTriggerStyles,
          className
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon asChild>
          <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          className="overflow-hidden rounded-[var(--radius-md)] bg-[var(--background)] shadow-[var(--shadow-md)] border border-[var(--border)]"
          position="popper"
          sideOffset={4}
        >
          <RadixSelect.ScrollUpButton className="flex items-center justify-center py-1">
            <ChevronDown className="h-4 w-4 rotate-180" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className="p-1">
            {children}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex items-center justify-center py-1">
            <ChevronDown className="h-4 w-4" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

export interface SelectItemProps extends RadixSelect.SelectItemProps {
  children: React.ReactNode
}

export function SelectItem({ children, className, ...props }: SelectItemProps) {
  return (
    <RadixSelect.Item
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-[var(--radius-sm)] py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-[var(--surface-subtle)] data-[highlighted]:text-[var(--foreground)] data-[state=checked]:text-[var(--primary)]',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <RadixSelect.ItemIndicator>
          <Check className="h-4 w-4 text-[var(--primary)]" />
        </RadixSelect.ItemIndicator>
      </span>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  )
}

export { RadixSelect }




