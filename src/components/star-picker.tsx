'use client'

import { useState } from 'react'
import { StarIcon } from 'lucide-react'

import { cn } from '~/lib/utils'

interface StarPickerProps {
  value?: number
  onChange?: (value: number) => void
  disabled?: boolean
  className?: string
}

export const StarPicker = ({
  value = 0,
  onChange,
  disabled = false,
  className
}: StarPickerProps) => {
  const [haverValue, setHaverValue] = useState(0)

  const MAX_RATING = [1, 2, 3, 4, 5]

  return (
    <div
      className={cn('flex items-center', disabled && 'opacity-50 cursor-not-allowed', className)}>
      {MAX_RATING.map(star => (
        <button
          key={star}
          type='button'
          disabled={disabled}
          className={cn('p-0.5 hover:scale-125 transition', !disabled && 'cursor-pointer')}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHaverValue(star)}
          onMouseLeave={() => setHaverValue(0)}>
          <StarIcon
            className={cn(
              'size-6',
              (value || haverValue) >= star ? 'fill-black stroke-black' : 'stroke-black'
            )}
          />
        </button>
      ))}
    </div>
  )
}
