import Link from 'next/link'

export default function NotFound() {
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
            backgroundColor: '#eff6ff',
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
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="M8 11h6" />
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
          404
        </p>

        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '0.5rem',
          }}
        >
          We couldn&apos;t find that page
        </h2>   

        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1.75rem',
            lineHeight: 1.5,
          }}
        >
          The page or record you&apos;re looking for doesn&apos;t exist, may have been
          removed, or the link might be incorrect.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 600,
            padding: '0.625rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
          }}
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}