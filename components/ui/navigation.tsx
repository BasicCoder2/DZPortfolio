'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { IconButton } from './icon-button'

export interface NavItemProps {
  href: string
  label: string
  active?: boolean
  onClick?: () => void
}

function NavItem({ href, label, active = false, onClick }: NavItemProps) {
  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors duration-[var(--transition-fast)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
        active && 'bg-[var(--surface-muted)] text-[var(--foreground)]'
      )}
      href={href}
      onClick={onClick}
    >
      {label}
    </Link>
  )
}

export interface NavGroupProps {
  label: string
  children: React.ReactNode
}

function NavGroup({ label, children }: NavGroupProps) {
  return (
    <div aria-label={label} className="flex items-center gap-2">
      {children}
    </div>
  )
}

export interface DesktopNavProps {
  items: NavItemProps[]
}

function DesktopNav({ items }: DesktopNavProps) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
      {items.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </nav>
  )
}

export interface MobileNavProps {
  items: NavItemProps[]
}

function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="md:hidden">
      <IconButton
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        variant="ghost"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </IconButton>
      {open ? (
        <div className="absolute left-4 right-4 top-16 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
          <nav aria-label="Mobile primary" className="flex flex-col gap-2">
            {items.map((item) => (
              <NavItem key={item.href} {...item} onClick={() => setOpen(false)} />
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  )
}

export interface ThemeSwitcherProps {
  className?: string
}

function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <IconButton
      aria-label="Toggle theme"
      className={className}
      variant="ghost"
      onClick={toggleTheme}
    >
      {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </IconButton>
  )
}

export { DesktopNav, MobileNav, NavGroup, NavItem, ThemeSwitcher }
