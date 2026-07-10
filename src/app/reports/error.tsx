'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import ErrorState from '@/components/error/ErrorState'

export default function ReportsError({
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
      eyebrow="Reports"
      title="We couldn't generate this report"
      fallbackMessage="Try again — if it keeps failing, the export may be timing out on a large date range."
    />
  )
}