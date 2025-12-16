'use client'

import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/**
 * Reusable ActionIcon component styled to match shadcn patterns.
 *
 * Props:
 * - icon: string (remixicon class e.g. 'ri-pencil-line')
 * - tooltip: string (tooltip text)
 * - onClick: function
 * - variant: 'ghost' | 'warning' | 'success' | 'destructive' | 'neutral' (default: 'neutral')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - className: additional classes
 *
 * Usage:
 * import ActionIcon from '@/components/ui/action-icon'          // default import
 * import { ActionIcon } from '@/components/ui/action-icon'      // named import
 *
 * <ActionIcon icon="ri-pencil-line" tooltip="Edit" onClick={...} variant="ghost" />
 */

const TOOLTIP_STYLE = 'bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm border-none'
const BASE_BTN = 'flex items-center justify-center rounded-full shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'

const VARIANT_CLASSES = {
    ghost: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
    warning: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
    success: 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white',
    destructive: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white',
    neutral: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-700 hover:text-white',
}

const SIZE_CLASSES = {
    sm: 'h-7 w-7 text-[12px]',
    md: 'h-8 w-8 text-sm',
    lg: 'h-9 w-9 text-base',
}

const ActionIcon = ({
    icon,
    tooltip = '',
    onClick = () => { },
    variant = 'neutral',
    size = 'md',
    className = '',
    ariaLabel,
}) => {
    const variantCls = VARIANT_CLASSES[variant] || VARIANT_CLASSES.neutral
    const sizeCls = SIZE_CLASSES[size] || SIZE_CLASSES.md

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    onClick={onClick}
                    aria-label={ariaLabel || tooltip}
                    className={`${BASE_BTN} ${variantCls} ${sizeCls} ${className}`}
                >
                    <i className={`${icon}`} />
                </button>
            </TooltipTrigger>

            <TooltipContent side="right" className={TOOLTIP_STYLE}>
                {tooltip}
            </TooltipContent>
        </Tooltip>
    )
}

export { ActionIcon }
export default ActionIcon