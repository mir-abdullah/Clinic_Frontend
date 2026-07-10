'use client'

import { useState } from 'react'

interface ErrorStateProps {
  error: Error & { digest?: string }
  /** Prefer this — re-fetches and re-renders the segment from the server */
  unstable_retry?: () => void
  /** Fallback if unstable_retry isn't provided by this Next.js version */
  reset?: () => void
  /** Small uppercase label above the heading, e.g. "REPORTS" */
  eyebrow?: string
  /** Main heading shown to the user */
  title?: string
  /** Body copy shown when there's no digest (client-side error) */
  fallbackMessage?: string
}

export default function ErrorState({
  error,
  unstable_retry,
  reset,
  eyebrow = 'Something went wrong',
  title = "We couldn't load this page",
  fallbackMessage = 'Please try again, or contact support if the problem persists.',
}: ErrorStateProps) {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = () => {
    setRetrying(true)
    if (typeof unstable_retry === 'function') {
      unstable_retry()
    } else if (typeof reset === 'function') {
      reset()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: '0.75rem',
          padding: '2.5rem 2rem',
          maxWidth: '420px',
          width: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '9999px',
            backgroundColor: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#9ca3af',
            marginBottom: '0.5rem',
          }}
        >
          {eyebrow}
        </p>

        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1.75rem',
            lineHeight: 1.5,
          }}
        >
          {error.digest
            ? 'An unexpected error occurred. If this keeps happening, please contact support.'
            : error.message || fallbackMessage}
        </p>

        <button
          onClick={handleRetry}
          disabled={retrying}
          style={{
            backgroundColor: retrying ? '#93c5fd' : '#2563eb',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 600,
            padding: '0.625rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: retrying ? 'default' : 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          {retrying ? 'Retrying…' : 'Try again'}
        </button>

        {error.digest && (
          <p
            style={{
              fontSize: '0.6875rem',
              color: '#d1d5db',
              marginTop: '1.25rem',
            }}
          >
            Error ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}