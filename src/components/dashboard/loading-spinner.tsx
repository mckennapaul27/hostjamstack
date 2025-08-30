'use client'

import { ClipLoader } from 'react-spinners'

interface LoadingSpinnerProps {
  size?: number
  color?: string
  className?: string
}

export default function LoadingSpinner({
  size = 35,
  color = '#3b82f6',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ClipLoader color={color} size={size} />
    </div>
  )
}
