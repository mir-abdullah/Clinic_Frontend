'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import ErrorState from '@/components/error/ErrorState'

export default function VisitsError({
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
      eyebrow="Visits"
      title="We couldn't load the Visits Dashboard"
    />
  )
}