import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // --- Standard Variants ---
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',

        // --- NEW: Custom Variants cho Project ---

        // 1. Nút chính màu xanh (Create New Ad)
        brand: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent',

        // 2. Nút xem chi tiết nhỏ (View Post)
        'brand-subtle': 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 uppercase tracking-wider font-bold border-none',

        // 3. Nút phân trang (Pagination)
        pagination: 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-black border border-transparent',
        'pagination-active': 'bg-neutral-900 text-white hover:bg-black border border-neutral-900',

        // 4. Icon Actions (Edit, Copy...)
        'icon-ghost': 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 bg-transparent',

        // 5. Icon Delete (Màu đỏ)
        'icon-destructive': 'text-red-500 hover:bg-red-50 hover:text-red-600 bg-transparent',

        // 6. Icon Promote (Màu cam)
        'icon-warning': 'text-orange-500 hover:bg-orange-50 hover:text-orange-600 bg-transparent',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
        'icon-sm': 'h-8 w-8', // Size cho các nút action trong bảng
        'icon-lg': 'size-10',
        // Size siêu nhỏ cho nút View Post
        xs: 'h-7 px-3 text-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }