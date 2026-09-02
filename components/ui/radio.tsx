'use client'

import * as RadixRadio from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

export type RadioVariant = 'default' | 'primary'

export interface RadioGroupProps extends ComponentPropsWithoutRef<typeof RadixRadio.Root> {
  variant?: RadioVariant
  orientation?: 'horizontal' | 'vertical'
  error?: boolean
}

export interface RadioContextValue {
  variant: RadioVariant
  error?: boolean
}

const RadioContext = createContext<RadioContextValue>({ variant: 'default' })

function useRadioContext() {
  return useContext(RadioContext)
}

const groupVariantStyles: Record<RadioVariant, string> = {
  default: 'text-[var(--foreground)]',
  primary: 'text-[var(--foreground)]',
}

const itemVariantStyles: Record<RadioVariant, string> = {
  default: cn(
    'border-[var(--border)] text-[var(--foreground)]',
    'focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
    'data-[state=checked]:border-[var(--foreground)]'
  ),
  primary: cn(
    'border-[var(--primary)]',
    'focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
    'data-[state=checked]:border-[var(--primary)]'
  ),
}

const indicatorVariantStyles: Record<RadioVariant, string> = {
  default: 'bg-[var(--foreground)]',
  primary: 'bg-[var(--primary)]',
}

const errorStyles = 'border-[var(--danger)] data-[state=checked]:border-[var(--danger)]'

export function RadioGroup({
  variant = 'default',
  error = false,
  orientation = 'vertical',
  className,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <RadioContext.Provider value={{ variant, error }}>
      <RadixRadio.Root
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-3',
          groupVariantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </RadixRadio.Root>
    </RadioContext.Provider>
  )
}

export interface RadioItemProps extends ComponentPropsWithoutRef<typeof RadixRadio.Item> {
  label?: string
}

export function RadioItem({ label, className, children, id, ...props }: RadioItemProps) {
  const { variant, error } = useRadioContext()
  const isInvalid = error

  return (
    <div className="flex items-center gap-2">
      <RadixRadio.Item
        className={cn(
          'h-4 w-4 shrink-0 rounded-full border-2 transition-colors duration-[var(--transition-fast)]',
          'focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          itemVariantStyles[variant],
          isInvalid && errorStyles,
          className
        )}
        id={id}
        {...props}
      >
        <RadixRadio.Indicator className="flex items-center justify-center">
          <Circle className={cn('h-2 w-2 fill-current', indicatorVariantStyles[variant])} />
        </RadixRadio.Indicator>
      </RadixRadio.Item>
      {label && (
        <label
          className="text-sm font-medium text-[var(--foreground)] cursor-pointer select-none"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  )
}
