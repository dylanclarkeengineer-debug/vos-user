import * as React from 'react'
// Thêm import cva
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  'h-11 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-all outline-none md:text-sm file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      mode: {
        edit: 'bg-white border-blue-500 ring-2 ring-blue-100 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        view: 'bg-neutral-50 border-neutral-200',
        readOnly: 'bg-neutral-100 border-neutral-200 text-neutral-500 font-medium cursor-not-allowed',
      },
    },
    defaultVariants: {
      mode: 'edit',
    },
  }
)
function Input({ className, type, mode, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ mode, className }))}
      {...props}
    />
  )
}

export { Input }