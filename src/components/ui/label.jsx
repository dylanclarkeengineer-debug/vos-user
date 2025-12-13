import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva } from 'class-variance-authority' // Thêm cva

import { cn } from '@/lib/utils'

const labelVariants = cva(
  'flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-sm leading-none font-medium',
        form: 'text-xs font-bold text-neutral-500 uppercase tracking-wider',
        primary: "text-xl font-bold text-gray-900",
        secondary: "text-lg font-semibold text-gray-700",
        title: "text-xs font-bold text-gray-700",
        normal_text: "text-sm text-gray-500",
      },
    },
    defaultVariants: {
      variant: 'form',
    },
  }
)

function Label({ className, variant, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        labelVariants({ variant, className })
      )}
      {...props}
    />
  )
}

export { Label, labelVariants }