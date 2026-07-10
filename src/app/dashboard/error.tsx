'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import ErrorState from '@/components/error/ErrorState'

export default function DashboardError({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string }
  unstable_retry?: () => void
  reset?: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorState
      error={error}
      unstable_retry={unstable_retry}
      reset={reset}
      eyebrow="Dashboard"
      title="We couldn't load the dashboard"
    />
  )
}